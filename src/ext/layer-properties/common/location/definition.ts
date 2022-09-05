import LayerType from '../../../../utils/const/layer-type';
import getComponents from './components';

export default function locationDefinition(translator: TranslatorType, type: string) {
  const components = getComponents(translator);
  let items = {};

  switch (type) {
    case LayerType.POINT:
      items = {
        useLatLongCheckbox: components.useLatLongCheckbox(''),
        location: components.location(''),
        locationText: components.locationText(''),
        latLongText: components.latLongText(''),
        longitude: components.longitude(''),
        useLocationNamesSwitch: components.useLocationNamesSwitch(''),
        locationType: components.locationType(''),
        country: components.country(''),
        locationNameCountryInstruction: components.locationNameCountryInstruction(''),
        admin1: components.admin1(''),
        locationNameAdmin1Instruction: components.locationNameAdmin1Instruction(''),
        admin2: components.admin2(''),
      };
      break;
    default:
      items = {
        location: components.location(''),
        locationText: components.locationText(''),
        useLocationNamesSwitch: components.useLocationNamesSwitch(''),
        locationType: components.locationType(''),
        country: components.country(''),
        locationNameCountryInstruction: components.locationNameCountryInstruction(''),
        admin1: components.admin1(''),
        locationNameAdmin1Instruction: components.locationNameAdmin1Instruction(''),
        admin2: components.admin2(''),
      };
  }

  return {
    component: 'items',
    translation: 'geo.properties.location',
    items,
  };
}
