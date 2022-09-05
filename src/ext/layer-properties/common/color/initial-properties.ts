import LayerType from '../../../../utils/const/layer-type';

export default function getColorProperties(type: LayerTypeName) {
  return {
    color: {
      auto: !(type === LayerType.POINT),
      mode: 'primary',
      paletteColor: { index: 6, color: '#4477aa' },
    },
  };
}
