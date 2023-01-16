import { getValue } from 'qlik-chart-modules';
import LocationType from './const/location-type';
import DataUtils from './data';

module LocationUtils {
  export function getLocation(row: NxCell[], layoutService: LayoutService, dimensionIndex: number) {
    const metaLocation = getValue(layoutService, 'meta.attributes.locationOrLatitude');
    if (metaLocation === undefined) {
      return getLocationFromDimension(row, dimensionIndex);
    }

    return DataUtils.getAttribute(row, metaLocation).locationOrLatitude;
  }

  export function getLocationFromDimension(row: NxCell[], dimensionIndex: number) {
    if (row[dimensionIndex].qText && row[dimensionIndex].qText !== '[]') {
      return row[dimensionIndex].qText as string;
    } else if (row[dimensionIndex].qNum !== undefined) {
      return row[dimensionIndex].qNum as number;
    }
  }

  export function getGeometry(
    locationOrLatitude: string | number | undefined,
    locationKind: string,
    row: NxCell[],
    layoutService: LayoutService
  ) {
    if (locationOrLatitude === undefined) return;
    const meta = getValue(layoutService, 'meta.attributes', {});
    const locationType = layoutService.getLayoutValue('locationType');
    const data = {
      locationOrLatitude,
      ...DataUtils.getAttribute(row, meta.longitude),
      ...DataUtils.getAttribute(row, meta.locationCountry),
      ...DataUtils.getAttribute(row, meta.locationAdmin1),
      ...DataUtils.getAttribute(row, meta.locationAdmin2),
    } as LocationData;

    switch (locationKind) {
      case LocationType.LATLONGS:
        return LocationUtils.getLatLong(locationOrLatitude, data.longitude);
      case LocationType.STRINGCOORDS:
        return LocationUtils.parseGeometryString(locationOrLatitude as string);
      case LocationType.NAMES:
        return LocationUtils.addLocationSuffix(data, locationType);
      default:
        return;
    }
  }

  export function getLocationKind(page: NxDataPage, layoutService: LayoutService, dimensionIndex: number) {
    for (const index in page.qMatrix) {
      const row = page.qMatrix[index];
      const location = getLocation(row, layoutService, dimensionIndex);

      const isLatLong = layoutService.getLayoutValue('isLatLong');
      if (isLatLong) {
        return LocationType.LATLONGS;
      }
      if (location !== undefined && location !== '-') {
        if (typeof location === 'string' && location.charAt(0) === '[') {
          return LocationType.STRINGCOORDS;
        } else {
          return LocationType.NAMES;
        }
      }
    }
    return LocationType.UNKOWN;
  }

  export function getLatLong(latitude: string | number | undefined, longitude: string | number | undefined) {
    if (latitude === undefined || longitude === undefined) return;
    latitude = typeof latitude === 'string' ? parseFloat(latitude.replace(/,/, '.')) : latitude;
    longitude = typeof longitude === 'string' ? parseFloat(longitude.replace(/,/, '.')) : longitude;
    return [latitude, longitude];
  }

  export function parseGeometryString(stringGeom: string | undefined) {
    if (stringGeom === undefined) return;

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
