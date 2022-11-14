import LayerType from '../../../../utils/const/layer-type';

export default function getSizeProperties(type: LayerTypeName) {
  function exprProp(): ExpressionProp {
    return { key: '', label: '', type: '' };
  }

  let initialValues;
  switch (type) {
    case LayerType.POINT:
    default:
      initialValues = {
        size: {
          radiusMin: 4,
          radiusMax: 12,
          slider: [8, 24],
          sliderSingle: 16,
          radiusValueMin: 0,
          radiusValueMax: 1,
          expression: exprProp(),
          autoRadiusValueRange: true,
          shape: 'points',
          label: '',
          formatting: {
            qNumFormat: { qType: 'U' },
          },
        },
      };
  }
  return initialValues;
}
