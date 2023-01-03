import MetaUtils from '../meta';
import mockLayout, { createDumpAttrExpr, createDumpAttrDim } from '../../../../../mocks/layout';

describe('MetaUtils', () => {
  let dimensionInfo: NxDimensionInfo[];

  beforeEach(() => {
    dimensionInfo = JSON.parse(JSON.stringify(mockLayout.layer.point.qHyperCube.qDimensionInfo));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getAttributesMeta', () => {
    it('should get attributes meta from layout', () => {
      const attrExp1 = createDumpAttrExpr('foobar');
      const attrExps2 = createDumpAttrExpr('dummy');
      const attrDim1 = createDumpAttrDim('dummy');
      dimensionInfo[0].qAttrExprInfo.push(attrExp1);

      let meta = MetaUtils.getAttributesMeta(dimensionInfo[0], 0);
      expect(Object.keys(meta).length).toBe(1);
      expect(meta.foobar).toBeDefined();
      expect(meta.foobar.index).toBe(0);
      expect(meta.foobar.dimIndex).toBe(0);
      expect(meta.foobar.isDimension).toBe(false);

      dimensionInfo[1].qAttrExprInfo.push(attrExp1);
      dimensionInfo[1].qAttrExprInfo.push(attrExps2);
      dimensionInfo[1].qAttrDimInfo.push(attrDim1);
      dimensionInfo[1].qAttrDimInfo.push(attrDim1);

      meta = MetaUtils.getAttributesMeta(dimensionInfo[1], 1);
      expect(Object.keys(meta).length).toBe(2);
      expect(meta.foobar).toBeDefined();
      expect(meta.dummy).toBeDefined();
      expect(meta.dummy.index).toBe(1);
      expect(meta.dummy.dimIndex).toBe(1);
      expect(meta.dummy.isDimension).toBe(true);
    });
  });

  describe('getMinMax', () => {
    describe('getMinMax', () => {
      const attrExpsId1 = 'attrExpsId_1';
      it('should return a minMax when the attribute is an expression', () => {
        const attrExps1 = createDumpAttrExpr(attrExpsId1);
        const minMax = MetaUtils.getMinMax(attrExps1);
        expect(minMax?.min).toEqual(0);
        expect(minMax?.max).toEqual(10);
      });
      it('should not return a minMax when min isNaN', () => {
        const attrExps1 = createDumpAttrExpr(attrExpsId1);
        attrExps1.qMin = 'foobar' as any;
        const minMax = MetaUtils.getMinMax(attrExps1);
        expect(minMax).toBeUndefined();
      });
      it('should return a minMax when the attribute is an expression', () => {
        const attrExps1 = createDumpAttrExpr(attrExpsId1);
        attrExps1.qMax = 'foobar' as any;
        const minMax = MetaUtils.getMinMax(attrExps1);
        expect(minMax).toBeUndefined();
      });
    });
  });
});
