import { getViewBounds } from '../view-bounds';

describe('view-bounds', () => {
  describe('getViewBounds', () => {
    it('should return null when there are no layers', () => {
      const map: any = { getWrapLongitude: () => 180, repaint: () => {}, viewGeoBounds: () => {} };
      const layers: any = [];
      const bounds = getViewBounds(map, layers);
      expect(bounds).toEqual(null);
    });
    it('should return null when the layers have no bounds', () => {
      const map: any = { getWrapLongitude: () => 180, repaint: () => {}, viewGeoBounds: () => {} };
      const layers: any = [{ datasetModel: { getBounds: () => null } }];
      const bounds = getViewBounds(map, layers);
      expect(bounds).toEqual(null);
    });
    it('should return correct bounds when the layers have bounds', () => {
      const map: any = { getWrapLongitude: () => 180, repaint: () => {}, viewGeoBounds: () => {} };
      const layers: any = [{ datasetModel: { getBounds: () => ({ max: [62, 15], min: [62, 10] }) } }];
      const bounds = getViewBounds(map, layers);
      expect(bounds).toEqual({ max: [62, 15], min: [62, 10] });
    });
    it('should return correct bounds when the layers have multiple bounds', () => {
      const map: any = { getWrapLongitude: () => 180, repaint: () => {}, viewGeoBounds: () => {} };
      const layers: any = [
        { datasetModel: { getBounds: () => ({ max: [62, 15], min: [62, 10] }) } },
        { datasetModel: { getBounds: () => ({ max: [70.0815, 29.7358], min: [55.98333, 10] }) } },
      ];
      const bounds = getViewBounds(map, layers);
      expect(bounds).toEqual({ max: [70.0815, 29.7358], min: [55.98333, 10] });
    });
    it('should return correct bounds when getBoundsWidth * scale is higher than twice the wrap', () => {
      const map: any = { getWrapLongitude: () => 0.00001, repaint: () => {}, viewGeoBounds: () => {} };
      const layers: any = [{ datasetModel: { getBounds: () => ({ max: [62, 15], min: [62, 10] }) } }];
      const bounds = getViewBounds(map, layers);
      expect(bounds).toEqual({ max: [56.42, 0.000009100000000000001], min: [56.42, -0.000009100000000000001] });
    });
  });
});
