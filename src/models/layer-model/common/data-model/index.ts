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

  getLocationData(cell: NxCell, meta: LocationMeta) {
    let data = {} as LocationData;
    meta.expressions.forEach((expressionMeta: ExpressionMeta) => {
      const attribute = DataUtils.getAttributeData(cell, expressionMeta);
      data = { ...data, ...attribute };
    });

    if (data.locationOrLatitude === undefined) {
      data.locationOrLatitude = cell.qText;
    }

    const locationKind = LocationUtils.getLocationKind(data.locationOrLatitude, meta.isLatLong);

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
        const geoname = LocationUtils.addLocationSuffix(data, meta);
        return { geoname };
      case 'UNKOWN':
        return { location: null };
    }
  }
}
