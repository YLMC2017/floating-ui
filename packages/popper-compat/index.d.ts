export type Obj = {
  [key: string]: any;
};

export type Placement =
  | 'auto'
  | 'auto-start'
  | 'auto-end'
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'left'
  | 'left-start'
  | 'left-end';

export type BasePlacement = 'top' | 'bottom' | 'right' | 'left';
export type VariationPlacement =
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'right-start'
  | 'right-end'
  | 'left-start'
  | 'left-end';
export type AutoPlacement = 'auto' | 'auto-start' | 'auto-end';
export type PositioningStrategy = 'absolute' | 'fixed';
export type ModifierPhases =
  | 'beforeRead'
  | 'read'
  | 'afterRead'
  | 'beforeMain'
  | 'main'
  | 'afterMain'
  | 'beforeWrite'
  | 'write'
  | 'afterWrite';

export type Rect = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export type Offsets = {
  y: number;
  x: number;
};

export type SideObject = {
  top: number;
  left: number;
  right: number;
  bottom: number;
};

export type ClientRectObject = {
  x: number;
  y: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

export type VirtualElement = {
  getBoundingClientRect: () => ClientRect | DOMRect;
  contextElement?: Element;
};

export type State = {
  elements: {
    reference: Element | VirtualElement;
    popper: HTMLElement;
    arrow?: HTMLElement;
  };
  options: OptionsGeneric<any>;
  placement: Placement;
  strategy: PositioningStrategy;
  orderedModifiers: Array<Modifier<any, any>>;
  rects: {
    reference: Rect;
    popper: Rect;
  };
  scrollParents: {
    reference: Array<Element | Window | VisualViewport>;
    popper: Array<Element | Window | VisualViewport>;
  };
  styles: {
    [key: string]: Partial<CSSStyleDeclaration>;
  };
  attributes: {
    [key: string]: {
      [key: string]: string | boolean;
    };
  };
  modifiersData: {
    arrow?: {
      x?: number;
      y?: number;
      centerOffset: number;
    };
    hide?: {
      isReferenceHidden: boolean;
      hasPopperEscaped: boolean;
      referenceClippingOffsets: SideObject;
      popperEscapeOffsets: SideObject;
    };
    offset?: {
      [key: string]: Offsets;
    };
    preventOverflow?: Offsets;
    popperOffsets?: Offsets;
    [key: string]: any;
  };
  reset: boolean;
};

export type Instance = {
  state: State;
  destroy: () => void;
  forceUpdate: () => void;
  update: () => Promise<Partial<State>>;
  setOptions: (
    setOptionsAction:
      | Partial<OptionsGeneric<any>>
      | ((prev: OptionsGeneric<any>) => Partial<OptionsGeneric<any>>),
  ) => Promise<Partial<State>>;
};

export type ModifierArguments<Options extends Obj> = {
  state: State;
  instance: Instance;
  options: Partial<Options>;
  name: string;
};

export type Modifier<Name, Options extends Obj> = {
  name: Name;
  enabled: boolean;
  phase: ModifierPhases;
  requires?: Array<string>;
  requiresIfExists?: Array<string>;
  fn: (arg0: ModifierArguments<Options>) => State | void;
  effect?: (arg0: ModifierArguments<Options>) => (() => void) | void;
  options?: Partial<Options>;
  data?: Obj;
};

export type Options = {
  placement: Placement;
  modifiers: Array<Partial<Modifier<any, any>>>;
  strategy: PositioningStrategy;
  onFirstUpdate?: (arg0: Partial<State>) => void;
};

export type OptionsGeneric<TModifier> = {
  placement: Placement;
  modifiers: Array<TModifier>;
  strategy: PositioningStrategy;
  onFirstUpdate?: (arg0: Partial<State>) => void;
};

export type Padding = number | Partial<SideObject>;
export type Boundary = 'clippingParents' | Element | Array<Element>;
export type RootBoundary = 'viewport' | 'document';

export declare const basePlacements: ReadonlyArray<BasePlacement>;
export declare const variationPlacements: ReadonlyArray<VariationPlacement>;
export declare const autoPlacements: ReadonlyArray<AutoPlacement>;
export declare const placements: ReadonlyArray<Placement>;
export declare const modifierPhases: ReadonlyArray<ModifierPhases>;
export declare const defaultModifiers: Array<Partial<Modifier<any, any>>>;

export declare function detectOverflow(
  state: State,
  options?: {
    placement?: Placement;
    boundary?: Boundary;
    rootBoundary?: RootBoundary;
    padding?: Padding;
    altBoundary?: boolean;
    elementContext?: 'reference' | 'popper';
  },
): SideObject;

export declare function popperGenerator(generatorOptions?: {
  defaultModifiers?: Array<Partial<Modifier<any, any>>>;
  defaultOptions?: Partial<Options>;
}): (
  reference: Element | VirtualElement,
  popper: HTMLElement,
  options?: Partial<Options>,
) => Instance;

export declare function createPopper(
  reference: Element | VirtualElement,
  popper: HTMLElement,
  options?: Partial<Options>,
): Instance;

export declare function createPopperLite(
  reference: Element | VirtualElement,
  popper: HTMLElement,
  options?: Partial<Options>,
): Instance;

export declare function createPopperBase(
  reference: Element | VirtualElement,
  popper: HTMLElement,
  options?: Partial<Options>,
): Instance;
