import { getValue } from 'qlik-chart-modules';

module DataUtils {
  export function getElemData(row: NxCell[], dimIndex: number) {
    const cell = row[dimIndex];
    if (cell == null) {
      return { id: null, dimensionValue: null, state: null };
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
