import LayerType from '../../../../utils/const/layer-type';

export default function getLocationProperties(type: string) {
  const initialProperties: LocationProperties = {
    locationOrLatitude: { key: '', label: '', type: '' },
    locationDefault: '',
    locationNamesAuto: true,
    locationType: '',
    locationCountry: { key: '', label: '', type: '' },
    locationAdmin1: { key: '', label: '', type: '' },
    locationAdmin2: { key: '', label: '', type: '' },
  };

  switch (type) {
    case LayerType.POINT:
      initialProperties.longitude = { key: '', label: '', type: '' };
      initialProperties.isLatLong = false;
      break;
    case LayerType.LINE:
      initialProperties.longitude = { key: '', label: '', type: '' };
      initialProperties.isLatLong = false;
      initialProperties.endPoint = {
        locationOrLatitude: { key: '', label: '', type: '' },
        locationDefault: '',
        locationNamesAuto: true,
        locationType: '',
        locationCountry: { key: '', label: '', type: '' },
        locationAdmin1: { key: '', label: '', type: '' },
        locationAdmin2: { key: '', label: '', type: '' },
      };
      initialProperties.path = {
        startEndPoint: true,
        field: { key: '', label: '', type: '' },
        locationDefault: '',
      };
  }
  return initialProperties;
}
