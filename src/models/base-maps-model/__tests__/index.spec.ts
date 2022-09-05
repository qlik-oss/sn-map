import { CoreBaseMapsModel } from '..';
import webmapMock from '../../../mocks/webmap';

describe('Core basemaps model', () => {
  let coreBaseMapModel: CoreBaseMapsModel;

  beforeEach(() => {
    coreBaseMapModel = new CoreBaseMapsModel();
    coreBaseMapModel.availableMaps = [];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateAvailableMaps', () => {
    it('should set availableMaps', () => {
      coreBaseMapModel.getServerBaseMaps = jest.fn().mockReturnValue(['foobar']);
      coreBaseMapModel.setAvailableMaps = jest.fn();
      coreBaseMapModel.updateAvailableMaps();
      expect(coreBaseMapModel.getServerBaseMaps).toHaveBeenCalledTimes(1);
      expect(coreBaseMapModel.setAvailableMaps).toHaveBeenCalledTimes(1);
    });
    it('should not set availableMaps when no basemaps from server', () => {
      coreBaseMapModel.getServerBaseMaps = jest.fn().mockReturnValue(undefined);
      coreBaseMapModel.setAvailableMaps = jest.fn();
      coreBaseMapModel.updateAvailableMaps();
      expect(coreBaseMapModel.getServerBaseMaps).toHaveBeenCalledTimes(1);
      expect(coreBaseMapModel.setAvailableMaps).toHaveBeenCalledTimes(0);
    });
    it('should skip when available maps is already set', () => {
      coreBaseMapModel.availableMaps = ['foobar'];
      coreBaseMapModel.getServerBaseMaps = jest.fn().mockReturnValue(['foo']);
      coreBaseMapModel.setAvailableMaps = jest.fn();
      coreBaseMapModel.updateAvailableMaps();
      expect(coreBaseMapModel.getServerBaseMaps).toHaveBeenCalledTimes(0);
      expect(coreBaseMapModel.setAvailableMaps).toHaveBeenCalledTimes(0);
    });
  });

  describe('setAvailableMaps', () => {
    it('should set available maps', () => {
      expect(coreBaseMapModel.availableMaps).toEqual([]);
      coreBaseMapModel.setAvailableMaps(['foobar']);
      expect(coreBaseMapModel.availableMaps).toEqual(['foobar']);
    });
  });

  describe('getAvailableMaps', () => {
    it('should update and return available maps', () => {
      coreBaseMapModel.availableMaps = ['foobar'];
      coreBaseMapModel.updateAvailableMaps = jest.fn();
      const maps = coreBaseMapModel.getAvailableMaps();
      expect(maps).toEqual(['foobar']);
      expect(coreBaseMapModel.updateAvailableMaps).toHaveBeenCalledTimes(1);
    });
  });

  describe('getServerBaseMaps', () => {
    let loadedMaps: string[];
    const baseMapName1 = 'basemapName1';
    const baseMapProjection1 = 'projection1';

    beforeEach(() => {
      global.idevio = webmapMock.idevio;
      loadedMaps = [`${baseMapName1}_${baseMapProjection1}`];
      idevio.map.WebMap.getLoadedBaseMaps = jest.fn().mockReturnValue(loadedMaps);
    });

    it('should get available base maps and populate with empty maps', () => {
      global.idevio.map.WebMap.getAvailableBaseMaps = jest.fn().mockImplementation((func: any) => {
        func(['foobar']);
      });
      const expected = ['empty', 'emptymeters', 'emptydegreemercator', 'foobar'];
      const maps = coreBaseMapModel.getServerBaseMaps();
      expect(maps?.length).toBe(4);
      expect(maps).toEqual(expected);
    });

    it('should get loaded base maps', () => {
      global.idevio.map.WebMap.getAvailableBaseMaps = jest.fn().mockImplementation((func: any) => {
        func([]);
      });
      const maps = coreBaseMapModel.getServerBaseMaps();
      expect(maps?.length).toBe(1);
      expect(maps).toEqual(loadedMaps);
    });

    it('should return undefined when no idevio.map.WebMap', () => {
      global.idevio = { map: { WebMap: undefined } } as any;
      const maps = coreBaseMapModel.getServerBaseMaps();
      expect(maps).toBeUndefined();
    });
  });
});
