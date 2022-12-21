module MetaUtils {
  export function getAttributesMeta(dimensionInfo: NxDimensionInfo[]) {
    let meta: Meta = {};
    dimensionInfo.forEach((dimension: NxDimensionInfo, dimIndex: number) => {
      dimension.qAttrExprInfo.forEach((attrExpr: NxAttrExprInfo, index: number) => {
        const minMax = getMinMax(attrExpr);
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

  export function getMinMax(attrInfo: NxAttrExprInfo) {
    if (!attrInfo || isNaN(attrInfo.qMin) || isNaN(attrInfo.qMax)) {
      return;
    }
    return { min: attrInfo.qMin, max: attrInfo.qMax };
  }
}

export default MetaUtils;
