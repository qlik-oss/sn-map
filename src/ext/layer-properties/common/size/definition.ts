import LayerType from '../../../../utils/const/layer-type';
import numberFormatProperties from '../../../utils/number-format-properties';
import ExpressionFields from '../../../utils/expression-fields';
import { setAttributeExpression } from '../../../utils/attribute-expression-utils';
import { getValue } from 'qlik-chart-modules';

const getSizeLayout = (translator: TranslatorType) => ({
  sizeExpression: function (type: string) {
    let translation;
    switch (type) {
      default:
        translation = 'geo.properties.size';
        break;
    }
    return {
      numFormatRef: 'size.formatting',
      ref: 'size.expression',
      label: translator.get(translation),
      type: 'object',
      component: 'color-by-dropdown',
      schemaIgnore: true,
      defaultValue: {},
      libraryItemType: 'measure',
      change: function (props: PointLayerProperties) {
        // Do not remove, component throws if not available
        const expr = getValue(props, 'size.expression');
        ExpressionFields.setLibraryMeasureWorkaround(props, expr);
        setAttributeExpression(props, 'size.expression', 'size', true, 0);
      },
    };
  },
  sizeFormatting: function () {
    return numberFormatProperties.getNumberFormattingPropertiesWithMasterLink(
      'size.formatting',
      (data: LayerProperties) => data?.size?.expression?.key?.length > 0,
      (data: LayerProperties) => data?.size?.expression?.type === 'libraryItem'
    );
  },
  sizeExpressionLabel: function () {
    return {
      ref: 'size.label',
      translation: 'Common.Label',
      type: 'string',
      expression: 'optional',
      expressionType: 'StringExpression',
      defaultValue: '',
      show: function (props: PointLayerProperties) {
        return !(
          props.size.expression?.key === undefined ||
          props.size.expression?.key === '' ||
          props.size.expression?.type === 'libraryItem'
        );
      },
    };
  },
  sizeSliderRange: function (type: string, min: number, max: number, defaultValue: number[]) {
    return {
      ref: 'size.sliderRangeValues',
      label: function (props: LayerProperties) {
        let shape = '';
        let translation = '';
        switch (props.size.shape) {
          default:
            shape = 'Bubble';
            break;
        }
        switch (type) {
          case LayerType.POINT:
          default:
            translation = `geo.properties.sizeRange${shape}`;
        }
        return translator.get(translation);
      },
      type: 'array',
      component: 'slider',
      min: min,
      max: max,
      step: 1,
      defaultValue: defaultValue,
      show: function (props: PointLayerProperties) {
        return props.size.expression && props.size.expression.key?.length > 0;
      },
    };
  },
  sizeSliderSingle: function (type: LayerTypeName, min: number, max: number, defaultValue: number) {
    return {
      ref: 'size.sliderSingleValue',
      label: (props: LayerProperties) => {
        let shape = '';
        let translation = '';
        switch (props.size.shape) {
          case 'points':
          default:
            shape = 'Bubble';
            break;
        }
        switch (type) {
          case LayerType.POINT:
          default:
            translation = `geo.properties.sizeSingle${shape}`;
        }
        return translator.get(translation);
      },
      type: 'number',
      component: 'slider',
      min,
      max, // lower max size when single slider
      step: 1,
      defaultValue,
      show: function (props: PointLayerProperties) {
        return !(props.size.expression && props.size.expression?.key?.length > 0);
      },
    };
  },
  autoRadiusValueRange: function () {
    return {
      ref: 'size.autoRadiusValueRange',
      translation: 'properties.axis.range',
      type: 'boolean',
      component: 'switch',
      defaultValue: true,
      options: [
        { value: true, translation: 'Common.Auto' },
        { value: false, translation: 'Common.Custom' },
      ],
      show: function (props: PointLayerProperties) {
        return props.size.expression && props.size.expression?.key?.length > 0;
      },
    };
  },
  customMinRangeValue: function (type: string) {
    let translation = '';
    switch (type) {
      default:
        translation = 'geo.properties.radius.min';
        break;
    }
    return {
      ref: 'size.customMinRangeValue',
      translation: translation,
      expression: 'optional',
      type: 'number',
      defaultValue: 0,
      show: function (props: PointLayerProperties) {
        return !props.size.autoRadiusValueRange && props.size.expression && props.size.expression?.key?.length > 0;
      },
    };
  },
  customMaxRangeValue: function (type: string) {
    let translation = '';
    switch (type) {
      default:
        translation = 'geo.properties.radius.max';
        break;
    }
    return {
      ref: 'size.customMaxRangeValue',
      translation: translation,
      expression: 'optional',
      type: 'number',
      defaultValue: 0,
      show: function (props: PointLayerProperties) {
        return !props.size.autoRadiusValueRange && props.size.expression && props.size.expression?.key?.length > 0;
      },
    };
  },
});

export default (type: LayerTypeName, { translator }: EnvironmentType) => {
  const sizeLayout = getSizeLayout(translator);
  let translation = '';
  let items;

  switch (type) {
    case LayerType.POINT:
    default:
      translation = 'geo.properties.sizeShape';
      items = {
        sizeExpression: sizeLayout.sizeExpression(LayerType.POINT),
        sizeFormatting: sizeLayout.sizeFormatting(),
        sizeExpressionLabel: sizeLayout.sizeExpressionLabel(),
        sizeSliderRange: sizeLayout.sizeSliderRange(LayerType.POINT, 1, 100, [4, 12]),
        sizeSliderSingle: sizeLayout.sizeSliderSingle(LayerType.POINT, 1, 50, 8),
        autoRadiusValueRange: sizeLayout.autoRadiusValueRange(),
        customMinRangeValue: sizeLayout.customMinRangeValue(LayerType.POINT),
        customMaxRangeValue: sizeLayout.customMaxRangeValue(LayerType.POINT),
      };
  }
  return {
    component: 'items',
    translation,
    items,
  };
};
