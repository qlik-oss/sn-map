import { BaseMapModel } from '..';
import webmapMock from '../../../../../mocks/webmap';
import layoutMock from '../../../../../mocks/layout';
import MapUtils from '../../../../../utils/map';

jest.mock('../../../../../utils/map');

describe('base map property model', () => {
  let baseMapModel: BaseMapModelInterface;
  let loadedMaps: string[];
  let map: idevio.map.WebMap;
  let settings: MapSettings;
  const baseMapName1 = 'basemapName1';
  const baseMapProjection1 = 'projection1';

  beforeEach(() => {
    global.idevio = webmapMock.idevio;
    loadedMaps = [`${baseMapName1}_${baseMapProjection1}`];
    idevio.map.WebMap.getLoadedBaseMaps = jest.fn().mockReturnValue(loadedMaps);
    map = new webmapMock.idevio.map.WebMap();
    baseMapModel = new BaseMapModel(map);
    settings = JSON.parse(JSON.stringify(layoutMock.map)).mapSettings;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('update', () => {
    it('should call necessary functions', () => {
      baseMapModel.getBaseMapOrEmpty = jest.fn().mockReturnValue('foobar');
      baseMapModel.updateBaseMap = jest.fn();
      baseMapModel.updateCrs = jest.fn();
      MapUtils.setLanguage = jest.fn();
      baseMapModel.update(settings);

      expect(baseMapModel.getBaseMapOrEmpty).toHaveBeenCalled();
      expect(baseMapModel.updateBaseMap).toHaveBeenCalledWith('foobar');
      expect(baseMapModel.updateCrs).toHaveBeenCalled();
      expect(MapUtils.setLanguage).toHaveBeenCalled();
      expect(map.repaint).toHaveBeenCalled();
    });

    it('should skip when basemap is the same', () => {
      map.getBaseMap = jest.fn().mockReturnValue('foobar');
      baseMapModel.getBaseMapOrEmpty = jest.fn().mockReturnValue('foobar');
      baseMapModel.updateBaseMap = jest.fn();
      baseMapModel.updateCrs = jest.fn();
      baseMapModel.update(settings);

      expect(baseMapModel.getBaseMapOrEmpty).toHaveBeenCalled();
      expect(baseMapModel.updateBaseMap).not.toHaveBeenCalled();
      expect(baseMapModel.updateCrs).not.toHaveBeenCalled();
      expect(map.repaint).not.toHaveBeenCalled();
    });
  });

  describe('updateCrs', () => {
    it('should set crs to UndefinedMeters when emptymeters', () => {
      expect(baseMapModel.crs).toBe('EPSG:4326');
      baseMapModel.updateCrs('emptymeters');
      expect(baseMapModel.crs).toBe('UndefinedMeters');
      baseMapModel.updateCrs('foobar');
      expect(baseMapModel.crs).toBe('EPSG:4326');
    });
  });

  describe('updateBaseMap', () => {
    it('should set base map and update necessary map properties', () => {
      baseMapModel.setStyle = jest.fn();
      baseMapModel.updateBaseMap('empty');

      expect(map.setBaseMap).toHaveBeenCalledWith('empty');
      expect(baseMapModel.setStyle).toHaveBeenCalled();
      expect(map.setCenter).toHaveBeenCalled();
      expect(map.setResolution).toHaveBeenCalled();
    });
  });

  describe('setStyle', () => {
    it('should set map style when basemap equals empty', () => {
      baseMapModel.setStyle('empty');
      expect(map.setStyle).toHaveBeenCalledWith({ background: 'transparent' });
    });

    it('should not set map style', () => {
      baseMapModel.setStyle('foobar');
      expect(map.setStyle).not.toHaveBeenCalled();
    });
  });

  describe('getBaseMapOrEmpty', () => {
    it('should return the basemap empty if the value given does not exist', () => {
      baseMapModel.getAvailableMaps = jest.fn().mockReturnValue([]);
      const baseMaps = baseMapModel.getBaseMapOrEmpty('invalid');
      expect(baseMaps).toEqual('empty');
    });
    it('should return the basemap if the value given does exist', () => {
      baseMapModel.getAvailableMaps = jest.fn().mockReturnValue([`${baseMapName1}_${baseMapProjection1}`]);
      const baseMaps = baseMapModel.getBaseMapOrEmpty(`${baseMapName1}_${baseMapProjection1}`);
      expect(baseMaps).toEqual(`${baseMapName1}_${baseMapProjection1}`);
    });
  });
});
