module MetaUtils {
  export function getMinMax(attrInfo: NxAttrExprInfo) {
    if (!attrInfo || isNaN(attrInfo.qMin) || isNaN(attrInfo.qMax)) {
      return;
    }
    return { min: attrInfo.qMin, max: attrInfo.qMax };
  }
}

export default MetaUtils;
