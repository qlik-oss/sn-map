import { BaseMapPropertiesModel } from '../../../models/base-map-properties-model';
import LanguageUtils from '../../../utils/language';

describe('base map property model', () => {
  let translator: TranslatorType;
  let baseMapPropertiesModel: BaseMapPropertiesModelInterface;
  let availableBaseMaps: string[];
  const baseMapName1 = 'basemapName1';
  const baseMapName2 = 'basemapName2';
  const baseMapName3 = 'empty';
  const baseMapName4 = 'emptymeters';
  const baseMapName5 = 'emptydegreemercator';
  const baseMapProjection1 = 'projection1';
  const baseMapProjection2 = 'projection2';

  beforeEach(() => {
    translator = jest.fn() as any;
    availableBaseMaps = [`${baseMapName1}_${baseMapProjection1}`, `${baseMapName2}_${baseMapProjection2}`];
    baseMapPropertiesModel = new BaseMapPropertiesModel(translator);
    baseMapPropertiesModel.getAvailableMaps = jest.fn().mockReturnValue(availableBaseMaps);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('parseMapName', () => {
    it('should return valid basemap name and projection', () => {
      const mapName1 = baseMapPropertiesModel.parseMapName(availableBaseMaps[0]);
      expect(mapName1.name).toEqual(baseMapName1);
      expect(mapName1.projection).toEqual(baseMapProjection1);
      const mapName2 = baseMapPropertiesModel.parseMapName(availableBaseMaps[1]);
      expect(mapName2.name).toEqual(baseMapName2);
      expect(mapName2.projection).toEqual(baseMapProjection2);
    });

    it('should return valid name when there is only only name projection', () => {
      const mapName3 = baseMapPropertiesModel.parseMapName(baseMapName3);
      expect(mapName3.name).toEqual('empty');
      expect(mapName3.projection).toEqual('WGS-84');
      const mapName4 = baseMapPropertiesModel.parseMapName(baseMapName4);
      expect(mapName4.name).toEqual('empty');
      expect(mapName4.projection).toEqual('undefined meters');
      const mapName5 = baseMapPropertiesModel.parseMapName(baseMapName5);
      expect(mapName5.name).toEqual('empty');
      expect(mapName5.projection).toEqual('mercator');
    });

    it('should return default values when value is invalid format', () => {
      const mapName1 = baseMapPropertiesModel.parseMapName('');
      expect(mapName1.name).toEqual('');
      expect(mapName1.projection).toEqual('mercator');
    });
  });

  describe('getBasemaps', () => {
    it('should return the available maps when current map is not given', () => {
      const baseMaps = baseMapPropertiesModel.getBasemaps();
      expect(baseMaps.size).toEqual(2);
    });
    it('should return the available maps when current map is part of the list', () => {
      const baseMaps = baseMapPropertiesModel.getBasemaps(`${baseMapName1}_${baseMapProjection1}`);
      expect(baseMaps.size).toEqual(2);
    });
    it('should return the available maps with the current map added if the map is not part of the list', () => {
      const baseMapName3 = 'baseMapName3';
      const baseMapProjection3 = 'baseMapProjection3';
      const baseMaps = baseMapPropertiesModel.getBasemaps(`${baseMapName3}_${baseMapProjection3}`);
      expect(baseMaps.size).toEqual(3);
    });
    it('should return the available maps with the current map added if the map is empty or special case', () => {
      const baseMaps = baseMapPropertiesModel.getBasemaps(baseMapName3);
      expect(baseMaps.size).toEqual(3);
      const baseMaps2 = baseMapPropertiesModel.getBasemaps(baseMapName4);
      expect(baseMaps2.size).toEqual(3);
      const baseMaps3 = baseMapPropertiesModel.getBasemaps(baseMapName5);
      expect(baseMaps3.size).toEqual(3);
    });

    it('should reorder the basemaps', () => {
      const loadedMaps = ['dark', 'empty', 'pale', 'default'];
      baseMapPropertiesModel.getAvailableMaps = jest.fn().mockReturnValue(loadedMaps);
      const baseMaps = baseMapPropertiesModel.getBasemaps();
      expect(baseMaps.size).toEqual(4);
      const orderedBaseMaps: string[] = [];
      baseMaps.forEach((bm) => {
        orderedBaseMaps.push(bm.name);
      });
      expect(orderedBaseMaps).toEqual(['default', 'pale', 'dark', 'empty']);
    });
  });

  describe('getDefaultProjection', () => {
    it('should return the correct full base map when base map name exists', () => {
      const projection = baseMapPropertiesModel.getDefaultProjection(
        baseMapName1,
        `${baseMapName1}_${baseMapProjection1}`
      );
      expect(projection).toEqual(`${baseMapName1}_${baseMapProjection1}`);
    });
    it('should return the default base map when base map name does not exists', () => {
      const baseMapName3 = 'baseMapName3';
      const projection = baseMapPropertiesModel.getDefaultProjection(
        baseMapName3,
        `${baseMapName3}_${baseMapProjection1}`
      );
      expect(projection).toEqual(`${baseMapName3}_${baseMapProjection1}`);
    });
    it('should return undefined when base map name and projection', () => {
      const baseMapName3 = 'baseMapName3';
      const projection = baseMapPropertiesModel.getDefaultProjection(
        baseMapName3,
        `${baseMapName1}_${baseMapProjection1}`
      );
      expect(projection).toBeUndefined();
    });
  });

  describe('getAvailableBaseMapAndProjections', () => {
    it('should return correct format of available baseMap and projection', () => {
      const layout = {
        projection: '',
        baseMap: '',
      } as any;
      LanguageUtils.getGeoTranslation = jest.fn().mockReturnValue('translation');
      const options = baseMapPropertiesModel.getAvailableBaseMapAndProjections(layout);
      expect(options.length).toBe(1);
      expect(options[0]).toHaveProperty('label');
      expect(options[0]).toHaveProperty('value');
    });
  });
});
