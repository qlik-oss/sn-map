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

  update(layoutService: LayoutService) {
    const data = this.extractData(layoutService);
    this.setData(data);
  }

  extractData(layoutService: LayoutService) {
    const dataPages = layoutService.getDataPages();
    const layoutType = layoutService.getLayoutValue('layoutType');
    const meta = layoutService.meta.attributes;
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
        const expressionData = DataUtils.getExpressionData(cell, meta) as Data;
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
}
