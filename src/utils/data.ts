import { getValue } from 'qlik-chart-modules';
import LocationUtils from './location';

module DataUtils {
  export function getElemData(row: NxCell[], dimIndex: number) {
    const cell = row[dimIndex];
    if (cell === null) {
      return {};
    } else {
      return { id: cell.qElemNumber, dimensionValue: cell.qText, state: cell.qState };
    }
  }

  export function getAttribute(row: NxCell[], meta: ExpressionMeta | undefined) {
    if (meta === undefined) {
      return {};
    }
    const cell = row[meta.dimIndex];
    const attrValues = meta.isDimension ? cell.qAttrDims : cell.qAttrExps;
    const qValue = getValue(attrValues, `qValues.${meta.index}`, {});
    const value = extractValue(qValue, meta);

    return { [meta.id]: value };
  }

  export function extractValue(value: NxSimpleValue, meta: ExpressionMeta) {
    const hasMinOrMaxValue = !isNaN(meta.minValue as number) || !isNaN(meta.maxValue as number);
    if (hasMinOrMaxValue && !isNaN(value.qNum as number)) {
      return value.qNum as number;
    } else if (value.qText) {
      return value.qText as string;
    }
    return undefined;
  }

  export function getGeometry(row: NxCell[], layoutService: LayoutService) {
    const meta = getValue(layoutService, 'meta.attributes', {});
    const locationType = layoutService.getLayoutValue('locationType');
    const data = {
      ...getAttribute(row, meta.locationOrLatitude),
      ...getAttribute(row, meta.longitude),
      ...getAttribute(row, meta.locationCountry),
      ...getAttribute(row, meta.locationAdmin1),
      ...getAttribute(row, meta.locationAdmin2),
    } as LocationData;

    if (data.locationOrLatitude === undefined) {
      data.locationOrLatitude = LocationUtils.getLocationFromFirstDimension(row);
    }

    const hasLatLong = data.hasOwnProperty('longitude');
    const locationKind = LocationUtils.getLocationKind(data.locationOrLatitude, hasLatLong);
    switch (locationKind) {
      case 'LATLONGS':
        return { coords: LocationUtils.getLatLong(data.locationOrLatitude, data.longitude) };
      case 'STRINGCOORDS':
        return { coords: LocationUtils.parseGeometryString(data.locationOrLatitude as string) };
      case 'NAMES':
        return { geoname: LocationUtils.addLocationSuffix(data, locationType) };
      default:
        return {};
    }
  }

  /**
   * Takes a NxDataPage[] and transforms it into one big NxDataPage.
   * @param data Array to be flattened.
   */
  export function flattenDataPages(data: NxDataPage[]): NxDataPage {
    const newDataPage: NxDataPage = data[0];
    const flattened: NxCell[][] = [];
    newDataPage.qMatrix = flattened.concat.apply(
      [],
      data.map((row) => {
        return row.qMatrix as NxCell[][];
      })
    );
    return newDataPage;
  }
}

export default DataUtils;
