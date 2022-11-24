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
          sliderRangeValues: [8, 24],
          sliderSingleValue: 16,
          customMinRangeValue: 0,
          customMaxRangeValue: 1,
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
