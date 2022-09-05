import LayerType from '../../../../utils/const/layer-type';

export default function getSizeProperties(type: LayerTypeName) {
  let initialValues;
  switch (type) {
    case LayerType.POINT:
    default:
      initialValues = {
        size: {
          radiusMin: 4,
          radiusMax: 12,
          sliderSingle: 16,
        },
      };
  }
  return initialValues;
}
