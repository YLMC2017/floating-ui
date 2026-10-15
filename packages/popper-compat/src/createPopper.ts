import {
  arrow as arrowMiddleware,
  autoPlacement,
  computePosition,
  flip,
  hide,
  limitShift,
  offset,
  shift,
} from '@floating-ui/dom';
import type {Placement as FloatingPlacement} from '@floating-ui/core';
import {
  getOverflowAncestors,
  getWindow,
  isElement,
} from '@floating-ui/utils/dom';

import {applyStyles, computeStyles} from './computeStyles';
import {mergeByName, orderModifiers} from './orderModifiers';
import type {
  Boundary,
  Instance,
  ModifierArguments,
  ModifierObject,
  Options,
  Padding,
  Placement,
  PositioningStrategy,
  Rect,
  RootBoundary,
  State,
  VirtualElement,
} from './types';

const defaultFn = () => undefined;

const DEFAULT_OPTIONS: Options = {
  placement: 'bottom',
  strategy: 'absolute',
  modifiers: [],
};

type ScrollTarget = Element | Window | VisualViewport;

function isVirtualElement(value: unknown): value is VirtualElement {
  return (
    !!value &&
    typeof value === 'object' &&
    'getBoundingClientRect' in value &&
    typeof (value as VirtualElement).getBoundingClientRect === 'function' &&
    !isElement(value)
  );
}

function scrollParentsOf(element: Element | VirtualElement): ScrollTarget[] {
  if (isElement(element)) {
    return getOverflowAncestors(element);
  }
  if (element.contextElement && isElement(element.contextElement)) {
    return getOverflowAncestors(element.contextElement);
  }
  return [];
}

function toRect(element: Element | VirtualElement): Rect {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
  };
}

function mapBoundary(boundary: Boundary | undefined) {
  if (boundary == null || boundary === 'clippingParents') {
    return 'clippingAncestors' as const;
  }
  return boundary;
}

function normalizePadding(
  padding: Padding | undefined,
  state?: {placement: string; rects: {reference: Rect; floating: Rect}},
): number | Partial<{top: number; right: number; bottom: number; left: number}> {
  if (typeof padding !== 'function') {
    return padding ?? 0;
  }
  return (
    padding({
      placement: (state?.placement || 'bottom') as Placement,
      reference: state?.rects.reference || {x: 0, y: 0, width: 0, height: 0},
      popper: state?.rects.floating || {x: 0, y: 0, width: 0, height: 0},
    }) ?? 0
  );
}

function mapOffset(value: unknown, placement: Placement) {
  if (typeof value === 'function') {
    return (state: {placement: string; rects: {reference: Rect; floating: Rect}}) => {
      const result = value({
        placement: state.placement || placement,
        reference: state.rects.reference,
        popper: state.rects.floating,
      });
      const [skidding, distance] = Array.isArray(result) ? result : [0, result];
      return {mainAxis: distance || 0, crossAxis: skidding || 0};
    };
  }
  if (Array.isArray(value)) {
    const [skidding, distance] = value;
    return {mainAxis: distance || 0, crossAxis: skidding || 0};
  }
  if (typeof value === 'number') {
    return {mainAxis: value, crossAxis: 0};
  }
  return 0;
}

function resolveArrowElement(element: unknown, popper: HTMLElement) {
  if (!element) {
    return undefined;
  }
  if (typeof element === 'string') {
    return popper.querySelector(element) || undefined;
  }
  return element as HTMLElement;
}

function isAutoPlacement(placement: string) {
  return placement === 'auto' || placement.startsWith('auto-');
}

function findEnabled(modifiers: ModifierObject[], name: string) {
  return modifiers.find((modifier) => modifier.name === name && modifier.enabled !== false);
}

function usesDefaultFn(modifier: ModifierObject | undefined) {
  return !!modifier && modifier.fn === defaultFn;
}

const passive: AddEventListenerOptions = {passive: true};

function eventListenersEffect({state, instance, options}: ModifierArguments<any>) {
  const {scroll = true, resize = true} = options || {};
  const win = getWindow(state.elements.popper);
  const targets = new Set<ScrollTarget>([
    ...state.scrollParents.reference,
    ...state.scrollParents.popper,
  ]);

  if (scroll) {
    targets.forEach((target) => {
      target.addEventListener('scroll', instance.update, passive);
    });
  }
  if (resize) {
    win.addEventListener('resize', instance.update, passive);
  }

  return () => {
    if (scroll) {
      targets.forEach((target) => {
        target.removeEventListener('scroll', instance.update, passive);
      });
    }
    if (resize) {
      win.removeEventListener('resize', instance.update, passive);
    }
  };
}

function baseModifier(
  definition: Partial<ModifierObject> & {name: string},
): ModifierObject {
  return {
    enabled: true,
    phase: 'main',
    fn: defaultFn,
    data: {},
    ...definition,
  };
}

export const defaultModifiers: ModifierObject[] = [
  baseModifier({
    name: 'eventListeners',
    phase: 'write',
    effect: eventListenersEffect,
  }),
  baseModifier({name: 'popperOffsets', phase: 'read'}),
  baseModifier({name: 'computeStyles', phase: 'beforeWrite'}),
  baseModifier({
    name: 'applyStyles',
    phase: 'write',
    requires: ['computeStyles'],
  }),
  baseModifier({name: 'offset', phase: 'main', requires: ['popperOffsets']}),
  baseModifier({
    name: 'flip',
    phase: 'main',
    requiresIfExists: ['offset'],
  }),
  baseModifier({
    name: 'preventOverflow',
    phase: 'main',
    requiresIfExists: ['offset'],
  }),
  baseModifier({
    name: 'arrow',
    phase: 'main',
    requires: ['popperOffsets'],
    requiresIfExists: ['preventOverflow'],
  }),
  baseModifier({
    name: 'hide',
    phase: 'main',
    requiresIfExists: ['preventOverflow'],
  }),
];

const liteModifiers = defaultModifiers.filter((modifier) =>
  ['eventListeners', 'popperOffsets', 'computeStyles', 'applyStyles'].includes(
    modifier.name,
  ),
);

function overflowOptions(options: any, placement: Placement) {
  return {
    padding: normalizePadding(options?.padding, {
      placement,
      rects: {
        reference: {x: 0, y: 0, width: 0, height: 0},
        floating: {x: 0, y: 0, width: 0, height: 0},
      },
    }),
    boundary: mapBoundary(options?.boundary),
    rootBoundary: (options?.rootBoundary || 'viewport') as RootBoundary,
    altBoundary: Boolean(options?.altBoundary),
  };
}

function buildMiddleware(
  modifiers: ModifierObject[],
  placement: Placement,
  popper: HTMLElement,
) {
  const middleware = [];
  const offsetModifier = findEnabled(modifiers, 'offset');
  const flipModifier = findEnabled(modifiers, 'flip');
  const preventOverflowModifier = findEnabled(modifiers, 'preventOverflow');
  const arrowModifier = findEnabled(modifiers, 'arrow');
  const hideModifier = findEnabled(modifiers, 'hide');
  const canFlip = usesDefaultFn(flipModifier);

  if (usesDefaultFn(offsetModifier)) {
    const rawOffset = offsetModifier?.options?.offset ?? [0, 0];
    middleware.push(offset(mapOffset(rawOffset, placement)));
  }

  if (canFlip && isAutoPlacement(placement)) {
    const alignment = placement.split('-')[1];
    const flipOptions = flipModifier?.options || {};
    const allowed = Array.isArray(flipOptions.allowedAutoPlacements)
      ? flipOptions.allowedAutoPlacements.filter(
          (item: string) => !isAutoPlacement(item),
        )
      : undefined;
    middleware.push(
      autoPlacement({
        ...(alignment === 'start' || alignment === 'end' ? {alignment} : null),
        ...overflowOptions(flipOptions, 'bottom'),
        ...(allowed ? {allowedPlacements: allowed} : null),
      }),
    );
  } else if (canFlip) {
    const flipOptions = flipModifier?.options || {};
    middleware.push(
      flip({
        mainAxis: flipOptions.mainAxis !== false,
        crossAxis: flipOptions.altAxis !== false,
        fallbackPlacements: flipOptions.fallbackPlacements,
        flipAlignment: flipOptions.flipVariations !== false,
        ...overflowOptions(flipOptions, placement),
      }),
    );
  }

  if (usesDefaultFn(preventOverflowModifier)) {
    const preventOptions = preventOverflowModifier?.options || {};
    const tether = preventOptions.tether !== false;
    const tetherOffset = preventOptions.tetherOffset ?? 0;
    middleware.push(
      shift({
        mainAxis: preventOptions.mainAxis !== false,
        crossAxis: preventOptions.altAxis === true,
        ...overflowOptions(preventOptions, placement),
        ...(tether
          ? null
          : {
              limiter: limitShift(
                typeof tetherOffset === 'number' ? {offset: tetherOffset} : {},
              ),
            }),
      }),
    );
  }

  if (usesDefaultFn(arrowModifier)) {
    const arrowOptions = arrowModifier?.options || {};
    const element = resolveArrowElement(arrowOptions.element, popper);
    if (element) {
      const padding = arrowOptions.padding;
      middleware.push(
        arrowMiddleware({
          element,
          padding: normalizePadding(padding, {
            placement,
            rects: {
              reference: {x: 0, y: 0, width: 0, height: 0},
              floating: {x: 0, y: 0, width: 0, height: 0},
            },
          }),
        }),
      );
    }
  }

  if (usesDefaultFn(hideModifier)) {
    const hideOptions = overflowOptions(hideModifier?.options || {}, placement);
    middleware.push(hide({...hideOptions, strategy: 'referenceHidden'}));
    middleware.push(hide({...hideOptions, strategy: 'escaped'}));
  }

  return {middleware, computePlacement: isAutoPlacement(placement) ? 'bottom' : placement};
}

function assignArrowData(target: State['modifiersData'], arrowData: any) {
  if (!arrowData) {
    return;
  }
  const data: {x?: number; y?: number; centerOffset: number} = {
    centerOffset: arrowData.centerOffset ?? 0,
  };
  if (arrowData.x != null) {
    data.x = arrowData.x;
  }
  if (arrowData.y != null) {
    data.y = arrowData.y;
  }
  target.arrow = data;
}

export function popperGenerator(
  generatorOptions: {
    defaultModifiers?: Array<Partial<ModifierObject>>;
    defaultOptions?: Partial<Options>;
  } = {},
) {
  const generatorModifiers = generatorOptions.defaultModifiers || [];
  const generatorDefaults: Options = {
    ...DEFAULT_OPTIONS,
    ...generatorOptions.defaultOptions,
  };

  return function createPopper(
    reference: Element | VirtualElement,
    popper: HTMLElement,
    options: Partial<Options> = generatorDefaults,
  ): Instance {
    let destroyed = false;
    let running = false;
    let rerun = false;
    let didFirstUpdate = false;
    let scheduled: Promise<Partial<State>> | null = null;
    const effectCleanups: Array<() => void> = [];

    const state = {
      elements: {
        reference,
        popper,
      },
      options: {...generatorDefaults},
      placement: generatorDefaults.placement,
      strategy: generatorDefaults.strategy,
      orderedModifiers: [] as ModifierObject[],
      rects: {
        reference: {x: 0, y: 0, width: 0, height: 0},
        popper: {x: 0, y: 0, width: 0, height: 0},
      },
      scrollParents: {
        reference: [] as ScrollTarget[],
        popper: [] as ScrollTarget[],
      },
      styles: {} as State['styles'],
      attributes: {} as State['attributes'],
      modifiersData: {} as State['modifiersData'],
      reset: false,
    } as State;

    const instance = {
      state,
      destroy() {
        destroyed = true;
        cleanupEffects();
      },
      forceUpdate() {
        void performUpdate();
      },
      setOptions(setOptionsAction) {
        cleanupEffects();
        const nextOptions =
          typeof setOptionsAction === 'function'
            ? setOptionsAction(state.options)
            : setOptionsAction;

        state.options = {
          ...generatorDefaults,
          ...state.options,
          ...nextOptions,
          modifiers: nextOptions.modifiers || state.options.modifiers || [],
        };
        state.strategy = state.options.strategy || 'absolute';
        state.placement = state.options.placement || 'bottom';
        state.scrollParents = {
          reference: scrollParentsOf(reference),
          popper: scrollParentsOf(popper),
        };

        const merged = mergeByName([
          ...generatorModifiers,
          ...(state.options.modifiers || []),
        ]);
        state.orderedModifiers = orderModifiers(merged).filter(
          (modifier) => modifier.enabled !== false,
        ) as State['orderedModifiers'];
        runEffects();
        return instance.update();
      },
      update() {
        if (!scheduled) {
          scheduled = Promise.resolve().then(async () => {
            scheduled = null;
            await performUpdate();
            return state;
          });
        }
        return scheduled;
      },
    } as Instance;

    function cleanupEffects() {
      effectCleanups.splice(0).forEach((cleanup) => {
        cleanup();
      });
    }

    function runEffects() {
      state.orderedModifiers.forEach((modifier) => {
        if (typeof modifier.effect !== 'function') {
          return;
        }
        const cleanup = modifier.effect({
          state,
          instance,
          options: modifier.options || {},
          name: modifier.name,
        });
        if (typeof cleanup === 'function') {
          effectCleanups.push(cleanup);
        }
      });
    }

    async function performUpdate() {
      if (destroyed) {
        return;
      }
      if (running) {
        rerun = true;
        return;
      }
      running = true;
      try {
        do {
          rerun = false;
          await runOnce();
        } while (rerun && !destroyed);
      } finally {
        running = false;
      }
    }

    async function runOnce() {
      if (destroyed || !reference || !popper || !isVirtualElement(reference) && !isElement(reference)) {
        return;
      }
      if (!popper.getBoundingClientRect) {
        return;
      }

      const placement = (state.options.placement || 'bottom') as Placement;
      const ordered = state.orderedModifiers;
      state.placement = placement;
      state.strategy = state.options.strategy || 'absolute';
      state.reset = false;
      state.rects = {
        reference: toRect(reference),
        popper: toRect(popper),
      };
      state.styles = {popper: {}};
      state.attributes = {popper: {}};
      state.modifiersData = {};
      ordered.forEach((modifier) => {
        state.modifiersData[modifier.name] = {...modifier.data};
      });

      const arrowModifier = findEnabled(ordered, 'arrow');
      const arrowElement = usesDefaultFn(arrowModifier)
        ? resolveArrowElement(arrowModifier?.options?.element, popper)
        : undefined;
      if (arrowElement instanceof HTMLElement) {
        state.elements.arrow = arrowElement;
      } else {
        delete state.elements.arrow;
      }

      const {middleware, computePlacement} = buildMiddleware(
        ordered,
        placement,
        popper,
      );
      const floating = await computePosition(reference, popper, {
        placement: computePlacement as FloatingPlacement,
        strategy: state.strategy,
        middleware,
      });

      state.placement = floating.placement as Placement;
      state.modifiersData.popperOffsets = {x: floating.x, y: floating.y};
      state.modifiersData.preventOverflow = {x: floating.x, y: floating.y};
      if (floating.middlewareData.offset) {
        state.modifiersData.offset = {
          [floating.placement]: {
            x: floating.middlewareData.offset.x ?? 0,
            y: floating.middlewareData.offset.y ?? 0,
          },
        };
      }
      assignArrowData(state.modifiersData, floating.middlewareData.arrow);

      const hideData = floating.middlewareData.hide;
      if (hideData) {
        state.modifiersData.hide = {
          isReferenceHidden: !!hideData.referenceHidden,
          hasPopperEscaped: !!hideData.escaped,
          referenceClippingOffsets: hideData.referenceHiddenOffsets || {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          },
          popperEscapeOffsets: hideData.escapedOffsets || {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          },
        };
        state.attributes.popper = {
          ...state.attributes.popper,
          'data-popper-reference-hidden': !!hideData.referenceHidden,
          'data-popper-escaped': !!hideData.escaped,
        };
      }

      ordered.forEach((modifier) => {
        if (modifier.name === 'computeStyles' && modifier.fn === defaultFn) {
          computeStyles({state, options: modifier.options || {}});
          return;
        }
        if (modifier.name === 'applyStyles' && modifier.fn === defaultFn) {
          applyStyles(state);
          return;
        }
        if (typeof modifier.fn !== 'function' || modifier.fn === defaultFn) {
          return;
        }
        const result = modifier.fn({
          state,
          instance,
          options: modifier.options || {},
          name: modifier.name,
        });
        if (result) {
          Object.assign(state, result);
        }
      });

      if (!didFirstUpdate) {
        didFirstUpdate = true;
        state.options.onFirstUpdate?.(state);
      }
    }

    if (!reference || !popper) {
      return instance;
    }

    void instance.setOptions(options);
    return instance;
  };
}

export const createPopper = popperGenerator({defaultModifiers});
export const createPopperLite = popperGenerator({defaultModifiers: liteModifiers});
export const createPopperBase = popperGenerator();
