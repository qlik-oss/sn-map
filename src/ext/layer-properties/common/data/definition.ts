import LayerType from '../../../../utils/const/layer-type';
import DefaultFields from '../../../utils/default-fields';
import DataUtils from './utils';

export default function getDataDefinition(
  maxDimensions: number,
  maxMeasures: number = 0,
  { translator }: EnvironmentType
) {
  const helpText = {
    component: 'text',
    translation: 'geo.properties.dimension.hint',
    style: 'hint', // "sHeader", "message"
    show: function (props: LayerProperties) {
      return props.qHyperCubeDef.qDimensions.length === 0;
    },
  };
  const data = {
    uses: 'data',
    translation: 'Common.Dimensions',
    dimension: {
      min: 1,
      max: maxDimensions,
      description: function (properties: LayerProperties) {
        switch (properties.type) {
          case LayerType.AREA: {
            return translator.get('Visualizations.Descriptions.Area');
          }
          case LayerType.POINT: {
            return translator.get('Visualizations.Descriptions.Point');
          }
          default:
            return '';
        }
      },
      add: function (dimension: NxDimension, properties: LayerProperties) {
        // We want to control the sort criterias
        dimension.qDef.qSortCriterias[0]['qSortByLoadOrder'] = 1;
        dimension.qDef.qSortCriterias[0]['qSortByAscii'] = 1;
        dimension.qDef.qSortCriterias[0]['qSortByNumeric'] = 1;

        DefaultFields.setLocation(dimension, properties);
        DataUtils.updateAttributeExpressions(properties);
      },
      remove: function (_dimension: any, properties: LayerProperties) {
        // clear default location if set
        if (properties.locationOrLatitude.key === properties.locationDefault) {
          properties.locationOrLatitude.key = '';
          properties.locationOrLatitude.label = '';
          properties.locationOrLatitude.type = '';
        }
      },
    },
    measure: {
      min: 0,
      max: maxMeasures,
      show: true,
    },
    items: {
      dimensions: { disabledRef: '' },
      measures: { disabledRef: '' },
    },
  };
  return {
    component: 'items',
    translation: 'Common.Data',
    items: {
      helpText,
      data,
    },
  };
}
