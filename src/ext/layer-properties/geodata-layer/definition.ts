import LayerType from '../../../utils/const/layer-type';
import getOptionsDefinition from '../common/options/definition';
import getFormatsDefinition from './formats/definition';

export default function geodataLayerDefinition({ translator }: EnvironmentType) {
  return {
    schemaIgnore: true,
    translation: 'geo.GeodataLayer',
    component: 'accordion',
    cacheKey: 'GeodataLayer',
    title: function (layerProperties: GeodataLayerProperties) {
      return layerProperties.title !== '' ? layerProperties.title : translator.get('geo.dropmenu.noName');
    },
    type: 'items',
    items: {
      general: { show: false },
      metadata: { show: false },
      data: getFormatsDefinition(),
      options: getOptionsDefinition(LayerType.GEODATA),
    },
  };
}
