import { DataModel } from '../../common/data-model';
import DataUtils from '../../common/data-model/utils/data-utils';

export class PointLayerDataModel extends DataModel {
  data: PointData[];
  meta: ExpressionMeta[];
  constructor() {
    super();
    this.data = [];
    this.meta = [];
  }

  update(layoutService: LayoutService) {
    const dimensionInfo = layoutService.getLayoutValue('qHyperCube.qDimensionInfo');

    this.meta = DataUtils.getAttributeMeta(dimensionInfo);
    const pointData = this.extractPointData(layoutService);
    this.setData(pointData);
  }

  extractPointData(layoutService: LayoutService) {
    const dataPages = layoutService.getDataPages();
    const layoutType = layoutService.getLayoutValue('layoutType');
    let pointData: PointData[] = [];
    for (const page in dataPages) {
      let dataPage = dataPages[page];
      if (!dataPage.qMatrix) {
        continue;
      }

      if (Array.isArray(dataPage)) {
        dataPage = DataUtils.flattenDataPages(dataPage);
      }

      const extractedData = dataPage.qMatrix.map((row: NxCell[]) => {
        const cell = row[0];
        if (cell === null) {
          return { id: null };
        }

        const elemData = this.getElemData(cell);
        const expressionData = this.getExpressionData(cell, this.meta);
        this.replaceLocationData(expressionData, cell.qText, layoutType);

        return {
          ...elemData,
          ...expressionData,
        };
      });

      pointData = pointData.concat(extractedData as PointData[]);
    }
    return pointData;
  }
}
