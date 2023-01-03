import { getValue } from 'qlik-chart-modules';

module LocationUtils {
  export function getLocationKind(location: string | number | undefined, isLatLong: boolean) {
    if (isLatLong) {
      return 'LATLONGS';
    }
    if (location !== undefined && location !== '-') {
      if (typeof location === 'string' && location.charAt(0) === '[') {
        return 'STRINGCOORDS';
      } else {
        return 'NAMES';
      }
    }
    return 'UNKOWN';
  }

  export function getLocationFromFirstDimension(row: NxCell[]) {
    if (row[0].qText && row[0].qText !== '[]') {
      return row[0].qText as string;
    } else if (row[0].qNum !== undefined) {
      return row[0].qNum as number;
    }
  }

  export function getLatLong(latitude: string | number | undefined, longitude: string | number | undefined) {
    if (latitude === undefined || longitude === undefined) return;
    latitude = typeof latitude === 'string' ? parseFloat(latitude.replace(/,/, '.')) : latitude;
    longitude = typeof longitude === 'string' ? parseFloat(longitude.replace(/,/, '.')) : longitude;
    return [latitude, longitude];
  }

  export function parseGeometryString(stringGeom: string | undefined) {
    if (stringGeom === undefined) return undefined;

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

  export function addLocationSuffix(data: LocationData, locationType: string) {
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
