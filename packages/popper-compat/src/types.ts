import type {modifierPhases, placements} from './placements';

export type Placement = (typeof placements)[number];
export type BasePlacement = 'top' | 'bottom' | 'right' | 'left';
export type ModifierPhases = (typeof modifierPhases)[number];
export type PositioningStrategy = 'absolute' | 'fixed';

export type Obj = Record<string, any>;

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

export type ClientRectObject = Rect & SideObject;

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
  modifiersData: Obj;
  reset: boolean;
};

export type Instance = {
  state: State;
  destroy: () => void;
  forceUpdate: () => void;
  update: () => Promise<Partial<State>>;
  setOptions: (
    setOptionsAction: Partial<OptionsGeneric<any>> | ((prev: OptionsGeneric<any>) => Partial<OptionsGeneric<any>>),
  ) => Promise<Partial<State>>;
};

export type ModifierArguments<Options extends Obj> = {
  state: State;
  instance: Instance;
  options: Partial<Options>;
  name: string;
};

export type Modifier<Name extends string, Options extends Obj> = {
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

export type Padding =
  | number
  | Partial<SideObject>
  | ((arg0: {placement: Placement; reference: Rect; popper: Rect}) => number | Partial<SideObject>);

export type Boundary = 'clippingParents' | Element | Array<Element>;
export type RootBoundary = 'viewport' | 'document';

export type ModifierObject = Partial<Modifier<any, any>> & {name: string};
