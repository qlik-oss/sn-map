const shiftBounds = (bounds: Rectangle, dx: number, dy: number): Rectangle => {
  return {
    min: [bounds.min[0] + dy, bounds.min[1] + dx],
    max: [bounds.max[0] + dy, bounds.max[1] + dx],
  };
};

export const mergeBounds = (a: Rectangle, b: Rectangle): Rectangle => {
  return {
    min: [Math.min(a.min[0], b.min[0]), Math.min(a.min[1], b.min[1])],
    max: [Math.max(a.max[0], b.max[0]), Math.max(a.max[1], b.max[1])],
  };
};

export const getBoundsWidth = (bounds: Rectangle) => {
  return bounds.max[1] - bounds.min[1];
};

/**
 * Returns the least wide of two bounds.
 */
const getNarrowestBounds = (a: Rectangle, b: Rectangle) => {
  return getBoundsWidth(a) > getBoundsWidth(b) ? b : a;
};

export const mergeBoundsArray = (boundsArray: (Rectangle | null)[], wrapLong: number) => {
  const merged = boundsArray.reduce((mergedBounds: Rectangle | null, bounds: Rectangle | null) => {
    if (!bounds) {
      return mergedBounds;
    }
    if (!mergedBounds) {
      return bounds;
    }

    // we always want to merge into the rightmost bounds s.t. the 360deg shift below works
    if (mergedBounds.min[1] < bounds.min[1]) {
      const tmp = mergedBounds;
      mergedBounds = bounds;
      bounds = tmp;
    }

    if (isNaN(wrapLong)) {
      return mergeBounds(mergedBounds, bounds);
    } else {
      return getNarrowestBounds(
        mergeBounds(mergedBounds, bounds),
        mergeBounds(mergedBounds, shiftBounds(bounds, wrapLong * 2, 0))
      );
    }
  }, null);
  // If bounds are wider than 360 * 0.95 degrees, just set long to -180 - 180.
  if (merged && merged.max[1] - merged.min[1] >= wrapLong * 2 * 0.95) {
    merged.min[1] = -wrapLong;
    merged.max[1] = wrapLong;
  }
  return merged;
};
