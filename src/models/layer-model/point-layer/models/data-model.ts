import { DataModel } from '../../common/data-model';
import DataUtils from '../../common/utils/data-utils';

export class PointLayerDataModel extends DataModel {
  data: PointData[];
  constructor() {
    super();
    this.data = [];
  }

  update(layoutService: LayoutService) {
    const pointData = this.getPointData(layoutService);
    this.setData(pointData);
  }

  getPointData(layoutService: LayoutService) {
    const dataPages = layoutService.getDataPages();
    let pointData: PointData[] = [];
    for (const page in dataPages) {
      const dataPage = dataPages[page];
      if (!dataPage.qMatrix) {
        continue;
      }
      const extractedData = this.extractPointData(dataPage, layoutService.meta);
      pointData = pointData.concat(extractedData as PointData[]);
    }
    return pointData;
  }

  extractPointData(dataPage: NxDataPage | NxDataPage[], meta: PointMeta) {
    if (Array.isArray(dataPage)) {
      dataPage = DataUtils.flattenDataPages(dataPage);
    }
    return dataPage.qMatrix.map((row) => {
      const cell = row[0];
      if (cell === null) {
        return { id: null };
      }

      const elemData = this.getElemData(cell);
      const locationData = this.getLocationData(cell, meta.location);
      const qAttrExps = cell.qAttrExps;
      return {
        ...locationData,
        ...elemData,
        qAttrExps,
      };
    });
  }
}
