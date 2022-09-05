import LayerType from '../../../../utils/const/layer-type';

export default function getOptionsProperties(type: LayerTypeName) {
  let initialValues;
  switch (type) {
    case LayerType.GEODATA:
      initialValues = {
        appearance: {
          opacity: 1.0,
        },
      };
      break;
  }
  return initialValues;
}
