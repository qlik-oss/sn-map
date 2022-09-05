import { mergeBounds, getBoundsWidth, mergeBoundsArray } from '../geo';

describe('geo-utils', () => {
  describe('mergeBounds', () => {
    it('should return correct mergeBounds when bounds are higher than the mergedBounds', () => {
      const bounds1 = { min: [1, 1], max: [2, 2] };
      const bounds2 = { min: [10, 10], max: [20, 20] };
      const newBounds = mergeBounds(bounds2, bounds1);
      expect(newBounds.min[0]).toEqual(1);
      expect(newBounds.min[1]).toEqual(1);
      expect(newBounds.max[0]).toEqual(20);
      expect(newBounds.max[1]).toEqual(20);
    });
    it('should return correct mergeBounds when the mergedBounds are higher than bounds', () => {
      const bounds1 = { min: [10, 10], max: [20, 20] };
      const bounds2 = { min: [1, 1], max: [2, 2] };
      const newBounds = mergeBounds(bounds2, bounds1);
      expect(newBounds.min[0]).toEqual(1);
      expect(newBounds.min[1]).toEqual(1);
      expect(newBounds.max[0]).toEqual(20);
      expect(newBounds.max[1]).toEqual(20);
    });
  });
  describe('getBoundsWidth', () => {
    it('should return correct width', () => {
      const bounds = { min: [1, 1], max: [2.1, 2.1] };
      const width = getBoundsWidth(bounds);
      expect(width).toEqual(1.1);
    });
    it('should return correct width when min is more than max (sanity check to check changes in absolute)', () => {
      const bounds = { min: [2.1, 2.1], max: [1, 1] };
      const width = getBoundsWidth(bounds);
      expect(width).toEqual(-1.1);
    });
  });
  describe('mergeBoundsArray', () => {
    it('should return null when there are no bounds', () => {
      const bounds: (Rectangle | null)[] = [];
      const wrapLong = 180;
      const mergedBounds = mergeBoundsArray(bounds, wrapLong);
      expect(mergedBounds).toEqual(null);
    });
    it('should return null when the bounds are null', () => {
      const bounds: (Rectangle | null)[] = [null];
      const wrapLong = 180;
      const mergedBounds = mergeBoundsArray(bounds, wrapLong);
      expect(mergedBounds).toEqual(null);
    });
    it('should return proper bounds', () => {
      const bounds: (Rectangle | null)[] = [{ max: [62, 15], min: [61, 10] }];
      const wrapLong = 180;
      const mergedBounds = mergeBoundsArray(bounds, wrapLong);
      expect(mergedBounds).toEqual({ max: [62, 15], min: [61, 10] });
    });
    it('should return proper bounds when wrapLong is null', () => {
      const bounds: (Rectangle | null)[] = [
        { max: [62, 15], min: [61, 10] },
        { max: [62, 15], min: [61, 10] },
      ];
      const wrapLong = NaN;
      const mergedBounds = mergeBoundsArray(bounds, wrapLong);
      expect(mergedBounds).toEqual({ max: [62, 15], min: [61, 10] });
    });
    it('should return proper bounds when min of second bound is higher', () => {
      const bounds: (Rectangle | null)[] = [
        { max: [5, 5], min: [1, 1] },
        { max: [10, 10], min: [2, 2] },
      ];
      const wrapLong = NaN;
      const mergedBounds = mergeBoundsArray(bounds, wrapLong);
      expect(mergedBounds).toEqual({ max: [10, 10], min: [1, 1] });
    });
    it('should return proper bounds when multiple bounds', () => {
      const bounds: (Rectangle | null)[] = [{ max: [400, 400], min: [1, 1] }];
      const wrapLong = 180;
      const mergedBounds = mergeBoundsArray(bounds, wrapLong);
      expect(mergedBounds?.max[1]).toEqual(180);
      expect(mergedBounds?.min[1]).toEqual(-180);
    });
  });
});
