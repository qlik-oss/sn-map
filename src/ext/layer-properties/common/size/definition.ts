import LayerType from '../../../../utils/const/layer-type';

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
        sizeSingleSlider: sizeLayout.sizeSingleSlider(LayerType.POINT, 1, 50, 8),
      };
  }
  return {
    component: 'items',
    translation,
    items,
  };
};
