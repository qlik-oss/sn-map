import { getValue } from 'qlik-chart-modules';

module DataUtils {
  export function getAttributeMeta(dimensionInfo: any) {
    let expressionMeta = {};
    dimensionInfo.forEach((dimension: NxDimensionInfo, dimIndex: number) => {
      dimension.qAttrExprInfo.forEach((attrExpr: NxAttrExprInfo, index: number) => {
        expressionMeta[attrExpr.id] = {
          id: attrExpr.id,
          index,
          dimIndex,
          isDimension: false,
          minValue: attrExpr.qMin,
          maxValue: attrExpr.qMax,
          title: attrExpr.qFallbackTitle,
        };
      });

      dimension.qAttrDimInfo.forEach((dimExpr: NxAttrDimInfo, index: number) => {
        expressionMeta[dimExpr.id] = {
          id: dimExpr.id,
          index,
          dimIndex,
          isDimension: true,
          title: dimExpr.qFallbackTitle,
        };
      });
    });

    return expressionMeta;
  }

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
    if (value.qNum !== undefined && value.qNum !== 'NaN') {
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
