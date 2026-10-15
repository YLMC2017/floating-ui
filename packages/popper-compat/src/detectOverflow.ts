import type {Padding, RootBoundary, SideObject, State} from './types';

function toPadding(padding: Padding | undefined): SideObject {
  const fallback = {top: 0, right: 0, bottom: 0, left: 0};
  if (padding == null) {
    return fallback;
  }
  if (typeof padding === 'function') {
    return fallback;
  }
  if (typeof padding === 'number') {
    return {top: padding, right: padding, bottom: padding, left: padding};
  }
  return {
    top: padding.top ?? 0,
    right: padding.right ?? 0,
    bottom: padding.bottom ?? 0,
    left: padding.left ?? 0,
  };
}

function readRect(element: {getBoundingClientRect: () => DOMRect | ClientRect}) {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
    x: rect.left,
    y: rect.top,
  };
}

function boundaryRect(state: State, rootBoundary: RootBoundary | undefined) {
  const popper = state.elements.popper;
  const doc = popper.ownerDocument;
  const win = doc.defaultView || window;
  const html = doc.documentElement;

  if (rootBoundary === 'document') {
    return {
      top: 0,
      left: 0,
      right: Math.max(html.scrollWidth, html.clientWidth),
      bottom: Math.max(html.scrollHeight, html.clientHeight),
    };
  }

  const width = win.visualViewport?.width ?? html.clientWidth;
  const height = win.visualViewport?.height ?? html.clientHeight;
  return {top: 0, left: 0, right: width, bottom: height};
}

/**
 * Popper-compatible overflow helper. Positive values mean that side overflows
 * the clipping boundary.
 */
export function detectOverflow(
  state: State,
  options: {
    placement?: State['placement'];
    boundary?: unknown;
    rootBoundary?: RootBoundary;
    padding?: Padding;
    altBoundary?: boolean;
    elementContext?: 'reference' | 'popper';
  } = {},
): SideObject {
  const padding = toPadding(options.padding);
  const element =
    options.elementContext === 'reference' && 'getBoundingClientRect' in state.elements.reference
      ? state.elements.reference
      : state.elements.popper;
  const rect = readRect(element as HTMLElement);
  const boundary = boundaryRect(state, options.rootBoundary);

  return {
    top: boundary.top + padding.top - rect.top,
    left: boundary.left + padding.left - rect.left,
    bottom: rect.bottom - (boundary.bottom - padding.bottom),
    right: rect.right - (boundary.right - padding.right),
  };
}
