import { getValue } from 'qlik-chart-modules';

module LocationUtils {
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

  export function addLocationSuffix(data: LocationData, meta: LocationMeta) {
    let location = data.locationOrLatitude;
    if (meta.isAuto) return location;

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

    if (meta.locationType) {
      location = `${location}:${meta.locationType}`;
    }
    return location;
  }

  export function parseGeometryString(stringgeom: string | undefined) {
    if (!stringgeom) return null;

    const parsedArray = JSON.parse(stringgeom);
    const depth = LocationUtils.switchCoordinatesAndCountDepth(parsedArray);

    if (depth > 2) {
      return [].concat.apply([], parsedArray);
    }

    return parsedArray;
  }

  function switchTwoValues(v: number[]) {
    if (v.length < 2) return;

    const tmp = v[0];
    v[0] = v[1];
    v[1] = tmp;
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
}

export default LocationUtils;
