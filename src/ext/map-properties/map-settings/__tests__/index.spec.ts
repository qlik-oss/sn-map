import mapSettings from '../index';
import env from '../../../../mocks/environment';
import LanguageUtils from '../../../utils/language';
import MapUtils from '../../../../utils/map';
import { BaseMapPropertiesModel } from '../../../models/base-map-properties-model';
import mockLayout from '../../../../mocks/layout';

jest.mock('../base-map-property');
jest.mock('../../../models/base-map-properties-model');
jest.mock('../../../utils/language');
jest.mock('../../../../utils/map');

describe('Map settings', () => {
  let settings: any;
  let layout: LayerLayout;

  beforeEach(() => {
    settings = mapSettings(env);
    layout = JSON.parse(JSON.stringify(mockLayout.map));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Construction', () => {
    it('should return valid map-settings', () => {
      expect(settings).toHaveProperty('translation');
      expect(settings.items).toHaveProperty('properties');
      expect(settings.items.properties.items).toHaveProperty('baseMap');
      expect(settings.items.properties.items).toHaveProperty('projection');
      expect(settings.items.properties.items).toHaveProperty('mapLanguage');
      expect(settings.items.properties.items).toHaveProperty('useImperialUnits');
      expect(settings.items.properties.items).toHaveProperty('selectionType');
      expect(BaseMapPropertiesModel).toHaveBeenCalledTimes(1);
    });
  });

  describe('projection', () => {
    describe('change', () => {
      it('should set language on change', () => {
        settings.items.properties.items.projection.change(layout);
        expect(MapUtils.getMap).toHaveBeenCalledTimes(1);
        expect(MapUtils.setLanguage).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('mapLanguage', () => {
    describe('change', () => {
      it('should set language on change', () => {
        settings.items.properties.items.mapLanguage.change(layout);
        expect(MapUtils.getMap).toHaveBeenCalledTimes(1);
        expect(MapUtils.setLanguage).toHaveBeenCalledTimes(1);
      });
    });

    describe('options', () => {
      it('should return available languages when no error', () => {
        settings.items.properties.items.mapLanguage.options(layout);
        expect(MapUtils.getMap).toHaveBeenCalledTimes(1);
        expect(LanguageUtils.getAvailableLanguages).toHaveBeenCalledTimes(1);
        expect(LanguageUtils.getDefaultAvailableLanguages).toHaveBeenCalledTimes(0);
      });

      it('should return default languages when there is an error', () => {
        const error = () => {
          throw new TypeError();
        };
        LanguageUtils.getAvailableLanguages = jest.fn().mockImplementation(error);
        settings.items.properties.items.mapLanguage.options(layout);
        expect(MapUtils.getMap).toHaveBeenCalledTimes(1);
        expect(LanguageUtils.getDefaultAvailableLanguages).toHaveBeenCalledTimes(1);
      });
    });
  });
});
