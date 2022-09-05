import AutoZoomService from '../auto-zoom-service';

jest.mock('../../models/tools/interaction-listener');
jest.mock('../../utils/utils');

describe('Auto-zoom service', () => {
  let autoZoomService: AutoZoomService;
  let map: any;

  beforeEach(() => {
    autoZoomService = new AutoZoomService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('zoom', () => {
    it('should zoom when zoom has been triggered', () => {
      autoZoomService.triggeredZoom = jest.fn().mockReturnValue({ triggeredZoom: true, bounds: {} });
      autoZoomService.zoomToBounds = jest.fn();
      autoZoomService.zoom([], map);
      expect(autoZoomService.triggeredZoom).toHaveBeenCalledTimes(1);
      expect(autoZoomService.zoomToBounds).toHaveBeenCalledTimes(1);
    });

    it('should not zoom when no zoom has been triggered', () => {
      autoZoomService.triggeredZoom = jest.fn().mockReturnValue({ triggeredZoom: false, bounds: {} });
      autoZoomService.zoomToBounds = jest.fn();
      autoZoomService.zoom([], map);
      expect(autoZoomService.triggeredZoom).toHaveBeenCalledTimes(1);
      expect(autoZoomService.zoomToBounds).toHaveBeenCalledTimes(0);
    });
  });

  describe('zoomToBounds', () => {
    let bounds: any;
    beforeEach(() => {
      bounds = { min: [1, 1], max: [2, 2] };
      map = { getWrapLongitude: () => 180, repaint: jest.fn(), viewGeoBounds: jest.fn() };
    });

    it('should call viewGeoBounds when not using a setTimeout call', async () => {
      await autoZoomService.zoomToBounds(map, false, bounds, true);
      expect(map.viewGeoBounds).toHaveBeenCalledTimes(1);
      expect(map.repaint).toHaveBeenCalledTimes(1);
    });
    it('should call viewGeoBounds when noAnime', async () => {
      await autoZoomService.zoomToBounds(map, false, bounds, false);
      expect(map.viewGeoBounds).toHaveBeenCalledTimes(1);
    });
    it('should call viewGeoBounds in a setTimeout call', async () => {
      await autoZoomService.zoomToBounds(map, true, bounds, true);
      expect(map.viewGeoBounds).toHaveBeenCalledTimes(1);
      expect(map.repaint).toHaveBeenCalledTimes(1);
    });

    it('should not call viewGeoBounds when bounds are undefined', async () => {
      await autoZoomService.zoomToBounds(map, true, undefined, false);
      expect(map.viewGeoBounds).toHaveBeenCalledTimes(0);
    });
  });

  describe('triggeredZoom', () => {
    beforeEach(() => {
      map = { getWrapLongitude: () => 180, repaint: () => {}, viewGeoBounds: () => {} };
    });

    it('should trigger zoom once when bounds exist', () => {
      const layers: any = [{ datasetModel: { getBounds: () => ({ max: [62, 15], min: [62, 10] }) } }];
      const triggered = autoZoomService.triggeredZoom(layers, map);
      expect(triggered).toEqual({ triggeredZoom: true, bounds: { max: [62, 15], min: [62, 10] } });

      const triggered2 = autoZoomService.triggeredZoom(layers, map);
      expect(triggered2).toEqual({ triggeredZoom: false, bounds: { max: [62, 15], min: [62, 10] } });

      const layers2: any = [{ datasetModel: { getBounds: () => ({ max: [2, 2], min: [1, 1] }) } }];
      const triggered3 = autoZoomService.triggeredZoom(layers2, map);
      expect(triggered3).toEqual({ triggeredZoom: true, bounds: { max: [2, 2], min: [1, 1] } });
    });
    it('should trigger zoom once when bounds are null', () => {
      const layers: any = [{ datasetModel: { getBounds: () => null } }];
      const triggered = autoZoomService.triggeredZoom(layers, map);
      expect(triggered).toEqual({ triggeredZoom: true, bounds: null });
      const triggered2 = autoZoomService.triggeredZoom(layers, map);
      expect(triggered2).toEqual({ triggeredZoom: false, bounds: null });
    });

    it('should trigger zoom once when previousBounds are undefined but currentBounds are not', () => {
      const layers: any = [{ datasetModel: { getBounds: () => {} } }];
      const triggered = autoZoomService.triggeredZoom(layers, map);
      expect(triggered).toEqual({ triggeredZoom: true, bounds: null });
      const layers2: any = [{ datasetModel: { getBounds: () => ({ max: [62, 15], min: [62, 10] }) } }];
      const triggered2 = autoZoomService.triggeredZoom(layers2, map);
      expect(triggered2).toEqual({ triggeredZoom: true, bounds: { max: [62, 15], min: [62, 10] } });
    });
  });
});
