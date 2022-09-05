import MapUtils from '../map';
import webmapMock from '../../mocks/webmap';

describe('MapUtils', () => {
  let map: idevio.map.WebMap;
  beforeEach(() => {
    map = new webmapMock.idevio.map.WebMap();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerMap/unregisterMap', () => {
    it('should register and unregister map', () => {
      expect(MapUtils.maps.length).toBe(0);
      MapUtils.registerMap('cId', map);
      expect(MapUtils.maps.length).toBe(1);
      expect(MapUtils.maps[0].id).toBe('cId');
      MapUtils.unregisterMap('foobar');
      expect(MapUtils.maps.length).toBe(1);
      MapUtils.unregisterMap('cId');
      expect(MapUtils.maps.length).toBe(0);
    });
  });

  describe('getMap', () => {
    it('should return map', () => {
      expect(MapUtils.maps.length).toBe(0);
      MapUtils.registerMap('cId', map);
      const result = MapUtils.getMap('cId');
      expect(result).toEqual(map);
      MapUtils.unregisterMap('cId');
    });

    it('should throw error when not able to find map', () => {
      expect(MapUtils.maps.length).toBe(0);
      expect(() => {
        MapUtils.getMap('foobar');
      }).toThrow(TypeError);
    });
  });

  describe('setLanguage', () => {
    let webmap: any;
    let layer: any;
    let localLayer: any;
    beforeEach(() => {
      layer = {
        isBaseLayer: jest.fn().mockReturnValue(true),
        getName: jest.fn().mockReturnValue('FoobarEng'),
        setVisible: jest.fn(),
      };
      localLayer = {
        setVisible: jest.fn(),
      };
      webmap = {
        getLayerCount: jest.fn().mockReturnValue(2),
        getLayer: jest.fn().mockImplementation((name: string) => {
          return name === 'Foobar' ? localLayer : layer;
        }),
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('show layer when language is english', () => {
      MapUtils.setLanguage('english', webmap);
      expect(webmap.getLayerCount).toHaveBeenCalled();
      expect(layer.setVisible).toHaveBeenCalledWith(true);
      expect(localLayer.setVisible).toHaveBeenCalledWith(false);
    });

    it('show local layer when the name is PointsEng and language is auto', () => {
      layer.getName = jest.fn().mockReturnValue('PointsEng');
      webmap.getLayer = jest.fn().mockImplementation((name: string) => {
        return name === 'Points' ? localLayer : layer;
      });
      MapUtils.setLanguage('auto', webmap);
      expect(webmap.getLayerCount).toHaveBeenCalled();
      expect(layer.setVisible).toHaveBeenCalledWith(false);
      expect(localLayer.setVisible).toHaveBeenCalledWith(true);
    });

    it('do not set visibility when there is no corresponding layer', () => {
      webmap.getLayer = jest.fn().mockImplementation((name: string) => {
        return name === 'Foobar' ? undefined : layer;
      });
      MapUtils.setLanguage('auto', webmap);
      expect(webmap.getLayerCount).toHaveBeenCalled();
      expect(layer.setVisible).not.toHaveBeenCalled();
      expect(localLayer.setVisible).not.toHaveBeenCalled();
    });
  });
});
