import { getValue } from 'qlik-chart-modules';
import getColorDefinition from '../common/color/definition';
import getDataDefinition from '../common/data/definition';
import getLocationDefinition from '../common/location/definition';
import getSizeDefinition from '../common/size/definition';
import Util from '../../utils/layers';

export default function pointLayerDefinition({ translator }: EnvironmentType) {
  return {
    schemaIgnore: true,
    translation: 'geo.PointLayer',
    component: 'accordion',
    cacheKey: 'PointLayer',
    title: function (properties: PointLayerProperties, handler: Object) {
      const qDimensions = getValue(properties, 'qHyperCubeDef.qDimensions');
      return Util.getLayerTitle(qDimensions, handler) || translator.get('geo.dropmenu.noName');
    },
    type: 'items',
    items: {
      general: { show: false },
      metadata: { show: false },
      data: getDataDefinition(1, 0, { translator }),
      location: getLocationDefinition(translator, 'PointLayer'),
      size: getSizeDefinition('PointLayer', { translator }),
      color: getColorDefinition(),
    },
  };
}
