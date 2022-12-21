import { getValue } from 'qlik-chart-modules';

module DataUtils {
  export function getExpressionData(cell: NxCell, meta: any) {
    let data = {};
    for (const key in meta) {
      const expressionMeta = meta[key];
      const attribute = getAttribute(cell, expressionMeta);
      data = { ...data, ...attribute };
    }

    return data;
  }

  export function getAttribute(cell: NxCell, meta: ExpressionMeta) {
    const attrValues = meta.isDimension ? cell.qAttrDims : cell.qAttrExps;
    if (!attrValues) {
      return {};
    }
    const qValue = getValue(attrValues, `qValues.${meta.index}`, {});
    const value = extractValue(qValue, meta);

    return { [meta.id]: value };
  }

  export function extractValue(value: NxSimpleValue, meta: ExpressionMeta) {
    const hasMinOrMaxValue = !isNaN(meta.minValue as number) || !isNaN(meta.maxValue as number);
    if (hasMinOrMaxValue && value.qNum !== undefined && value.qNum !== 'NaN') {
      return value.qNum as number;
    } else if (value.qText) {
      return value.qText as string;
    }
    return null;
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
