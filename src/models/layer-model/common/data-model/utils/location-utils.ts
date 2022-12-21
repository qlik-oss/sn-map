import { getValue } from 'qlik-chart-modules';

module LocationUtils {
  export function replaceLocationData(attributeData: Data, dimValue: string | undefined, locationType: string) {
    if (attributeData.locationOrLatitude === undefined) {
      attributeData.locationOrLatitude = dimValue;
    }

    const hasLatLong = attributeData.hasOwnProperty('longitude');
    const locationKind = getLocationKind(attributeData.locationOrLatitude, hasLatLong);

    // Tailor location data to be consumed
    switch (locationKind) {
      case 'LATLONGS':
        attributeData.coords = getLatLong(attributeData.locationOrLatitude, attributeData.longitude);
        break;
      case 'STRINGCOORDS':
        attributeData.coords = parseGeometryString(attributeData.locationOrLatitude);
        break;
      case 'NAMES':
        attributeData.geoname = addLocationSuffix(attributeData, locationType);
        break;
      default:
        attributeData.id = null;
        break;
    }

    // Remove old location expressions
    delete attributeData.locationOrLatitude;
    delete attributeData.locationCountry;
    delete attributeData.locationAdmin1;
    delete attributeData.locationAdmin2;
    delete attributeData.longitude;
  }

  export function getLocationKind(location: string | number | undefined, isLatLong: boolean) {
    if (isLatLong) {
      return 'LATLONGS';
    }
    if (location != null && location !== '-') {
      if (typeof location === 'string' && location.charAt(0) === '[') {
        return 'STRINGCOORDS';
      } else {
        return 'NAMES';
      }
    }
    return 'UNKOWN';
  }

  export function getLatLong(latitude: string | number | undefined, longitude: string | number | undefined) {
    latitude = typeof latitude === 'string' ? parseFloat(latitude.replace(/,/, '.')) : latitude;
    longitude = typeof longitude === 'string' ? parseFloat(longitude.replace(/,/, '.')) : longitude;
    return [latitude, longitude];
  }

  export function parseGeometryString(stringGeom: string | undefined) {
    if (!stringGeom) return null;

    const parsedArray = JSON.parse(stringGeom);
    const depth = LocationUtils.switchCoordinatesAndCountDepth(parsedArray);

    if (depth > 2) {
      return [].concat.apply([], parsedArray);
    }

    return parsedArray;
  }

  export function switchCoordinatesAndCountDepth(coord: any[], cnt?: number): number {
    cnt = cnt || 0;
    let depth = cnt;

    if (Array.isArray(coord[0])) {
      for (let i = 0; i < coord.length; i++) {
        depth = Math.max(switchCoordinatesAndCountDepth(coord[i], cnt + 1), depth);
      }
    } else {
      switchTwoValues(coord);
    }

    return depth;
  }

  function switchTwoValues(v: number[]) {
    if (v.length < 2) return;

    const tmp = v[0];
    v[0] = v[1];
    v[1] = tmp;
  }

  export function addLocationSuffix(data: Data, locationType: string) {
    let location = data.locationOrLatitude;

    const hasLocationCountry = getValue(data, 'locationCountry', '').trim().length > 0;
    const hasLocationAdmin1 = getValue(data, 'locationAdmin1', '').trim().length > 0;
    const hadLocationAdmin2 = getValue(data, 'locationAdmin2', '').trim().length > 0;

    if (hasLocationCountry) {
      location = `${location},${data?.locationCountry}`;
      if (hasLocationAdmin1) {
        location = `${location},${data?.locationAdmin1}`;
        if (hadLocationAdmin2) {
          location = `${location},${data?.locationAdmin2}`;
        }
      }
    }

    if (locationType) {
      location = `${location}:${locationType}`;
    }
    return location;
  }
}

export default LocationUtils;
