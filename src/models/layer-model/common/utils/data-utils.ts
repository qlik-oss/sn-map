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
  export function getDimensionExpressionIndex(id: string, hq?: NxHyperCube) {
    if (!hq || !hq.qDimensionInfo[0]) return null;
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
    return null;
  }

  /**
   * Range of values for specified dimension expression id. Returns null if not defined or values are  not numeric.
   */
  export function getMinMax(id: string, hq: NxHyperCube) {
    const indexInfo = getDimensionExpressionIndex(id, hq);
    if (indexInfo == null) {
      return null;
    }
    const dimInfo = hq.qDimensionInfo[indexInfo.dimensionIndex];
    if (!dimInfo) {
      return null;
    }
    const index = indexInfo.index;
    const attrInfo = dimInfo.qAttrExprInfo[index];
    if (!attrInfo || isNaN(attrInfo.qMin) || isNaN(attrInfo.qMax)) {
      return null;
    }
    return [attrInfo.qMin, attrInfo.qMax];
  }
}

export default DataUtils;
