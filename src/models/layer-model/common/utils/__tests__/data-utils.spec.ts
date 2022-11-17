import dataUtils from '../data-utils';
import mockLayout, { createDumpAttrExpr, createDumpAttrDim } from '../../../../../mocks/layout';

describe('DataUtils', () => {
  describe('flattenDataPages', () => {
    let dataPages: NxDataPage[];

    beforeEach(() => {
      dataPages = mockLayout.layer.base.qHyperCube.qDataPages;
    });
    it('should flatten data', () => {
      dataPages.push({
        qMatrix: [[{ qElemNumber: 0, qState: 'S' }], [{ qElemNumber: 1, qState: 'S' }]],
      });
      const result = dataUtils.flattenDataPages(dataPages);
      expect(result.qMatrix).toBeDefined();
      expect(result.qMatrix?.length).toBe(3);
    });
  });

  describe('getDimensionExpressionInfo', () => {
    let layoutHyperCube: NxHyperCube;
    const attrExpsId1 = 'attrExpsId_1';
    const attrExpsId2 = 'attrExpsId_2';

    beforeEach(() => {
      layoutHyperCube = JSON.parse(JSON.stringify(mockLayout.layer.base.qHyperCube));
    });

    it('should return the qAttrExprInfo of the dimension if it exists', () => {
      const attrExps1 = createDumpAttrExpr(attrExpsId1);
      const attrExps2 = createDumpAttrExpr(attrExpsId2);
      layoutHyperCube.qDimensionInfo.push({
        qFallbackTitle: '',
        qAttrExprInfo: [attrExps1, attrExps2],
        qAttrDimInfo: [],
      });
      const dimExpsInfo = dataUtils.getDimensionExpressionInfo(attrExpsId2, layoutHyperCube);
      expect(dimExpsInfo?.index).toEqual(1);
      expect(dimExpsInfo?.isDim).toEqual(false);
      expect(dimExpsInfo?.dimensionIndex).toEqual(1);
    });

    it('should return the qAttrDimInfo of the dimension if it exists', () => {
      const attrExps1 = createDumpAttrDim(attrExpsId1);
      const attrExps2 = createDumpAttrDim(attrExpsId2);
      layoutHyperCube.qDimensionInfo.push({
        qFallbackTitle: '',
        qAttrExprInfo: [],
        qAttrDimInfo: [attrExps1, attrExps2],
      });
      const dimExpsInfo = dataUtils.getDimensionExpressionInfo(attrExpsId2, layoutHyperCube);
      expect(dimExpsInfo?.index).toEqual(1);
      expect(dimExpsInfo?.isDim).toEqual(true);
      expect(dimExpsInfo?.dimensionIndex).toEqual(1);
    });

    it('should return undefined if no attribute expressions exists with the given id', () => {
      const dimExpsInfo = dataUtils.getDimensionExpressionInfo('attrExpsId', layoutHyperCube);
      expect(dimExpsInfo).toBeUndefined();
    });
  });

  describe('getMinMax', () => {
    let layoutHyperCube: NxHyperCube;
    const attrExpsId1 = 'attrExpsId_1';
    const attrExpsId2 = 'attrExpsId_2';

    beforeEach(() => {
      layoutHyperCube = JSON.parse(JSON.stringify(mockLayout.layer.base.qHyperCube));
    });

    it('should not return a minMax when the attribute is a measure', () => {
      const attrExps1 = createDumpAttrExpr(attrExpsId1);
      const attrExps2 = createDumpAttrExpr(attrExpsId2);
      layoutHyperCube.qDimensionInfo.push({
        qFallbackTitle: '',
        qAttrExprInfo: [attrExps1, attrExps2],
        qAttrDimInfo: [],
      });
      const dimExpsInfo = dataUtils.getDimensionExpressionInfo(attrExpsId2, layoutHyperCube);
      const minMax = dataUtils.getMinMax(layoutHyperCube, dimExpsInfo);
      expect(minMax?.min).toEqual(0);
      expect(minMax?.max).toEqual(10);
    });

    it('should not return a minMax when the attribute is not a measure', () => {
      const attrExps1 = createDumpAttrDim(attrExpsId1);
      const attrExps2 = createDumpAttrDim(attrExpsId2);
      layoutHyperCube.qDimensionInfo.push({
        qFallbackTitle: '',
        qAttrExprInfo: [],
        qAttrDimInfo: [attrExps1, attrExps2],
      });
      const dimExpsInfo = dataUtils.getDimensionExpressionInfo(attrExpsId2, layoutHyperCube);
      const minMax = dataUtils.getMinMax(layoutHyperCube, dimExpsInfo);
      expect(minMax).toBeUndefined();
    });
  });
});
