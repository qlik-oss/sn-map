module DataUtils {
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

  /**
   * The index in layer properties used by the specified id or null if id is not set.
   * @param id Id of the expression
   * @param hq hyper cube def
   */
  export function getDimensionExpressionInfo(id: string, hq: NxHyperCube): DimensionExpressionInfo | undefined {
    if (hq.qDimensionInfo.length === 0) return;
    //There can be more than one dimension
    for (let n = 0; n < hq.qDimensionInfo.length; n++) {
      const exprdefs = hq.qDimensionInfo[n].qAttrExprInfo;
      for (let i = 0; i < exprdefs.length; i++) {
        if (exprdefs[i].id === id) return { index: i, isDim: false, dimensionIndex: n };
      }
      const exprdefs2 = hq.qDimensionInfo[n].qAttrDimInfo;
      for (let i = 0; i < exprdefs2.length; i++) {
        if (exprdefs2[i].id === id) return { index: i, isDim: true, dimensionIndex: n };
      }
    }
    return;
  }

  /**
   * Range of values for specified dimension expression id. Returns null if not defined or values are  not numeric.
   */
  export function getMinMax(hq: NxHyperCube, dimensionExpressionInfo?: DimensionExpressionInfo) {
    if (!dimensionExpressionInfo) {
      return;
    }
    const dimInfo = hq.qDimensionInfo[dimensionExpressionInfo.dimensionIndex];
    const index = dimensionExpressionInfo.index;
    const attrInfo = dimInfo.qAttrExprInfo[index];
    if (!attrInfo || isNaN(attrInfo.qMin) || isNaN(attrInfo.qMax)) {
      return;
    }
    return { min: attrInfo.qMin, max: attrInfo.qMax };
  }
}

export default DataUtils;
