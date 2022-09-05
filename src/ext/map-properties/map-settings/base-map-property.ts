import Utils from '../../../utils/general';
import LanguageUtils from '../../utils/language';
import { getValue } from 'qlik-chart-modules';

enum BaseMapImages {
  default = '/static/bg_default.png',
  tiledraster = '/static/bg_default.png',
  satellite = '/static/bg_satellite.png',
  empty = '/static/bg_none.png',
  plain = '/static/bg_plain.png',
  pale = '/static/bg_pale.png',
  dark = '/static/bg_dark.png',
  invalid = '/static/bg_none.png',
}

const getBaseMapOptions = (
  properties: MapProperties,
  rootPath: string,
  baseMapPropertiesModel: BaseMapPropertiesModelInterface
) => {
  const current = getValue(properties, 'mapSettings.projection');
  const baseMaps: Map<string, BaseMapInfo> = baseMapPropertiesModel.getBasemaps(current);
  const translator = baseMapPropertiesModel.translator;

  const options: ImageOption[] = [];
  baseMaps.forEach((bm) => {
    const image: string = (BaseMapImages as any)[bm.name] ?? BaseMapImages.invalid;
    const src = `${Utils.getPathToResources(properties.visualization, rootPath)}${image}`;
    const option = {
      value: bm.name,
      label: LanguageUtils.getGeoTranslation(bm.name, 'basemap', translator),
      src,
    };
    options.push(option);
  });

  return options;
};

export default (baseMapPropertiesModel: BaseMapPropertiesModelInterface) => ({
  ref: 'mapSettings.baseMap',
  type: 'string',
  component: 'options-list',
  translation: 'geo.properties.basemap',
  defaultValue: 'default',
  change: function (properties: MapProperties) {
    properties.mapSettings.projection = baseMapPropertiesModel.getDefaultProjection(
      properties.mapSettings.baseMap,
      properties.mapSettings.projection
    );
    properties.mapSettings.mapLanguage = 'auto';
  },
  labelDisclaimer: '',
  showValue: true,
  valueTranslation: 'geo.properties.basemap',
  entryComponentDefinition: {
    type: 'string',
    component: 'image-item',
    itemBorder: true,
    itemInteractive: true,
    width: '229px',
    height: '103px',
  },
  title: 'geo.properties.basemap',
  optionsLabel: 'geo.properties.basemapOptions',
  optionsRadius: 3,
  optionsSpacing: 12,
  options: (properties: MapProperties, parameters: OptionsListParameters) =>
    getBaseMapOptions(properties, parameters.rootPath, baseMapPropertiesModel),
});
