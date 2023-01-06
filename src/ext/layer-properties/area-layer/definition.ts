import { getValue } from 'qlik-chart-modules';
import getColorDefinition from '../common/color/definition';
import getDataDefinition from '../common/data/definition';
import getLocationDefinition from '../common/location/definition';
import Util from '../../utils/layers';

export default function areaLayerDefinition({ translator }: EnvironmentType) {
  return {
    schemaIgnore: true,
    translation: 'geo.AreaLayer',
    component: 'accordion',
    cacheKey: 'AreaLayer',
    title: function (properties: AreaLayerProperties, handler: Object) {
      const qDimensions = getValue(properties, 'qHyperCubeDef.qDimensions');
      return Util.getLayerTitle(qDimensions, handler) || translator.get('geo.dropmenu.noName');
    },
    type: 'items',
    items: {
      general: { show: false },
      metadata: { show: false },
      data: getDataDefinition(1, 0, { translator }),
      location: getLocationDefinition(translator, 'AreaLayer'),
      color: getColorDefinition(),
    },
  };
}
