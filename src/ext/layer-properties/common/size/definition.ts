import LayerType from '../../../../utils/const/layer-type';
import numberFormatProperties from '../../../utils/number-format-properties';
import ExpressionFields from '../../../utils/expression-fields';
import { setAttributeExpression } from '../../../utils/attribute-expression-utils';
import { getValue } from 'qlik-chart-modules';

// Should only be used for max/min width/radius of bubble layer and line layer.
const getSizeFromSliderValue = (value: number) => {
  if (value < 20) {
    return Math.ceil(value / 2);
  } else if (value < 40) {
    return 10 + (value - 20);
  } else if (value < 60) {
    return 30 + (value - 40) * 2;
  } else {
    return 70 + (value - 60) * 4;
  }
};

const getSizeLayout = (translator: TranslatorType) => ({
  sizeField: function (type: string) {
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
      change: function (props: LayerProperties) {
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
  sizeFieldLabel: function () {
    return {
      ref: 'size.label',
      translation: 'Common.Label',
      type: 'string',
      expression: 'optional',
      expressionType: 'StringExpression',
      defaultValue: '',
      show: function (prop: LayerProperties) {
        return !(
          prop.size.expression.key === undefined ||
          prop.size.expression.key === '' ||
          prop.size.expression.type === 'libraryItem'
        );
      },
    };
  },
  sizeSlider: function (type: string, min: number, max: number, defaultValue: number[]) {
    return {
      ref: 'size.slider',
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
      change: function (props: PointLayerProperties) {
        props.size.radiusMin = getSizeFromSliderValue(props.size.slider[0]);
        props.size.radiusMax = getSizeFromSliderValue(props.size.slider[1]);
      },
      show: function (props: PointLayerProperties) {
        return props.size.expression.key?.length > 0;
      },
    };
  },
  sizeSingleSlider: function (type: LayerTypeName, min: number, max: number, defaultValue: number) {
    return {
      ref: 'size.sliderSingle',
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
      change: function (props: LayerProperties) {
        const val = getSizeFromSliderValue(props.size.sliderSingle);
        const d = Math.ceil(val / 2);
        props.size.radiusMin = val - d;
        props.size.radiusMax = val + d;
      },
      show: function (props: PointLayerProperties) {
        return !(props.size.expression.key?.length > 0);
      },
    };
  },
  sizeRange: function () {
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
        return props.size.expression.key?.length > 0;
      },
    };
  },
  minSizeValue: function (type: string) {
    let translation = '';
    switch (type) {
      default:
        translation = 'geo.properties.radius.min';
        break;
    }
    return {
      ref: 'size.radiusValueMin',
      translation: translation,
      expression: 'optional',
      type: 'number',
      defaultValue: 0,
      show: function (props: PointLayerProperties) {
        return !props.size.autoRadiusValueRange && props.size.expression.key?.length > 0;
      },
    };
  },
  maxSizeValue: function (type: string) {
    let translation = '';
    switch (type) {
      default:
        translation = 'geo.properties.radius.max';
        break;
    }
    return {
      ref: 'size.radiusValueMax',
      translation: translation,
      expression: 'optional',
      type: 'number',
      defaultValue: 0,
      show: function (props: PointLayerProperties) {
        return !props.size.autoRadiusValueRange && props.size.expression.key?.length > 0;
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
        sizeField: sizeLayout.sizeField(LayerType.POINT),
        sizeFormatting: sizeLayout.sizeFormatting(),
        sizeFieldLabel: sizeLayout.sizeFieldLabel(),
        sizeSlider: sizeLayout.sizeSlider(LayerType.POINT, 1, 100, [4, 12]),
        sizeSingleSlider: sizeLayout.sizeSingleSlider(LayerType.POINT, 1, 50, 8),
        sizeRange: sizeLayout.sizeRange(),
        minSizeValue: sizeLayout.minSizeValue(LayerType.POINT),
        maxSizeValue: sizeLayout.maxSizeValue(LayerType.POINT),
      };
  }
  return {
    component: 'items',
    translation,
    items,
  };
};
