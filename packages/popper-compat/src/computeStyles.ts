import {
  getComputedStyle,
  getDocumentElement,
  getWindow,
} from '@floating-ui/utils/dom';

import type {PositioningStrategy, Rect, State} from './types';

const unsetSides = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto',
};

type StyleMap = Record<string, string>;

function roundOffsetsByDPR(offsets: {x: number; y: number}, win: Window) {
  const dpr = win.devicePixelRatio || 1;
  return {
    x: Math.round(offsets.x * dpr) / dpr || 0,
    y: Math.round(offsets.y * dpr) / dpr || 0,
  };
}

function getOffsetParent(element: HTMLElement): Element | Window {
  const win = getWindow(element);
  if (getComputedStyle(element).position === 'fixed') {
    return win;
  }
  return element.offsetParent || getDocumentElement(element);
}

function getBasePlacement(placement: string) {
  return placement.split('-')[0] || placement;
}

function getVariation(placement: string) {
  return placement.split('-')[1];
}

export function mapToStyles({
  popper,
  popperRect,
  placement,
  variation,
  offsets,
  position,
  gpuAcceleration,
  adaptive,
  roundOffsets,
  isFixed,
}: {
  popper: HTMLElement;
  popperRect: Rect;
  placement: string;
  variation?: string | undefined;
  offsets: {x?: number; y?: number};
  position: PositioningStrategy | 'absolute';
  gpuAcceleration: boolean;
  adaptive: boolean;
  roundOffsets: boolean | ((offsets: {x: number; y: number}) => {x: number; y: number});
  isFixed: boolean;
}): StyleMap {
  let x = offsets.x ?? 0;
  let y = offsets.y ?? 0;
  const hasX = Object.prototype.hasOwnProperty.call(offsets, 'x');
  const hasY = Object.prototype.hasOwnProperty.call(offsets, 'y');

  if (typeof roundOffsets === 'function') {
    ({x, y} = roundOffsets({x, y}));
  }

  let sideX = 'left';
  let sideY = 'top';
  const win = getWindow(popper);

  if (adaptive) {
    let offsetParent = getOffsetParent(popper);
    let heightProp: 'clientHeight' | 'scrollHeight' = 'clientHeight';
    let widthProp: 'clientWidth' | 'scrollWidth' = 'clientWidth';

    if (offsetParent === win) {
      offsetParent = getDocumentElement(popper);
      if (
        getComputedStyle(offsetParent).position !== 'static' &&
        position === 'absolute'
      ) {
        heightProp = 'scrollHeight';
        widthProp = 'scrollWidth';
      }
    }

    const parentElement = offsetParent as HTMLElement;

    if (
      placement === 'top' ||
      ((placement === 'left' || placement === 'right') && variation === 'end')
    ) {
      sideY = 'bottom';
      const offsetY =
        isFixed && parentElement === (win as unknown as HTMLElement) && win.visualViewport
          ? win.visualViewport.height
          : parentElement[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }

    if (
      placement === 'left' ||
      ((placement === 'top' || placement === 'bottom') && variation === 'end')
    ) {
      sideX = 'right';
      const offsetX =
        isFixed && parentElement === (win as unknown as HTMLElement) && win.visualViewport
          ? win.visualViewport.width
          : parentElement[widthProp];
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }

  const commonStyles: StyleMap = {
    position,
    ...(adaptive ? unsetSides : null),
  };

  if (roundOffsets === true) {
    ({x, y} = roundOffsetsByDPR({x, y}, win));
  }

  if (gpuAcceleration) {
    return {
      ...commonStyles,
      [sideY]: hasY ? '0' : '',
      [sideX]: hasX ? '0' : '',
      transform:
        (win.devicePixelRatio || 1) <= 1
          ? `translate(${x}px, ${y}px)`
          : `translate3d(${x}px, ${y}px, 0)`,
    };
  }

  return {
    ...commonStyles,
    [sideY]: hasY ? `${y}px` : '',
    [sideX]: hasX ? `${x}px` : '',
    transform: '',
  };
}

export function computeStyles({state, options}: {state: State; options: any}) {
  const {gpuAcceleration = true, adaptive = true, roundOffsets = true} = options || {};
  const commonStyles = {
    placement: getBasePlacement(state.placement),
    variation: getVariation(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration,
    adaptive,
    roundOffsets,
    isFixed: state.options.strategy === 'fixed',
  };

  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = {
      ...state.styles.popper,
      ...mapToStyles({
        ...commonStyles,
        offsets: state.modifiersData.popperOffsets,
        position: state.options.strategy,
      }),
    };
  }

  if (state.modifiersData.arrow != null) {
    state.styles.arrow = {
      ...state.styles.arrow,
      ...mapToStyles({
        ...commonStyles,
        offsets: state.modifiersData.arrow,
        position: 'absolute',
        adaptive: false,
      }),
    };
  }

  state.attributes.popper = {
    ...state.attributes.popper,
    'data-popper-placement': state.placement,
  };
}

export function applyStyles(state: State) {
  (Object.keys(state.elements) as Array<keyof State['elements']>).forEach((name) => {
    const element = state.elements[name];
    if (!element || !('style' in element)) {
      return;
    }

    const style = state.styles[name];
    if (style) {
      Object.assign((element as HTMLElement).style, style);
    }

    const attributes = state.attributes[name];
    if (!attributes) {
      return;
    }

    Object.keys(attributes).forEach((attribute) => {
      const value = attributes[attribute];
      if (value === false) {
        (element as HTMLElement).removeAttribute(attribute);
      } else {
        (element as HTMLElement).setAttribute(
          attribute,
          value === true ? '' : String(value),
        );
      }
    });
  });
}
