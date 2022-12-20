import LocationUtils from './utils/location-utils';
import DataUtils from './utils/data-utils';
import Meta from '../../common/services/layout-service/meta';

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

  getExpressionData(cell: NxCell, meta: ExpressionMeta[]) {
    let attributeData = {};
    meta.forEach((expressionMeta: ExpressionMeta) => {
      const attribute = DataUtils.getAttributeData(cell, expressionMeta);
      attributeData = { ...attributeData, ...attribute };
    });

    return attributeData;
  }

  replaceLocationData(attributeData: any, dimValue: string | undefined, locationType: string) {
    if (attributeData.locationOrLatitude === undefined) {
      attributeData.locationOrLatitude = dimValue;
    }

    const locationKind = LocationUtils.getLocationKind(attributeData.locationOrLatitude, attributeData.longitude);

    // Add new consumable location data
    switch (locationKind) {
      case 'LATLONGS':
        const latitude =
          attributeData.locationOrLatitude !== undefined
            ? parseFloat(attributeData.locationOrLatitude.replace(/,/, '.'))
            : attributeData.locationOrLatitude;
        const longitude =
          attributeData.longitude !== undefined
            ? parseFloat(attributeData.longitude.replace(/,/, '.'))
            : attributeData.longitude;
        attributeData.coords = [latitude, longitude];
        break;
      case 'STRINGCOORDS':
        attributeData.coords = LocationUtils.parseGeometryString(attributeData.locationOrLatitude);
        break;
      case 'NAMES':
        attributeData.geoname = LocationUtils.addLocationSuffix(attributeData, locationType);
        break;
      default:
        attributeData.location = null;
        break;
    }

    // Remove old location expressions
    delete attributeData.locationOrLatitude;
    delete attributeData.locationCountry;
    delete attributeData.locationAdmin1;
    delete attributeData.locationAdmin2;
    delete attributeData.longitude;
  }

  getSizeData(cell: NxCell, layout: LayerLayout) {
    const expressionMeta = Meta.getExpressionMeta('size', layout)?.[0];
    if (expressionMeta) {
      return { size: { value: cell.qAttrExps?.qValues[expressionMeta?.index]?.qNum, expressionMeta } };
    }
    return {};
  }
}
