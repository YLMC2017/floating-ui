export const basePlacements = ['top', 'bottom', 'right', 'left'] as const;
export const variationPlacements = [
  'top-start',
  'top-end',
  'bottom-start',
  'bottom-end',
  'right-start',
  'right-end',
  'left-start',
  'left-end',
] as const;
export const autoPlacements = ['auto', 'auto-start', 'auto-end'] as const;

/**
 * Runtime placement list. Element Plus validates the `placement` prop against
 * this export from `@popperjs/core`.
 */
export const placements = [
  ...autoPlacements,
  ...basePlacements.flatMap((side) => [
    side,
    `${side}-start` as const,
    `${side}-end` as const,
  ]),
];

export const modifierPhases = [
  'beforeRead',
  'read',
  'afterRead',
  'beforeMain',
  'main',
  'afterMain',
  'beforeWrite',
  'write',
  'afterWrite',
] as const;
