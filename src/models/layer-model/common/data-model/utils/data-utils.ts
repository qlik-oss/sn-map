import { getValue } from 'qlik-chart-modules';

module DataUtils {
  export function getAttributeData(cell: NxCell, meta: ExpressionMeta) {
    const attrValues = meta.isDimension ? cell.qAttrDims : cell.qAttrExps;
    if (!attrValues) {
      return {};
    }
    const qValue = getValue(attrValues, `qValues.${meta.index}`, {});
    let value = null;
    if (meta.isDimension) {
      value = extractAttributeDimension(qValue);
    } else {
      value = extractAttributeExpression(qValue);
    }

    return { [meta.id]: value };
  }

  export function extractAttributeDimension(value: NxSimpleDimValue) {
    if (value.qText) {
      return value.qText as string;
    }
    return null;
  }

  export function extractAttributeExpression(value: NxSimpleValue) {
    if (value.qText) {
      return value.qText as string;
    } else if (value.qNum !== undefined && value.qNum !== 'NaN') {
      return value.qNum as number;
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
