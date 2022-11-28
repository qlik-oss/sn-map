import LocationUtils from './utils/location-utils';
import DataUtils from './utils/data-utils';

export class DataModel {
  data: Data[];
  constructor() {
    this.data = [];
  }

  getData() {
    return this.data;
  }

  setData(data: Data[]) {
    this.data = data;
  }

  getElemData(cell: NxCell) {
    return { id: cell.qElemNumber };
  }

  getLocationData(cell: NxCell, metaLocation: LocationMeta) {
    let data = {} as LocationData;
    metaLocation.expressions.forEach((expressionMeta: ExpressionMeta) => {
      const attribute = DataUtils.getAttributeData(cell, expressionMeta);
      data = { ...data, ...attribute };
    });

    if (data.locationOrLatitude === undefined) {
      data.locationOrLatitude = cell.qText;
    }

    const locationKind = LocationUtils.getLocationKind(data.locationOrLatitude, metaLocation.isLatLong);

    switch (locationKind) {
      case 'LATLONGS':
        const latitude =
          data.locationOrLatitude !== undefined
            ? parseFloat(data.locationOrLatitude.replace(/,/, '.'))
            : data.locationOrLatitude;
        const longitude = data.longitude !== undefined ? parseFloat(data.longitude.replace(/,/, '.')) : data.longitude;
        return { coords: [latitude, longitude] };
      case 'STRINGCOORDS':
        return { coords: LocationUtils.parseGeometryString(data.locationOrLatitude) };
      case 'NAMES':
        const geoname = LocationUtils.addLocationSuffix(data, metaLocation);
        return { geoname };
      case 'UNKOWN':
        return { location: null };
    }
  }

  getSizeData(cell: NxCell, meta: PointMeta) {
    const expressionMeta = meta.metaSize?.expressionMeta;
    if (expressionMeta) {
      return { size: { value: cell.qAttrExps?.qValues[expressionMeta?.index]?.qNum, expressionMeta } };
    }
    return {};
  }
}
