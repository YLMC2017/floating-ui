function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _objectWithoutProperties(e, t) {
  if (null == e) return {};
  var o,
    r,
    i = _objectWithoutPropertiesLoose(e, t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}

/**
 * Custom positioning reference element.
 * @see https://floating-ui.com/docs/virtual-elements
 */

const sides = ['top', 'right', 'bottom', 'left'];
const alignments = ['start', 'end'];
const placements$1 = sides.reduce((acc, side) => acc.concat(side, `${side}-${alignments[0]}`, `${side}-${alignments[1]}`), []);
const min = Math.min;
const max = Math.max;
const round = Math.round;
const createCoords = v => ({
  x: v,
  y: v
});
const oppositeSideMap = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function clamp(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value === 'function' ? value(param) : value;
}
function getSide(placement) {
  return placement.split('-')[0];
}
function getAlignment(placement) {
  return placement.split('-')[1];
}
function getOppositeAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}
function getAxisLength(axis) {
  return axis === 'y' ? 'height' : 'width';
}
function getSideAxis(placement) {
  const firstChar = placement[0];
  return firstChar === 't' || firstChar === 'b' ? 'y' : 'x';
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl = false) {
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === 'x' ? alignment === (rtl ? 'end' : 'start') ? 'right' : 'left' : alignment === 'start' ? 'bottom' : 'top';
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.includes('start') ? placement.replace('start', 'end') : placement.replace('end', 'start');
}
const lrPlacement = ['left', 'right'];
const rlPlacement = ['right', 'left'];
const tbPlacement = ['top', 'bottom'];
const btPlacement = ['bottom', 'top'];
function getSideList(side, isStart, rtl) {
  switch (side) {
    case 'top':
    case 'bottom':
      if (rtl) return isStart ? rlPlacement : lrPlacement;
      return isStart ? lrPlacement : rlPlacement;
    case 'left':
    case 'right':
      return isStart ? tbPlacement : btPlacement;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === 'start', rtl);
  if (alignment) {
    list = list.map(side => `${side}-${alignment}`);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  const side = getSide(placement);
  return oppositeSideMap[side] + placement.slice(side.length);
}
function expandPaddingObject(padding) {
  var _padding$top, _padding$right, _padding$bottom, _padding$left;
  return {
    top: (_padding$top = padding.top) !== null && _padding$top !== void 0 ? _padding$top : 0,
    right: (_padding$right = padding.right) !== null && _padding$right !== void 0 ? _padding$right : 0,
    bottom: (_padding$bottom = padding.bottom) !== null && _padding$bottom !== void 0 ? _padding$bottom : 0,
    left: (_padding$left = padding.left) !== null && _padding$left !== void 0 ? _padding$left : 0
  };
}
function getPaddingObject(padding) {
  return typeof padding !== 'number' ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  const {
    x,
    y,
    width,
    height
  } = rect;
  return {
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    x,
    y
  };
}

function computeCoordsFromPlacement({
  reference,
  floating
}, placement, rtl) {
  const sideAxis = getSideAxis(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const alignLength = getAxisLength(alignmentAxis);
  const side = getSide(placement);
  const isVertical = sideAxis === 'y';
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case 'top':
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case 'bottom':
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case 'right':
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case 'left':
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  const alignment = getAlignment(placement);
  if (alignment) {
    coords[alignmentAxis] += commonAlign * (alignment === 'end' ? 1 : -1) * (rtl && isVertical ? -1 : 1);
  }
  return coords;
}

/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary on each side.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */
async function detectOverflow$1(state, options = {}) {
  var _await$platform$isEle, _platform$isElement, _platform$getDocument, _platform$getOffsetPa, _platform$isElement2, _platform$getScale;
  const {
    x,
    y,
    platform,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = 'clippingAncestors',
    rootBoundary = 'viewport',
    elementContext = 'floating',
    altBoundary = false,
    padding = 0
  } = evaluate(options, state);
  const paddingObject = getPaddingObject(padding);
  const altContext = elementContext === 'floating' ? 'reference' : 'floating';
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = rectToClientRect(await platform.getClippingRect({
    element: ((_await$platform$isEle = await ((_platform$isElement = platform.isElement) === null || _platform$isElement === void 0 ? void 0 : _platform$isElement.call(platform, element))) !== null && _await$platform$isEle !== void 0 ? _await$platform$isEle : true) ? element : element.contextElement || (await ((_platform$getDocument = platform.getDocumentElement) === null || _platform$getDocument === void 0 ? void 0 : _platform$getDocument.call(platform, elements.floating))),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === 'floating' ? {
    x,
    y,
    width: rects.floating.width,
    height: rects.floating.height
  } : rects.reference;
  const offsetParent = await ((_platform$getOffsetPa = platform.getOffsetParent) === null || _platform$getOffsetPa === void 0 ? void 0 : _platform$getOffsetPa.call(platform, elements.floating));
  const elementClientRect = rectToClientRect(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements,
    rect,
    offsetParent,
    strategy
  }) : rect);

  // A zero-length axis carries no scale, so fall back to the other one: CSS
  // zoom is uniform, and that is the only scaling a Window offsetParent has.
  const scaleX = rect.width ? elementClientRect.width / rect.width : 0;
  const scaleY = rect.height ? elementClientRect.height / rect.height : 0;
  const offsetScale = (await ((_platform$isElement2 = platform.isElement) === null || _platform$isElement2 === void 0 ? void 0 : _platform$isElement2.call(platform, offsetParent))) && (await ((_platform$getScale = platform.getScale) === null || _platform$getScale === void 0 ? void 0 : _platform$getScale.call(platform, offsetParent))) || {
    x: scaleX || scaleY || 1,
    y: scaleY || scaleX || 1
  };
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}

// Maximum number of resets that can occur before bailing to avoid infinite reset loops.
const MAX_RESET_COUNT = 50;

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a given reference element.
 *
 * This export does not have any `platform` interface logic. You will need to
 * write one for the platform you are using Floating UI with.
 */
const computePosition$1 = async (reference, floating, config) => {
  var _platform$isRTL;
  const {
    placement = 'bottom',
    strategy = 'absolute',
    middleware = [],
    platform
  } = config;
  const platformWithDetectOverflow = platform.detectOverflow ? platform : _objectSpread2(_objectSpread2({}, platform), {}, {
    detectOverflow: detectOverflow$1
  });
  const rtl = await ((_platform$isRTL = platform.isRTL) === null || _platform$isRTL === void 0 ? void 0 : _platform$isRTL.call(platform, floating));
  let rects = await platform.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let resetCount = 0;
  const middlewareData = {};
  for (let i = 0; i < middleware.length; i++) {
    const currentMiddleware = middleware[i];
    if (!currentMiddleware) {
      continue;
    }
    const {
      name,
      fn
    } = currentMiddleware;
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform: platformWithDetectOverflow,
      elements: {
        reference,
        floating
      }
    });
    x = nextX !== null && nextX !== void 0 ? nextX : x;
    y = nextY !== null && nextY !== void 0 ? nextY : y;
    middlewareData[name] = _objectSpread2(_objectSpread2({}, middlewareData[name]), data);
    if (reset && resetCount < MAX_RESET_COUNT) {
      resetCount++;
      if (typeof reset === 'object') {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x,
          y
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i = -1;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow$1 = options => ({
  name: 'arrow',
  options,
  async fn(state) {
    var _platform$getOffsetPa, _platform$isElement;
    const {
      x,
      y,
      placement,
      rects,
      platform,
      elements,
      middlewareData
    } = state;
    // Since `element` is required, we don't Partial<> the type.
    const {
      element,
      padding = 0
    } = evaluate(options, state) || {};
    if (element == null) {
      return {};
    }
    const paddingObject = getPaddingObject(padding);
    const coords = {
      x,
      y
    };
    const axis = getAlignmentAxis(placement);
    const length = getAxisLength(axis);
    const arrowDimensions = await platform.getDimensions(element);
    const isYAxis = axis === 'y';
    const minProp = isYAxis ? 'top' : 'left';
    const maxProp = isYAxis ? 'bottom' : 'right';
    const clientProp = isYAxis ? 'clientHeight' : 'clientWidth';
    const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
    const startDiff = coords[axis] - rects.reference[axis];
    const arrowOffsetParent = await ((_platform$getOffsetPa = platform.getOffsetParent) === null || _platform$getOffsetPa === void 0 ? void 0 : _platform$getOffsetPa.call(platform, element));
    let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;

    // DOM platform can return `window` as the `offsetParent`.
    if (!clientSize || !(await ((_platform$isElement = platform.isElement) === null || _platform$isElement === void 0 ? void 0 : _platform$isElement.call(platform, arrowOffsetParent)))) {
      clientSize = elements.floating[clientProp] || rects.floating[length];
    }
    const centerToReference = endDiff / 2 - startDiff / 2;

    // If the padding is large enough that it causes the arrow to no longer be
    // centered, modify the padding so that it is centered.
    const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
    const minPadding = min(paddingObject[minProp], largestPossiblePadding);
    const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);

    // Make sure the arrow doesn't overflow the floating element if the center
    // point is outside the floating element's bounds.
    const max = clientSize - arrowDimensions[length] - maxPadding;
    const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
    const offset = clamp(minPadding, center, max);

    // If the reference is small enough that the arrow's padding causes it to
    // to point to nothing for an aligned placement, adjust the offset of the
    // floating element itself. To ensure `shift()` continues to take action,
    // a single reset is performed when this is true.
    const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset && rects.reference[length] / 2 - (center < minPadding ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
    const alignmentOffset = shouldAddOffset ? center < minPadding ? center - minPadding : center - max : 0;
    return {
      [axis]: coords[axis] + alignmentOffset,
      data: _objectSpread2({
        [axis]: offset,
        centerOffset: center - offset - alignmentOffset
      }, shouldAddOffset && {
        alignmentOffset
      }),
      reset: shouldAddOffset
    };
  }
});

const _excluded$3 = ["crossAxis", "alignment", "allowedPlacements", "autoAlignment"];
function getPlacementList(alignment, autoAlignment, allowedPlacements) {
  const allowedPlacementsSortedByAlignment = alignment ? [...allowedPlacements.filter(placement => getAlignment(placement) === alignment), ...allowedPlacements.filter(placement => getAlignment(placement) !== alignment)] : allowedPlacements.filter(placement => getSide(placement) === placement);
  return allowedPlacementsSortedByAlignment.filter(placement => {
    if (alignment) {
      return getAlignment(placement) === alignment || (autoAlignment ? getOppositeAlignmentPlacement(placement) !== placement : false);
    }
    return true;
  });
}
/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */
const autoPlacement$1 = (options = {}) => ({
  name: 'autoPlacement',
  options,
  async fn(state) {
    var _middlewareData$autoP, _platform$isRTL, _middlewareData$autoP2, _placementsThatFitOnE;
    const {
      rects,
      middlewareData,
      placement,
      platform,
      elements
    } = state;
    const _evaluate = evaluate(options, state),
      {
        crossAxis = false,
        alignment,
        allowedPlacements = placements$1,
        autoAlignment = true
      } = _evaluate,
      detectOverflowOptions = _objectWithoutProperties(_evaluate, _excluded$3);
    const placements = alignment !== undefined || allowedPlacements === placements$1 ? getPlacementList(alignment || null, autoAlignment, allowedPlacements) : allowedPlacements;
    const currentIndex = ((_middlewareData$autoP = middlewareData.autoPlacement) === null || _middlewareData$autoP === void 0 ? void 0 : _middlewareData$autoP.index) || 0;
    const currentPlacement = placements[currentIndex];
    if (currentPlacement == null) {
      return {};
    }

    // Make `computeCoords` start from the right place.
    if (placement !== currentPlacement) {
      return {
        reset: {
          placement: placements[0]
        }
      };
    }
    const overflow = await platform.detectOverflow(state, detectOverflowOptions);
    const alignmentSides = getAlignmentSides(currentPlacement, rects, await ((_platform$isRTL = platform.isRTL) === null || _platform$isRTL === void 0 ? void 0 : _platform$isRTL.call(platform, elements.floating)));
    const currentOverflows = [overflow[getSide(currentPlacement)], overflow[alignmentSides[0]], overflow[alignmentSides[1]]];
    const allOverflows = [...(((_middlewareData$autoP2 = middlewareData.autoPlacement) === null || _middlewareData$autoP2 === void 0 ? void 0 : _middlewareData$autoP2.overflows) || []), {
      placement: currentPlacement,
      overflows: currentOverflows
    }];
    const nextPlacement = placements[currentIndex + 1];

    // There are more placements to check.
    if (nextPlacement) {
      return {
        data: {
          index: currentIndex + 1,
          overflows: allOverflows
        },
        reset: {
          placement: nextPlacement
        }
      };
    }
    const placementsSortedByMostSpace = allOverflows.map(d => {
      const alignment = getAlignment(d.placement);
      return [d.placement, alignment && crossAxis ?
      // Check along the mainAxis and main crossAxis side.
      d.overflows.slice(0, 2).reduce((acc, v) => acc + v, 0) :
      // Check only the mainAxis.
      d.overflows[0], d.overflows];
    }).sort((a, b) => a[1] - b[1]);
    const placementsThatFitOnEachSide = placementsSortedByMostSpace.filter(d => d[2].slice(0,
    // Aligned placements should not check their opposite crossAxis
    // side.
    getAlignment(d[0]) ? 2 : 3).every(v => v <= 0));
    const resetPlacement = ((_placementsThatFitOnE = placementsThatFitOnEachSide[0]) === null || _placementsThatFitOnE === void 0 ? void 0 : _placementsThatFitOnE[0]) || placementsSortedByMostSpace[0][0];
    if (resetPlacement !== placement) {
      return {
        data: {
          index: currentIndex + 1,
          overflows: allOverflows
        },
        reset: {
          placement: resetPlacement
        }
      };
    }
    return {};
  }
});

const _excluded$2 = ["mainAxis", "crossAxis", "fallbackPlacements", "fallbackStrategy", "fallbackAxisSideDirection", "flipAlignment"];
/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const flip$1 = (options = {}) => ({
  name: 'flip',
  options,
  async fn(state) {
    var _middlewareData$arrow, _platform$isRTL, _middlewareData$flip;
    const {
      placement,
      middlewareData,
      rects,
      initialPlacement,
      platform,
      elements
    } = state;
    const _evaluate = evaluate(options, state),
      {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = 'bestFit',
        fallbackAxisSideDirection = 'none',
        flipAlignment = true
      } = _evaluate,
      detectOverflowOptions = _objectWithoutProperties(_evaluate, _excluded$2);

    // If a reset by the arrow was caused due to an alignment offset being
    // added, we should skip any logic now since `flip()` has already done its
    // work.
    // https://github.com/floating-ui/floating-ui/issues/2549#issuecomment-1719601643
    if ((_middlewareData$arrow = middlewareData.arrow) !== null && _middlewareData$arrow !== void 0 && _middlewareData$arrow.alignmentOffset) {
      return {};
    }
    const side = getSide(placement);
    const initialSideAxis = getSideAxis(initialPlacement);
    const isBasePlacement = getSide(initialPlacement) === initialPlacement;
    const rtl = await ((_platform$isRTL = platform.isRTL) === null || _platform$isRTL === void 0 ? void 0 : _platform$isRTL.call(platform, elements.floating));
    const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
    const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== 'none';
    if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
      fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
    }
    const placements = [initialPlacement, ...fallbackPlacements];
    const overflow = await platform.detectOverflow(state, detectOverflowOptions);
    const overflows = [];
    let overflowsData = ((_middlewareData$flip = middlewareData.flip) === null || _middlewareData$flip === void 0 ? void 0 : _middlewareData$flip.overflows) || [];
    if (checkMainAxis) {
      overflows.push(overflow[side]);
    }
    if (checkCrossAxis) {
      const sides = getAlignmentSides(placement, rects, rtl);
      overflows.push(overflow[sides[0]], overflow[sides[1]]);
    }
    overflowsData = [...overflowsData, {
      placement,
      overflows
    }];

    // One or more sides is overflowing.
    if (!overflows.every(side => side <= 0)) {
      var _middlewareData$flip2, _overflowsData$filter;
      const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) === null || _middlewareData$flip2 === void 0 ? void 0 : _middlewareData$flip2.index) || 0) + 1;
      const nextPlacement = placements[nextIndex];
      if (nextPlacement) {
        const ignoreCrossAxisOverflow = checkCrossAxis === 'alignment' ? initialSideAxis !== getSideAxis(nextPlacement) : false;
        if (!ignoreCrossAxisOverflow ||
        // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        overflowsData.every(d => getSideAxis(d.placement) === initialSideAxis ? d.overflows[0] > 0 : true)) {
          // Try next placement and re-run the lifecycle.
          return {
            data: {
              index: nextIndex,
              overflows: overflowsData
            },
            reset: {
              placement: nextPlacement
            }
          };
        }
      }

      // First, find the candidates that fit on the mainAxis side of overflow,
      // then find the placement that fits the best on the main crossAxis side.
      let resetPlacement = (_overflowsData$filter = overflowsData.filter(d => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) === null || _overflowsData$filter === void 0 ? void 0 : _overflowsData$filter.placement;

      // Otherwise fallback.
      if (!resetPlacement) {
        switch (fallbackStrategy) {
          case 'bestFit':
            {
              var _overflowsData$filter2;
              const _placement = (_overflowsData$filter2 = overflowsData.filter(d => {
                if (hasFallbackAxisSideDirection) {
                  const currentSideAxis = getSideAxis(d.placement);
                  return currentSideAxis === initialSideAxis ||
                  // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  currentSideAxis === 'y';
                }
                return true;
              }).map(d => [d.placement, d.overflows.filter(overflow => overflow > 0).reduce((acc, overflow) => acc + overflow, 0)]).sort((a, b) => a[1] - b[1])[0]) === null || _overflowsData$filter2 === void 0 ? void 0 : _overflowsData$filter2[0];
              if (_placement) {
                resetPlacement = _placement;
              }
              break;
            }
          case 'initialPlacement':
            resetPlacement = initialPlacement;
            break;
        }
      }
      if (placement !== resetPlacement) {
        return {
          reset: {
            placement: resetPlacement
          }
        };
      }
    }
    return {};
  }
});

const _excluded$1 = ["strategy"];
function getSideOffsets(overflow, rect) {
  return {
    top: overflow.top - rect.height,
    right: overflow.right - rect.width,
    bottom: overflow.bottom - rect.height,
    left: overflow.left - rect.width
  };
}
function isAnySideFullyClipped(overflow) {
  return sides.some(side => overflow[side] >= 0);
}
/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const hide$1 = (options = {}) => ({
  name: 'hide',
  options,
  async fn(state) {
    const {
      rects,
      platform
    } = state;
    const _evaluate = evaluate(options, state),
      {
        strategy = 'referenceHidden'
      } = _evaluate,
      detectOverflowOptions = _objectWithoutProperties(_evaluate, _excluded$1);
    switch (strategy) {
      case 'referenceHidden':
        {
          const overflow = await platform.detectOverflow(state, _objectSpread2(_objectSpread2({}, detectOverflowOptions), {}, {
            elementContext: 'reference'
          }));
          const offsets = getSideOffsets(overflow, rects.reference);
          return {
            data: {
              referenceHiddenOffsets: offsets,
              referenceHidden: isAnySideFullyClipped(offsets)
            }
          };
        }
      case 'escaped':
        {
          const overflow = await platform.detectOverflow(state, _objectSpread2(_objectSpread2({}, detectOverflowOptions), {}, {
            altBoundary: true
          }));
          const offsets = getSideOffsets(overflow, rects.floating);
          return {
            data: {
              escapedOffsets: offsets,
              escaped: isAnySideFullyClipped(offsets)
            }
          };
        }
      default:
        {
          return {};
        }
    }
  }
});

const originSides = new Set(['left', 'top']);

// For type backwards-compatibility, the `OffsetOptions` type was also
// Derivable.

async function convertValueToCoords(state, options) {
  var _platform$isRTL;
  const {
    placement,
    platform,
    elements
  } = state;
  const rtl = await ((_platform$isRTL = platform.isRTL) === null || _platform$isRTL === void 0 ? void 0 : _platform$isRTL.call(platform, elements.floating));
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const isVertical = getSideAxis(placement) === 'y';
  const mainAxisMulti = originSides.has(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = evaluate(options, state);

  // eslint-disable-next-line prefer-const
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === 'number' ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: rawValue.mainAxis || 0,
    crossAxis: rawValue.crossAxis || 0,
    alignmentAxis: rawValue.alignmentAxis
  };
  if (alignment && typeof alignmentAxis === 'number') {
    crossAxis = alignment === 'end' ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const offset$1 = (options = 0) => ({
  name: 'offset',
  options,
  async fn(state) {
    var _middlewareData$offse, _middlewareData$arrow;
    const {
      x,
      y,
      placement,
      middlewareData
    } = state;
    const diffCoords = await convertValueToCoords(state, options);

    // If the placement is the same and the arrow caused an alignment offset
    // then we don't need to change the positioning coordinates.
    if (placement === ((_middlewareData$offse = middlewareData.offset) === null || _middlewareData$offse === void 0 ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) !== null && _middlewareData$arrow !== void 0 && _middlewareData$arrow.alignmentOffset) {
      return {};
    }
    return {
      x: x + diffCoords.x,
      y: y + diffCoords.y,
      data: _objectSpread2(_objectSpread2({}, diffCoords), {}, {
        placement
      })
    };
  }
});

const _excluded = ["mainAxis", "crossAxis", "limiter"];
/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift$1 = (options = {}) => ({
  name: 'shift',
  options,
  async fn(state) {
    const {
      x,
      y,
      placement,
      platform
    } = state;
    const _evaluate = evaluate(options, state),
      {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: ({
            x,
            y
          }) => ({
            x,
            y
          })
        }
      } = _evaluate,
      detectOverflowOptions = _objectWithoutProperties(_evaluate, _excluded);
    const coords = {
      x,
      y
    };
    const overflow = await platform.detectOverflow(state, detectOverflowOptions);
    const crossAxis = getSideAxis(placement);
    const mainAxis = getOppositeAxis(crossAxis);
    let mainAxisCoord = coords[mainAxis];
    let crossAxisCoord = coords[crossAxis];
    const clampCoord = (axis, coord) => clamp(coord + overflow[axis === 'y' ? 'top' : 'left'], coord, coord - overflow[axis === 'y' ? 'bottom' : 'right']);
    if (checkMainAxis) {
      mainAxisCoord = clampCoord(mainAxis, mainAxisCoord);
    }
    if (checkCrossAxis) {
      crossAxisCoord = clampCoord(crossAxis, crossAxisCoord);
    }
    const limitedCoords = limiter.fn(_objectSpread2(_objectSpread2({}, state), {}, {
      [mainAxis]: mainAxisCoord,
      [crossAxis]: crossAxisCoord
    }));
    return _objectSpread2(_objectSpread2({}, limitedCoords), {}, {
      data: {
        x: limitedCoords.x - x,
        y: limitedCoords.y - y,
        enabled: {
          [mainAxis]: checkMainAxis,
          [crossAxis]: checkCrossAxis
        }
      }
    });
  }
});
/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
const limitShift$1 = (options = {}) => ({
  options,
  fn(state) {
    var _rawOffset$mainAxis, _rawOffset$crossAxis;
    const {
      x,
      y,
      placement,
      rects,
      middlewareData
    } = state;
    const {
      offset = 0,
      mainAxis: checkMainAxis = true,
      crossAxis: checkCrossAxis = true
    } = evaluate(options, state);
    const coords = {
      x,
      y
    };
    const crossAxis = getSideAxis(placement);
    const mainAxis = getOppositeAxis(crossAxis);
    let mainAxisCoord = coords[mainAxis];
    let crossAxisCoord = coords[crossAxis];
    const rawOffset = evaluate(offset, state);
    const computedOffset = typeof rawOffset === 'number' ? {
      mainAxis: rawOffset,
      crossAxis: 0
    } : {
      mainAxis: (_rawOffset$mainAxis = rawOffset.mainAxis) !== null && _rawOffset$mainAxis !== void 0 ? _rawOffset$mainAxis : 0,
      crossAxis: (_rawOffset$crossAxis = rawOffset.crossAxis) !== null && _rawOffset$crossAxis !== void 0 ? _rawOffset$crossAxis : 0
    };
    if (checkMainAxis) {
      const len = mainAxis === 'y' ? 'height' : 'width';
      const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
      const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
      if (mainAxisCoord < limitMin) {
        mainAxisCoord = limitMin;
      } else if (mainAxisCoord > limitMax) {
        mainAxisCoord = limitMax;
      }
    }
    if (checkCrossAxis) {
      var _middlewareData$offse, _middlewareData$offse2;
      const len = mainAxis === 'y' ? 'width' : 'height';
      const isOriginSide = originSides.has(getSide(placement));
      const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) === null || _middlewareData$offse === void 0 ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
      const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) === null || _middlewareData$offse2 === void 0 ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
      if (crossAxisCoord < limitMin) {
        crossAxisCoord = limitMin;
      } else if (crossAxisCoord > limitMax) {
        crossAxisCoord = limitMax;
      }
    }
    return {
      [mainAxis]: mainAxisCoord,
      [crossAxis]: crossAxisCoord
    };
  }
});

function hasWindow() {
  return typeof window !== 'undefined';
}
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || '').toLowerCase();
  }
  // Mocked nodes in testing environments may not be instances of Node. By
  // returning `#document` an infinite loop won't occur.
  // https://github.com/floating-ui/floating-ui/issues/2317
  return '#document';
}
function getWindow(node) {
  var _node$ownerDocument;
  return (node === null || node === void 0 || (_node$ownerDocument = node.ownerDocument) === null || _node$ownerDocument === void 0 ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) === null || _ref === void 0 ? void 0 : _ref.documentElement;
}
function isNode(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
  if (!hasWindow() || typeof ShadowRoot === 'undefined') {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && display !== 'inline' && display !== 'contents';
}
function isTableElement(element) {
  return /^(table|td|th)$/.test(getNodeName(element));
}
function isTopLayer(element) {
  try {
    if (element.matches(':popover-open')) {
      return true;
    }
  } catch (_e) {
    // no-op
  }
  try {
    return element.matches(':modal');
  } catch (_e) {
    return false;
  }
}
const willChangeRe = /transform|translate|scale|rotate|perspective|filter/;
const containRe = /paint|layout|strict|content/;
const isNotNone = value => !!value && value !== 'none';
let isWebKitValue;
function isContainingBlock(elementOrCss) {
  const css = isElement(elementOrCss) ? getComputedStyle(elementOrCss) : elementOrCss;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  // https://drafts.csswg.org/css-transforms-2/#individual-transforms
  return isNotNone(css.transform) || isNotNone(css.translate) || isNotNone(css.scale) || isNotNone(css.rotate) || isNotNone(css.perspective) || !isWebKit() && (isNotNone(css.backdropFilter) || isNotNone(css.filter)) || willChangeRe.test(css.willChange || '') || containRe.test(css.contain || '');
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else if (isTopLayer(currentNode)) {
      return null;
    }
    currentNode = getParentNode(currentNode);
  }
  return null;
}
function isWebKit() {
  if (isWebKitValue == null) {
    isWebKitValue = typeof CSS !== 'undefined' && CSS.supports && CSS.supports('-webkit-backdrop-filter', 'none');
  }
  return isWebKitValue;
}
function isLastTraversableNode(node) {
  return /^(html|body|#document)$/.test(getNodeName(node));
}
function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.scrollX,
    scrollTop: element.scrollY
  };
}
function getParentNode(node) {
  if (getNodeName(node) === 'html') {
    return node;
  }
  const result =
  // Step into the shadow DOM of the parent of a slotted node.
  node.assignedSlot ||
  // DOM Element detected.
  node.parentNode ||
  // ShadowRoot detected.
  isShadowRoot(node) && node.host ||
  // Fallback.
  getDocumentElement(node);
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return (node.ownerDocument || node).body || getDocumentElement(node);
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list = [], traverseIframes = true) {
  var _node$ownerDocument2;
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) === null || _node$ownerDocument2 === void 0 ? void 0 : _node$ownerDocument2.body) || scrollableAncestor === getDocumentElement(node);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    const frameElement = getFrameElement(win);
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
  } else {
    return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
  }
}
function getFrameElement(win) {
  return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}

function getCssDimensions(element) {
  const css = getComputedStyle(element);
  // In testing environments, the `width` and `height` properties are empty
  // strings for SVG elements, returning NaN. Fallback to `0` in this case.
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = isHTMLElement(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}

function unwrapElement(element) {
  return !isElement(element) ? element.contextElement : element;
}

function getScale(element) {
  const domElement = unwrapElement(element);
  if (!isHTMLElement(domElement)) {
    return createCoords(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $
  } = getCssDimensions(domElement);
  let x = ($ ? round(rect.width) : rect.width) / width;
  let y = ($ ? round(rect.height) : rect.height) / height;

  // 0, NaN, or Infinity should always fallback to 1.

  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y
  };
}

const noOffsets = createCoords(0);
function getVisualOffsets(element) {
  const win = getWindow(element);
  if (!isWebKit() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed = false, floatingOffsetParent) {
  return !!floatingOffsetParent && isFixed && floatingOffsetParent === getWindow(element);
}

function getBoundingClientRect(element, includeScale = false, isFixedStrategy = false, offsetParent) {
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = createCoords(1);
  if (includeScale) {
    if (offsetParent) {
      if (isElement(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
  let x = (clientRect.left + visualOffsets.x) / scale.x;
  let y = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement && offsetParent) {
    const win = getWindow(domElement);
    const offsetWin = isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
    let currentWin = win;
    let currentIFrame = getFrameElement(currentWin);
    while (currentIFrame && offsetWin !== currentWin) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = getComputedStyle(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += left;
      y += top;
      currentWin = getWindow(currentIFrame);
      currentIFrame = getFrameElement(currentWin);
    }
  }
  return rectToClientRect({
    width,
    height,
    x,
    y
  });
}

function getCurrentCSSZoom(element) {
  return element.currentCSSZoom || 1;
}

// If <html> has a CSS width greater than the viewport, then this will be
// incorrect for RTL.
function getWindowScrollBarX(element, rect) {
  const leftScroll = getNodeScroll(element).scrollLeft;
  if (!rect) {
    return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
  }
  return rect.left + leftScroll;
}

function getHTMLOffset(documentElement, scroll) {
  const htmlRect = documentElement.getBoundingClientRect();
  const x = htmlRect.left + scroll.scrollLeft - getWindowScrollBarX(documentElement, htmlRect);
  const y = htmlRect.top + scroll.scrollTop;
  return {
    x,
    y
  };
}

function convertOffsetParentRelativeRectToViewportRelativeRect({
  elements,
  rect,
  offsetParent,
  strategy
}) {
  const isFixed = strategy === 'fixed';
  const documentElement = getDocumentElement(offsetParent);
  if (offsetParent === documentElement) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = createCoords(1);
  let offsetX = 0;
  let offsetY = 0;
  const isOffsetParentAnHTMLElement = isHTMLElement(offsetParent);
  if (isOffsetParentAnHTMLElement || !isFixed) {
    if (getNodeName(offsetParent) !== 'body' || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isOffsetParentAnHTMLElement) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsetX = offsetRect.x + offsetParent.clientLeft;
      offsetY = offsetRect.y + offsetParent.clientTop;
    }
  }
  const htmlOffset = !isOffsetParentAnHTMLElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
  if (!isElement(offsetParent) && elements) {
    scale = createCoords(getCurrentCSSZoom(elements.floating));
  }
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * (isOffsetParentAnHTMLElement ? scale.x : 1) + offsetX + htmlOffset.x,
    y: rect.y * scale.y - scroll.scrollTop * (isOffsetParentAnHTMLElement ? scale.y : 1) + offsetY + htmlOffset.y
  };
}

function getClientRects(element) {
  return element.getClientRects ? Array.from(element.getClientRects()) : [];
}

// Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable.
function getDocumentRect(html) {
  const scroll = getNodeScroll(html);
  const body = html.ownerDocument.body;
  const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(html);
  const y = -scroll.scrollTop;
  if (getComputedStyle(body).direction === 'rtl') {
    x += max(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}

// Safety check: ensure the scrollbar space is reasonable in case this
// calculation is affected by unusual styles.
// Most scrollbars leave 15-18px of space.
const SCROLLBAR_MAX = 25;
function getViewportRect(element, strategy, rootBoundary = 'viewport') {
  const isLayoutViewport = rootBoundary === 'layoutViewport';
  const win = getWindow(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    // Client coordinates are relative to the layout viewport, except in
    // WebKit with an `absolute` strategy, where they are relative to the
    // visual viewport.
    const layoutRelativeClientCoords = !isWebKit() || strategy === 'fixed';
    if (isLayoutViewport) {
      if (!layoutRelativeClientCoords) {
        x = -visualViewport.offsetLeft;
        y = -visualViewport.offsetTop;
      }
    } else {
      width = visualViewport.width;
      height = visualViewport.height;
      if (layoutRelativeClientCoords) {
        x = visualViewport.offsetLeft;
        y = visualViewport.offsetTop;
      }
    }
  }
  const htmlRect = html.getBoundingClientRect();
  const windowScrollbarX = getWindowScrollBarX(html, htmlRect);
  // `scrollbar-gutter: stable` on the <html> reserves gutter space that shrinks
  // the visual width. In standards mode, only the border box reflects it. In
  // quirks mode, `html.clientWidth` also shrinks, so compare it with the chosen
  // viewport width instead. A left-side scrollbar (`windowScrollbarX > 0`) is
  // already handled by `getHTMLOffset`/`visualViewport.width`; skip it here.
  // `both-edges` also shifts the <html> origin by the inline-start gutter, so it
  // fails that same check and stays uncorrected.
  const reservedWidth = win.document.compatMode === 'BackCompat' ? width - html.clientWidth : html.clientWidth - htmlRect.width;
  if (windowScrollbarX <= 0 && reservedWidth > 0 && reservedWidth / getCurrentCSSZoom(html.ownerDocument.body || html) <= SCROLLBAR_MAX) {
    // Only a declared gutter reserves space; any other narrowing of the <html>
    // box (a margin, a width, a transform) must not be treated as one. Read
    // last so the style lookup stays off the common path.
    const scrollbarGutter = getComputedStyle(html).scrollbarGutter;
    if (scrollbarGutter && scrollbarGutter !== 'auto') {
      width -= reservedWidth;
    }
  }
  return {
    width,
    height,
    x,
    y
  };
}

// Returns the inner client rect, subtracting scrollbars if present.
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === 'fixed');
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = getScale(element);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    width,
    height,
    x,
    y
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === 'viewport' || clippingAncestor === 'layoutViewport') {
    rect = getViewportRect(element, strategy, clippingAncestor);
  } else if (clippingAncestor === 'document') {
    rect = getDocumentRect(getDocumentElement(element));
  } else if (isElement(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y,
      width: clippingAncestor.width,
      height: clippingAncestor.height
    };
  }
  return rectToClientRect(rect);
}

// A "clipping ancestor" is an `overflow` element with the characteristic of
// clipping (or hiding) child elements. This returns all clipping ancestors
// of the given element up the tree.
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = getOverflowAncestors(element, [], false).filter(el => isElement(el) && getNodeName(el) !== 'body');
  let lastKeptComputedStyle = null;
  const elementIsFixed = getComputedStyle(element).position === 'fixed';
  let currentNode = elementIsFixed ? getParentNode(element) : element;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle(currentNode);
    const currentNodeIsContaining = isContainingBlock(currentNode);
    // Position of the containing block chain below the current node. A fixed
    // element whose containing block hasn't been found yet is a fixed chain.
    const lastPosition = lastKeptComputedStyle ? lastKeptComputedStyle.position : elementIsFixed ? 'fixed' : '';

    // A non-containing ancestor does not clip the element when the chain
    // below it escapes it: a fixed chain escapes all ancestors up to the
    // next containing block, an absolute chain escapes static ancestors.
    const shouldDropCurrentNode = !currentNodeIsContaining && (lastPosition === 'fixed' || lastPosition === 'absolute' && computedStyle.position === 'static');
    if (shouldDropCurrentNode) {
      // Drop non-containing blocks.
      result = result.filter(ancestor => ancestor !== currentNode);
    } else {
      // The kept node carries the chain position for the next iteration.
      lastKeptComputedStyle = computedStyle;
    }
    currentNode = getParentNode(currentNode);
  }
  cache.set(element, result);
  return result;
}

// Gets the maximum area that the element is visible in due to any number of
// clipping ancestors.
function getClippingRect({
  element,
  boundary,
  rootBoundary,
  strategy
}) {
  const elementClippingAncestors = boundary === 'clippingAncestors' ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstRect = getClientRectFromClippingAncestor(element, clippingAncestors[0], strategy);
  let top = firstRect.top;
  let right = firstRect.right;
  let bottom = firstRect.bottom;
  let left = firstRect.left;
  for (let i = 1; i < clippingAncestors.length; i++) {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestors[i], strategy);
    top = max(rect.top, top);
    right = min(rect.right, right);
    bottom = min(rect.bottom, bottom);
    left = max(rect.left, left);
  }
  return {
    width: right - left,
    height: bottom - top,
    x: left,
    y: top
  };
}

function getDimensions(element) {
  const {
    width,
    height
  } = getCssDimensions(element);
  return {
    width,
    height
  };
}

function getRectRelativeToOffsetParent(element, offsetParent, strategy, floating) {
  const isOffsetParentAnHTMLElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const isFixed = strategy === 'fixed';
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let offsetX = 0;
  let offsetY = 0;
  if (isOffsetParentAnHTMLElement || !isFixed) {
    if (getNodeName(offsetParent) !== 'body' || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isOffsetParentAnHTMLElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsetX = offsetRect.x + offsetParent.clientLeft;
      offsetY = offsetRect.y + offsetParent.clientTop;
    }
  }

  // If the <body> scrollbar appears on the left (e.g. RTL systems). Use
  // Firefox with layout.scrollbar.side = 3 in about:config to test this.
  if (!isOffsetParentAnHTMLElement) {
    offsetX = getWindowScrollBarX(documentElement);
  }
  const htmlOffset = !isOffsetParentAnHTMLElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);

  // When the offsetParent is the Window, every term above is in viewport
  // pixels, but the coords are written as `left`/`top` on the floating element,
  // which resolves them in its own CSS-zoom space.
  const zoom = isElement(offsetParent) ? 1 : getCurrentCSSZoom(floating);
  return {
    x: (rect.left + scroll.scrollLeft - offsetX - htmlOffset.x) / zoom,
    y: (rect.top + scroll.scrollTop - offsetY - htmlOffset.y) / zoom,
    width: rect.width / zoom,
    height: rect.height / zoom
  };
}

function isStaticPositioned(element) {
  return getComputedStyle(element).position === 'static';
}

function getTrueOffsetParent(element, polyfill) {
  if (!isHTMLElement(element) || getComputedStyle(element).position === 'fixed') {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  let rawOffsetParent = element.offsetParent;

  // Firefox returns the <html> element as the offsetParent if it's non-static,
  // while Chrome and Safari return the <body> element. The <body> element must
  // be used to perform the correct calculations even if the <html> element is
  // non-static.
  if (getDocumentElement(element) === rawOffsetParent) {
    rawOffsetParent = rawOffsetParent.ownerDocument.body;
  }
  return rawOffsetParent;
}

// Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.
function getOffsetParent$1(element, polyfill) {
  const win = getWindow(element);
  if (isTopLayer(element)) {
    return win;
  }
  if (!isHTMLElement(element)) {
    let svgOffsetParent = getParentNode(element);
    while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
      if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
        return svgOffsetParent;
      }
      svgOffsetParent = getParentNode(svgOffsetParent);
    }
    return win;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) {
    return win;
  }
  return offsetParent || getContainingBlock(element) || win;
}

const getElementRects = async function getElementRects(data) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent$1;
  const getDimensionsFn = this.getDimensions;
  const floatingDimensions = await getDimensionsFn(data.floating);
  return {
    reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy, data.floating),
    floating: {
      x: 0,
      y: 0,
      width: floatingDimensions.width,
      height: floatingDimensions.height
    }
  };
};

function isRTL(element) {
  return getComputedStyle(element).direction === 'rtl';
}

const platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement,
  getClippingRect,
  getOffsetParent: getOffsetParent$1,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement,
  isRTL
};

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const offset = offset$1;

/**
 * Optimizes the visibility of the floating element by choosing the placement
 * that has the most space available automatically, without needing to specify a
 * preferred placement. Alternative to `flip`.
 * @see https://floating-ui.com/docs/autoPlacement
 */
const autoPlacement = autoPlacement$1;

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift = shift$1;

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const flip = flip$1;

/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const hide = hide$1;

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow = arrow$1;

/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
const limitShift = limitShift$1;

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a given reference element.
 */
const computePosition = (reference, floating, options) => {
  // This caches the expensive `getClippingElementAncestors` function so that
  // multiple lifecycle resets re-use the same result. It only lives for a
  // single call. If other functions become expensive, we can add them as well.
  const cache = new Map();
  const mergedOptions = options !== null && options !== void 0 ? options : {};
  const platformWithCache = _objectSpread2(_objectSpread2(_objectSpread2({}, platform), mergedOptions.platform), {}, {
    _c: cache
  });
  return computePosition$1(reference, floating, _objectSpread2(_objectSpread2({}, mergedOptions), {}, {
    platform: platformWithCache
  }));
};

const unsetSides = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto'
};
function roundOffsetsByDPR(offsets, win) {
  const dpr = win.devicePixelRatio || 1;
  return {
    x: Math.round(offsets.x * dpr) / dpr || 0,
    y: Math.round(offsets.y * dpr) / dpr || 0
  };
}
function getOffsetParent(element) {
  const win = getWindow(element);
  if (getComputedStyle(element).position === 'fixed') {
    return win;
  }
  return element.offsetParent || getDocumentElement(element);
}
function getBasePlacement(placement) {
  return placement.split('-')[0] || placement;
}
function getVariation(placement) {
  return placement.split('-')[1];
}
function mapToStyles({
  popper,
  popperRect,
  placement,
  variation,
  offsets,
  position,
  gpuAcceleration,
  adaptive,
  roundOffsets,
  isFixed
}) {
  var _offsets$x, _offsets$y;
  let x = (_offsets$x = offsets.x) !== null && _offsets$x !== void 0 ? _offsets$x : 0;
  let y = (_offsets$y = offsets.y) !== null && _offsets$y !== void 0 ? _offsets$y : 0;
  const hasX = Object.prototype.hasOwnProperty.call(offsets, 'x');
  const hasY = Object.prototype.hasOwnProperty.call(offsets, 'y');
  if (typeof roundOffsets === 'function') {
    ({
      x,
      y
    } = roundOffsets({
      x,
      y
    }));
  }
  let sideX = 'left';
  let sideY = 'top';
  const win = getWindow(popper);
  if (adaptive) {
    let offsetParent = getOffsetParent(popper);
    let heightProp = 'clientHeight';
    let widthProp = 'clientWidth';
    if (offsetParent === win) {
      offsetParent = getDocumentElement(popper);
      if (getComputedStyle(offsetParent).position !== 'static' && position === 'absolute') {
        heightProp = 'scrollHeight';
        widthProp = 'scrollWidth';
      }
    }
    const parentElement = offsetParent;
    if (placement === 'top' || (placement === 'left' || placement === 'right') && variation === 'end') {
      sideY = 'bottom';
      const offsetY = isFixed && parentElement === win && win.visualViewport ? win.visualViewport.height : parentElement[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }
    if (placement === 'left' || (placement === 'top' || placement === 'bottom') && variation === 'end') {
      sideX = 'right';
      const offsetX = isFixed && parentElement === win && win.visualViewport ? win.visualViewport.width : parentElement[widthProp];
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }
  const commonStyles = _objectSpread2({
    position
  }, adaptive ? unsetSides : null);
  if (roundOffsets === true) {
    ({
      x,
      y
    } = roundOffsetsByDPR({
      x,
      y
    }, win));
  }
  if (gpuAcceleration) {
    return _objectSpread2(_objectSpread2({}, commonStyles), {}, {
      [sideY]: hasY ? '0' : '',
      [sideX]: hasX ? '0' : '',
      transform: (win.devicePixelRatio || 1) <= 1 ? `translate(${x}px, ${y}px)` : `translate3d(${x}px, ${y}px, 0)`
    });
  }
  return _objectSpread2(_objectSpread2({}, commonStyles), {}, {
    [sideY]: hasY ? `${y}px` : '',
    [sideX]: hasX ? `${x}px` : '',
    transform: ''
  });
}
function computeStyles({
  state,
  options
}) {
  const {
    gpuAcceleration = true,
    adaptive = true,
    roundOffsets = true
  } = options || {};
  const commonStyles = {
    placement: getBasePlacement(state.placement),
    variation: getVariation(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration,
    adaptive,
    roundOffsets,
    isFixed: state.options.strategy === 'fixed'
  };
  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = _objectSpread2(_objectSpread2({}, state.styles.popper), mapToStyles(_objectSpread2(_objectSpread2({}, commonStyles), {}, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy
    })));
  }
  if (state.modifiersData.arrow != null) {
    state.styles.arrow = _objectSpread2(_objectSpread2({}, state.styles.arrow), mapToStyles(_objectSpread2(_objectSpread2({}, commonStyles), {}, {
      offsets: state.modifiersData.arrow,
      position: 'absolute',
      adaptive: false
    })));
  }
  state.attributes.popper = _objectSpread2(_objectSpread2({}, state.attributes.popper), {}, {
    'data-popper-placement': state.placement
  });
}
function applyStyles(state) {
  Object.keys(state.elements).forEach(name => {
    const element = state.elements[name];
    if (!element || !('style' in element)) {
      return;
    }
    const style = state.styles[name];
    if (style) {
      Object.assign(element.style, style);
    }
    const attributes = state.attributes[name];
    if (!attributes) {
      return;
    }
    Object.keys(attributes).forEach(attribute => {
      const value = attributes[attribute];
      if (value === false) {
        element.removeAttribute(attribute);
      } else {
        element.setAttribute(attribute, value === true ? '' : String(value));
      }
    });
  });
}

const basePlacements = ['top', 'bottom', 'right', 'left'];
const variationPlacements = ['top-start', 'top-end', 'bottom-start', 'bottom-end', 'right-start', 'right-end', 'left-start', 'left-end'];
const autoPlacements = ['auto', 'auto-start', 'auto-end'];

/**
 * Runtime placement list. Element Plus validates the `placement` prop against
 * this export from `@popperjs/core`.
 */
const placements = [...autoPlacements, ...basePlacements.flatMap(side => [side, `${side}-start`, `${side}-end`])];
const modifierPhases = ['beforeRead', 'read', 'afterRead', 'beforeMain', 'main', 'afterMain', 'beforeWrite', 'write', 'afterWrite'];

function mergeByName(modifiers) {
  const merged = {};
  modifiers.forEach(current => {
    if (!current || !current.name) {
      return;
    }
    const existing = merged[current.name];
    const next = _objectSpread2(_objectSpread2(_objectSpread2({}, existing), current), {}, {
      name: current.name,
      options: _objectSpread2(_objectSpread2({}, existing === null || existing === void 0 ? void 0 : existing.options), current.options),
      data: _objectSpread2(_objectSpread2({}, existing === null || existing === void 0 ? void 0 : existing.data), current.data)
    });
    if (typeof current.fn !== 'function' && existing !== null && existing !== void 0 && existing.fn) {
      next.fn = existing.fn;
    }
    if (current.phase == null && existing !== null && existing !== void 0 && existing.phase) {
      next.phase = existing.phase;
    }
    if (current.enabled == null && existing) {
      next.enabled = existing.enabled;
    }
    if (current.effect == null && existing !== null && existing !== void 0 && existing.effect) {
      next.effect = existing.effect;
    }
    if (current.requires == null && existing !== null && existing !== void 0 && existing.requires) {
      next.requires = existing.requires;
    }
    if (current.requiresIfExists == null && existing !== null && existing !== void 0 && existing.requiresIfExists) {
      next.requiresIfExists = existing.requiresIfExists;
    }
    merged[current.name] = next;
  });
  return Object.keys(merged).map(key => merged[key]);
}
function sortByDependencies(modifiers) {
  const map = new Map();
  const visited = new Set();
  const result = [];
  modifiers.forEach(modifier => {
    map.set(modifier.name, modifier);
  });
  const visit = modifier => {
    if (visited.has(modifier.name)) {
      return;
    }
    visited.add(modifier.name);
    const requires = [...(modifier.requires || []), ...(modifier.requiresIfExists || [])];
    requires.forEach(dependency => {
      const next = map.get(dependency);
      if (next) {
        visit(next);
      }
    });
    result.push(modifier);
  };
  modifiers.forEach(modifier => {
    visit(modifier);
  });
  return result;
}
function orderModifiers(modifiers) {
  const ordered = sortByDependencies(modifiers.map(modifier => _objectSpread2(_objectSpread2({}, modifier), {}, {
    enabled: modifier.enabled !== false,
    phase: modifier.phase || 'main',
    fn: modifier.fn || (() => undefined)
  })));
  return modifierPhases.reduce((acc, phase) => acc.concat(ordered.filter(modifier => modifier.phase === phase)), []);
}

const defaultFn = () => undefined;
const DEFAULT_OPTIONS = {
  placement: 'bottom',
  strategy: 'absolute',
  modifiers: []
};
function isVirtualElement(value) {
  return !!value && typeof value === 'object' && 'getBoundingClientRect' in value && typeof value.getBoundingClientRect === 'function' && !isElement(value);
}
function scrollParentsOf(element) {
  if (isElement(element)) {
    return getOverflowAncestors(element);
  }
  if (element.contextElement && isElement(element.contextElement)) {
    return getOverflowAncestors(element.contextElement);
  }
  return [];
}
function toRect(element) {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height
  };
}
function mapBoundary(boundary) {
  if (boundary == null || boundary === 'clippingParents') {
    return 'clippingAncestors';
  }
  return boundary;
}
function normalizePadding(padding, state) {
  var _padding;
  if (typeof padding !== 'function') {
    return padding !== null && padding !== void 0 ? padding : 0;
  }
  return (_padding = padding({
    placement: (state === null || state === void 0 ? void 0 : state.placement) || 'bottom',
    reference: (state === null || state === void 0 ? void 0 : state.rects.reference) || {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    },
    popper: (state === null || state === void 0 ? void 0 : state.rects.floating) || {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }
  })) !== null && _padding !== void 0 ? _padding : 0;
}
function mapOffset(value, placement) {
  if (typeof value === 'function') {
    return state => {
      const result = value({
        placement: state.placement || placement,
        reference: state.rects.reference,
        popper: state.rects.floating
      });
      const [skidding, distance] = Array.isArray(result) ? result : [0, result];
      return {
        mainAxis: distance || 0,
        crossAxis: skidding || 0
      };
    };
  }
  if (Array.isArray(value)) {
    const [skidding, distance] = value;
    return {
      mainAxis: distance || 0,
      crossAxis: skidding || 0
    };
  }
  if (typeof value === 'number') {
    return {
      mainAxis: value,
      crossAxis: 0
    };
  }
  return 0;
}
function resolveArrowElement(element, popper) {
  if (!element) {
    return undefined;
  }
  if (typeof element === 'string') {
    return popper.querySelector(element) || undefined;
  }
  return element;
}
function isAutoPlacement(placement) {
  return placement === 'auto' || placement.startsWith('auto-');
}
function findEnabled(modifiers, name) {
  return modifiers.find(modifier => modifier.name === name && modifier.enabled !== false);
}
function usesDefaultFn(modifier) {
  return !!modifier && modifier.fn === defaultFn;
}
const passive = {
  passive: true
};
function eventListenersEffect({
  state,
  instance,
  options
}) {
  const {
    scroll = true,
    resize = true
  } = options || {};
  const win = getWindow(state.elements.popper);
  const targets = new Set([...state.scrollParents.reference, ...state.scrollParents.popper]);
  if (scroll) {
    targets.forEach(target => {
      target.addEventListener('scroll', instance.update, passive);
    });
  }
  if (resize) {
    win.addEventListener('resize', instance.update, passive);
  }
  return () => {
    if (scroll) {
      targets.forEach(target => {
        target.removeEventListener('scroll', instance.update, passive);
      });
    }
    if (resize) {
      win.removeEventListener('resize', instance.update, passive);
    }
  };
}
function baseModifier(definition) {
  return _objectSpread2({
    enabled: true,
    phase: 'main',
    fn: defaultFn,
    data: {}
  }, definition);
}
const defaultModifiers = [baseModifier({
  name: 'eventListeners',
  phase: 'write',
  effect: eventListenersEffect
}), baseModifier({
  name: 'popperOffsets',
  phase: 'read'
}), baseModifier({
  name: 'computeStyles',
  phase: 'beforeWrite'
}), baseModifier({
  name: 'applyStyles',
  phase: 'write',
  requires: ['computeStyles']
}), baseModifier({
  name: 'offset',
  phase: 'main',
  requires: ['popperOffsets']
}), baseModifier({
  name: 'flip',
  phase: 'main',
  requiresIfExists: ['offset']
}), baseModifier({
  name: 'preventOverflow',
  phase: 'main',
  requiresIfExists: ['offset']
}), baseModifier({
  name: 'arrow',
  phase: 'main',
  requires: ['popperOffsets'],
  requiresIfExists: ['preventOverflow']
}), baseModifier({
  name: 'hide',
  phase: 'main',
  requiresIfExists: ['preventOverflow']
})];
const liteModifiers = defaultModifiers.filter(modifier => ['eventListeners', 'popperOffsets', 'computeStyles', 'applyStyles'].includes(modifier.name));
function overflowOptions(options, placement) {
  return {
    padding: normalizePadding(options === null || options === void 0 ? void 0 : options.padding, {
      placement,
      rects: {
        reference: {
          x: 0,
          y: 0,
          width: 0,
          height: 0
        },
        floating: {
          x: 0,
          y: 0,
          width: 0,
          height: 0
        }
      }
    }),
    boundary: mapBoundary(options === null || options === void 0 ? void 0 : options.boundary),
    rootBoundary: (options === null || options === void 0 ? void 0 : options.rootBoundary) || 'viewport',
    altBoundary: Boolean(options === null || options === void 0 ? void 0 : options.altBoundary)
  };
}
function buildMiddleware(modifiers, placement, popper) {
  const middleware = [];
  const offsetModifier = findEnabled(modifiers, 'offset');
  const flipModifier = findEnabled(modifiers, 'flip');
  const preventOverflowModifier = findEnabled(modifiers, 'preventOverflow');
  const arrowModifier = findEnabled(modifiers, 'arrow');
  const hideModifier = findEnabled(modifiers, 'hide');
  const canFlip = usesDefaultFn(flipModifier);
  if (usesDefaultFn(offsetModifier)) {
    var _offsetModifier$optio, _offsetModifier$optio2;
    const rawOffset = (_offsetModifier$optio = offsetModifier === null || offsetModifier === void 0 || (_offsetModifier$optio2 = offsetModifier.options) === null || _offsetModifier$optio2 === void 0 ? void 0 : _offsetModifier$optio2.offset) !== null && _offsetModifier$optio !== void 0 ? _offsetModifier$optio : [0, 0];
    middleware.push(offset(mapOffset(rawOffset, placement)));
  }
  if (canFlip && isAutoPlacement(placement)) {
    const alignment = placement.split('-')[1];
    const flipOptions = (flipModifier === null || flipModifier === void 0 ? void 0 : flipModifier.options) || {};
    const allowed = Array.isArray(flipOptions.allowedAutoPlacements) ? flipOptions.allowedAutoPlacements.filter(item => !isAutoPlacement(item)) : undefined;
    middleware.push(autoPlacement(_objectSpread2(_objectSpread2(_objectSpread2({}, alignment === 'start' || alignment === 'end' ? {
      alignment
    } : null), overflowOptions(flipOptions, 'bottom')), allowed ? {
      allowedPlacements: allowed
    } : null)));
  } else if (canFlip) {
    const flipOptions = (flipModifier === null || flipModifier === void 0 ? void 0 : flipModifier.options) || {};
    middleware.push(flip(_objectSpread2({
      mainAxis: flipOptions.mainAxis !== false,
      crossAxis: flipOptions.altAxis !== false,
      fallbackPlacements: flipOptions.fallbackPlacements,
      flipAlignment: flipOptions.flipVariations !== false
    }, overflowOptions(flipOptions, placement))));
  }
  if (usesDefaultFn(preventOverflowModifier)) {
    var _preventOptions$tethe;
    const preventOptions = (preventOverflowModifier === null || preventOverflowModifier === void 0 ? void 0 : preventOverflowModifier.options) || {};
    const tether = preventOptions.tether !== false;
    const tetherOffset = (_preventOptions$tethe = preventOptions.tetherOffset) !== null && _preventOptions$tethe !== void 0 ? _preventOptions$tethe : 0;
    middleware.push(shift(_objectSpread2(_objectSpread2({
      mainAxis: preventOptions.mainAxis !== false,
      crossAxis: preventOptions.altAxis === true
    }, overflowOptions(preventOptions, placement)), tether ? null : {
      limiter: limitShift(typeof tetherOffset === 'number' ? {
        offset: tetherOffset
      } : {})
    })));
  }
  if (usesDefaultFn(arrowModifier)) {
    const arrowOptions = (arrowModifier === null || arrowModifier === void 0 ? void 0 : arrowModifier.options) || {};
    const element = resolveArrowElement(arrowOptions.element, popper);
    if (element) {
      const padding = arrowOptions.padding;
      middleware.push(arrow({
        element,
        padding: normalizePadding(padding, {
          placement,
          rects: {
            reference: {
              x: 0,
              y: 0,
              width: 0,
              height: 0
            },
            floating: {
              x: 0,
              y: 0,
              width: 0,
              height: 0
            }
          }
        })
      }));
    }
  }
  if (usesDefaultFn(hideModifier)) {
    const hideOptions = overflowOptions((hideModifier === null || hideModifier === void 0 ? void 0 : hideModifier.options) || {}, placement);
    middleware.push(hide(_objectSpread2(_objectSpread2({}, hideOptions), {}, {
      strategy: 'referenceHidden'
    })));
    middleware.push(hide(_objectSpread2(_objectSpread2({}, hideOptions), {}, {
      strategy: 'escaped'
    })));
  }
  return {
    middleware,
    computePlacement: isAutoPlacement(placement) ? 'bottom' : placement
  };
}
function assignArrowData(target, arrowData) {
  var _arrowData$centerOffs;
  if (!arrowData) {
    return;
  }
  const data = {
    centerOffset: (_arrowData$centerOffs = arrowData.centerOffset) !== null && _arrowData$centerOffs !== void 0 ? _arrowData$centerOffs : 0
  };
  if (arrowData.x != null) {
    data.x = arrowData.x;
  }
  if (arrowData.y != null) {
    data.y = arrowData.y;
  }
  target.arrow = data;
}
function popperGenerator(generatorOptions = {}) {
  const generatorModifiers = generatorOptions.defaultModifiers || [];
  const generatorDefaults = _objectSpread2(_objectSpread2({}, DEFAULT_OPTIONS), generatorOptions.defaultOptions);
  return function createPopper(reference, popper, options = generatorDefaults) {
    let destroyed = false;
    let running = false;
    let rerun = false;
    let didFirstUpdate = false;
    let scheduled = null;
    const effectCleanups = [];
    const state = {
      elements: {
        reference,
        popper
      },
      options: _objectSpread2({}, generatorDefaults),
      placement: generatorDefaults.placement,
      strategy: generatorDefaults.strategy,
      orderedModifiers: [],
      rects: {
        reference: {
          x: 0,
          y: 0,
          width: 0,
          height: 0
        },
        popper: {
          x: 0,
          y: 0,
          width: 0,
          height: 0
        }
      },
      scrollParents: {
        reference: [],
        popper: []
      },
      styles: {},
      attributes: {},
      modifiersData: {},
      reset: false
    };
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
        const nextOptions = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
        state.options = _objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2({}, generatorDefaults), state.options), nextOptions), {}, {
          modifiers: nextOptions.modifiers || state.options.modifiers || []
        });
        state.strategy = state.options.strategy || 'absolute';
        state.placement = state.options.placement || 'bottom';
        state.scrollParents = {
          reference: scrollParentsOf(reference),
          popper: scrollParentsOf(popper)
        };
        const merged = mergeByName([...generatorModifiers, ...(state.options.modifiers || [])]);
        state.orderedModifiers = orderModifiers(merged).filter(modifier => modifier.enabled !== false);
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
      }
    };
    function cleanupEffects() {
      effectCleanups.splice(0).forEach(cleanup => {
        cleanup();
      });
    }
    function runEffects() {
      state.orderedModifiers.forEach(modifier => {
        if (typeof modifier.effect !== 'function') {
          return;
        }
        const cleanup = modifier.effect({
          state,
          instance,
          options: modifier.options || {},
          name: modifier.name
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
      var _arrowModifier$option;
      if (destroyed || !reference || !popper || !isVirtualElement(reference) && !isElement(reference)) {
        return;
      }
      if (!popper.getBoundingClientRect) {
        return;
      }
      const placement = state.options.placement || 'bottom';
      const ordered = state.orderedModifiers;
      state.placement = placement;
      state.strategy = state.options.strategy || 'absolute';
      state.reset = false;
      state.rects = {
        reference: toRect(reference),
        popper: toRect(popper)
      };
      state.styles = {
        popper: {}
      };
      state.attributes = {
        popper: {}
      };
      state.modifiersData = {};
      ordered.forEach(modifier => {
        state.modifiersData[modifier.name] = _objectSpread2({}, modifier.data);
      });
      const arrowModifier = findEnabled(ordered, 'arrow');
      const arrowElement = usesDefaultFn(arrowModifier) ? resolveArrowElement(arrowModifier === null || arrowModifier === void 0 || (_arrowModifier$option = arrowModifier.options) === null || _arrowModifier$option === void 0 ? void 0 : _arrowModifier$option.element, popper) : undefined;
      if (arrowElement instanceof HTMLElement) {
        state.elements.arrow = arrowElement;
      } else {
        delete state.elements.arrow;
      }
      const {
        middleware,
        computePlacement
      } = buildMiddleware(ordered, placement, popper);
      const floating = await computePosition(reference, popper, {
        placement: computePlacement,
        strategy: state.strategy,
        middleware
      });
      state.placement = floating.placement;
      state.modifiersData.popperOffsets = {
        x: floating.x,
        y: floating.y
      };
      state.modifiersData.preventOverflow = {
        x: floating.x,
        y: floating.y
      };
      if (floating.middlewareData.offset) {
        var _floating$middlewareD, _floating$middlewareD2;
        state.modifiersData.offset = {
          [floating.placement]: {
            x: (_floating$middlewareD = floating.middlewareData.offset.x) !== null && _floating$middlewareD !== void 0 ? _floating$middlewareD : 0,
            y: (_floating$middlewareD2 = floating.middlewareData.offset.y) !== null && _floating$middlewareD2 !== void 0 ? _floating$middlewareD2 : 0
          }
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
            left: 0
          },
          popperEscapeOffsets: hideData.escapedOffsets || {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        };
        state.attributes.popper = _objectSpread2(_objectSpread2({}, state.attributes.popper), {}, {
          'data-popper-reference-hidden': !!hideData.referenceHidden,
          'data-popper-escaped': !!hideData.escaped
        });
      }
      ordered.forEach(modifier => {
        if (modifier.name === 'computeStyles' && modifier.fn === defaultFn) {
          computeStyles({
            state,
            options: modifier.options || {}
          });
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
          name: modifier.name
        });
        if (result) {
          Object.assign(state, result);
        }
      });
      if (!didFirstUpdate) {
        var _state$options$onFirs, _state$options;
        didFirstUpdate = true;
        (_state$options$onFirs = (_state$options = state.options).onFirstUpdate) === null || _state$options$onFirs === void 0 || _state$options$onFirs.call(_state$options, state);
      }
    }
    if (!reference || !popper) {
      return instance;
    }
    void instance.setOptions(options);
    return instance;
  };
}
const createPopper = popperGenerator({
  defaultModifiers
});
const createPopperLite = popperGenerator({
  defaultModifiers: liteModifiers
});
const createPopperBase = popperGenerator();

function toPadding(padding) {
  var _padding$top, _padding$right, _padding$bottom, _padding$left;
  const fallback = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
  if (padding == null) {
    return fallback;
  }
  if (typeof padding === 'function') {
    return fallback;
  }
  if (typeof padding === 'number') {
    return {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding
    };
  }
  return {
    top: (_padding$top = padding.top) !== null && _padding$top !== void 0 ? _padding$top : 0,
    right: (_padding$right = padding.right) !== null && _padding$right !== void 0 ? _padding$right : 0,
    bottom: (_padding$bottom = padding.bottom) !== null && _padding$bottom !== void 0 ? _padding$bottom : 0,
    left: (_padding$left = padding.left) !== null && _padding$left !== void 0 ? _padding$left : 0
  };
}
function readRect(element) {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
    x: rect.left,
    y: rect.top
  };
}
function boundaryRect(state, rootBoundary) {
  var _win$visualViewport$w, _win$visualViewport, _win$visualViewport$h, _win$visualViewport2;
  const popper = state.elements.popper;
  const doc = popper.ownerDocument;
  const win = doc.defaultView || window;
  const html = doc.documentElement;
  if (rootBoundary === 'document') {
    return {
      top: 0,
      left: 0,
      right: Math.max(html.scrollWidth, html.clientWidth),
      bottom: Math.max(html.scrollHeight, html.clientHeight)
    };
  }
  const width = (_win$visualViewport$w = (_win$visualViewport = win.visualViewport) === null || _win$visualViewport === void 0 ? void 0 : _win$visualViewport.width) !== null && _win$visualViewport$w !== void 0 ? _win$visualViewport$w : html.clientWidth;
  const height = (_win$visualViewport$h = (_win$visualViewport2 = win.visualViewport) === null || _win$visualViewport2 === void 0 ? void 0 : _win$visualViewport2.height) !== null && _win$visualViewport$h !== void 0 ? _win$visualViewport$h : html.clientHeight;
  return {
    top: 0,
    left: 0,
    right: width,
    bottom: height
  };
}

/**
 * Popper-compatible overflow helper. Positive values mean that side overflows
 * the clipping boundary.
 */
function detectOverflow(state, options = {}) {
  const padding = toPadding(options.padding);
  const element = options.elementContext === 'reference' && 'getBoundingClientRect' in state.elements.reference ? state.elements.reference : state.elements.popper;
  const rect = readRect(element);
  const boundary = boundaryRect(state, options.rootBoundary);
  return {
    top: boundary.top + padding.top - rect.top,
    left: boundary.left + padding.left - rect.left,
    bottom: rect.bottom - (boundary.bottom - padding.bottom),
    right: rect.right - (boundary.right - padding.right)
  };
}

export { autoPlacements, basePlacements, createPopper, createPopperBase, createPopperLite, defaultModifiers, detectOverflow, modifierPhases, placements, popperGenerator, variationPlacements };
