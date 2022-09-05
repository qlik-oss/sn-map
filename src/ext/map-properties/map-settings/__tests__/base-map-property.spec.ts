import baseMapProperty from '../base-map-property';
import { BaseMapPropertiesModel } from '../../../models/base-map-properties-model';
import mockProperties from '../../../../mocks/properties';
import env from '../../../../mocks/environment';
import LanguageUtils from '../../../utils/language';

jest.mock('../../../utils/language');

describe('base map property', () => {
  let baseMapPropertiesModel: BaseMapPropertiesModelInterface;
  let properties: MapProperties;
  let availableBaseMaps: string[];

  beforeEach(() => {
    availableBaseMaps = ['', ''];
    baseMapPropertiesModel = new BaseMapPropertiesModel(env.translator);
    baseMapPropertiesModel.getBasemaps = jest.fn().mockReturnValue(availableBaseMaps);
    baseMapPropertiesModel.getDefaultProjection = jest.fn();
    properties = mockProperties.map;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return valid basemap property', () => {
    const property = baseMapProperty(baseMapPropertiesModel);
    expect(property.ref).toEqual('mapSettings.baseMap');
    expect(property).toHaveProperty('change');
    expect(property).toHaveProperty('options');
    property.change(properties);
    expect(baseMapPropertiesModel.getDefaultProjection).toHaveBeenCalledTimes(1);
    property.options(properties, { rootPath: '' });
    expect(baseMapPropertiesModel.getBasemaps).toHaveBeenCalledTimes(1);
    expect(LanguageUtils.getGeoTranslation).toHaveBeenCalledTimes(availableBaseMaps.length);
  });
});
