import LocationUtils from './utils/location-utils';
import DataUtils from './utils/data-utils';
import MetaUtils from './utils/meta-utils';

export class DataModel {
  data: Data[];
  meta: Meta;
  constructor() {
    this.data = [];
    this.meta = {};
  }

  getData() {
    return this.data;
  }

  setData(data: Data[]) {
    this.data = data;
  }

  getMeta() {
    return this.meta;
  }

  setMeta(meta: any) {
    this.meta = meta;
  }

  update(layoutService: LayoutService) {
    const dimensionInfo = layoutService.getLayoutValue('qHyperCube.qDimensionInfo');
    const meta = this.extractMeta(dimensionInfo);
    this.setMeta(meta);
    const data = this.extractData(layoutService, meta);
    this.setData(data);
  }

  extractData(layoutService: LayoutService, meta: Meta) {
    const dataPages = layoutService.getDataPages();
    const layoutType = layoutService.getLayoutValue('layoutType');
    let data: Data[] = [];
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

        const elemData = { id: cell.qElemNumber };
        const expressionData = DataUtils.getExpressionData(cell, meta);
        LocationUtils.replaceLocationData(expressionData, cell.qText, layoutType);

        return {
          ...elemData,
          ...expressionData,
        };
      }) as Data[];

      data = data.concat(extractedData);
    }
    return data;
  }

  extractMeta(dimensionInfo: any) {
    let meta: Meta = {};
    dimensionInfo.forEach((dimension: NxDimensionInfo, dimIndex: number) => {
      dimension.qAttrExprInfo.forEach((attrExpr: NxAttrExprInfo, index: number) => {
        const minMax = MetaUtils.getMinMax(attrExpr);
        meta[attrExpr.id] = {
          id: attrExpr.id,
          index,
          dimIndex,
          isDimension: false,
          minValue: minMax?.min,
          maxValue: minMax?.max,
          title: attrExpr.qFallbackTitle,
        };
      });

      dimension.qAttrDimInfo.forEach((dimExpr: NxAttrDimInfo, index: number) => {
        meta[dimExpr.id] = {
          id: dimExpr.id,
          index,
          dimIndex,
          isDimension: true,
          title: dimExpr.qFallbackTitle,
        };
      });
    });

    return meta;
  }
}
