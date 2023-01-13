import LayerType from '../../../../utils/const/layer-type';
import getComponents from './components';

export default function locationDefinition(translator: TranslatorType, type: string) {
  const components = getComponents(translator);
  const basicLocationItems = (ref: string) => {
    return {
      useLatLongCheckbox: components.useLatLongCheckbox(ref),
      location: components.location(ref),
      locationText: components.locationText(ref),
      latLongText: components.latLongText(ref),
      longitude: components.longitude(ref),
      useLocationNamesSwitch: components.useLocationNamesSwitch(ref),
      locationType: components.locationType(ref),
      country: components.country(ref),
      locationNameCountryInstruction: components.locationNameCountryInstruction(ref),
      admin1: components.admin1(ref),
      locationNameAdmin1Instruction: components.locationNameAdmin1Instruction(ref),
      admin2: components.admin2(ref),
    };
  };
  let items = {};

  switch (type) {
    case LayerType.POINT:
      items = basicLocationItems('');
      break;
    case LayerType.LINE:
      items = {
        path: {
          type: 'items',
          translation: 'geo.properties.path',
          grouped: true,
          items: {
            startEndPoint: components.startEndPoint('path.startEndPoint'),
            pathField: components.pathField('path.field'),
          },
        },
        location: {
          type: 'items',
          translation: 'geo.properties.startPoint',
          items: {
            groups: {
              type: 'items',
              items: {
                startPoint: components.startPointHeader(),
                ...basicLocationItems(''),
              },
            },
          },
          grouped: true,
          show: function (props: LayerProperties) {
            return props.path?.startEndPoint;
          },
        },
        secondLocation: {
          type: 'items',
          translation: 'geo.properties.endPoint',
          items: {
            groups: {
              type: 'items',
              items: {
                endPoint: components.endPointHeader(),
                ...basicLocationItems('endPoint.'),
              },
            },
          },
          show: function (props: LayerProperties) {
            return props.path?.startEndPoint;
          },
        },
      };
      break;
    default:
      items = basicLocationItems('');
      delete items.useLatLongCheckbox;
      delete items.latLongText;
      delete items.longitude;
  }

  return {
    component: 'items',
    translation: 'geo.properties.location',
    items,
  };
}
