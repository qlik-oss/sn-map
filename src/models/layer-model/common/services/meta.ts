import { getValue } from 'qlik-chart-modules';

module MetaUtils {
  export function getHyperCubeMeta(hyperCube: NxHyperCube) {
    let attributesMeta = {};
    let rowIndex = 0;
    const dimensionMeta: DimensionMeta[] = [];
    const measureMeta: MeasureMeta[] = [];
    const dimensionInfo = getValue(hyperCube, 'qDimensionInfo', []);
    const measureInfo = getValue(hyperCube, 'qMeasureInfo', []);

    dimensionInfo.forEach((info: NxDimensionInfo) => {
      dimensionMeta.push({
        title: info.qFallbackTitle,
        isDimension: true,
        rowIndex,
      });
      attributesMeta = { ...attributesMeta, ...getAttributesMeta(info, rowIndex) };
      rowIndex++;
    });

    measureInfo.forEach((info: NxMeasureInfo) => {
      measureMeta.push({
        title: info.qFallbackTitle,
        isDimension: true,
        rowIndex,
        minValue: info.qMin,
        maxValue: info.qMax,
      });
      attributesMeta = { ...attributesMeta, ...getAttributesMeta(info, rowIndex) };
      rowIndex++;
    });

    return { dimensions: dimensionMeta, measures: measureMeta, attributes: attributesMeta };
  }

  export function getAttributesMeta(info: NxDimensionInfo | NxMeasureInfo, dimIndex: number) {
    const meta: Meta = {};
    info.qAttrExprInfo.forEach((attrExpr: NxAttrExprInfo, index: number) => {
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

    info.qAttrDimInfo.forEach((dimExpr: NxAttrDimInfo, index: number) => {
      meta[dimExpr.id] = {
        id: dimExpr.id,
        index,
        dimIndex,
        isDimension: true,
        title: dimExpr.qFallbackTitle,
      };
    });

    return meta;
  }

  export function getMinMax(attrInfo: NxAttrExprInfo) {
    if (isNaN(attrInfo.qMin) || isNaN(attrInfo.qMax)) {
      return;
    }
    return { min: attrInfo.qMin, max: attrInfo.qMax };
  }
}

export default MetaUtils;
