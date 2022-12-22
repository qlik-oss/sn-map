import Utils from '../utils';
import mockLayout, { createDumpAttrExpr, createDumpAttrDim } from '../../../../../mocks/layout';

describe('Layout service meta', () => {
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
      dimensionInfo[1].qAttrExprInfo.push(attrExps2);
      dimensionInfo[1].qAttrDimInfo.push(attrDim1);
      dimensionInfo[1].qAttrDimInfo.push(attrDim1);

      const meta = Utils.getAttributesMeta(dimensionInfo);
      expect(Object.keys(meta).length).toBe(2);
      expect(meta.foobar).toBeDefined();
      expect(meta.foobar.index).toBe(0);
      expect(meta.foobar.dimIndex).toBe(0);
      expect(meta.foobar.isDimension).toBe(false);

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
        const minMax = Utils.getMinMax(attrExps1);
        expect(minMax?.min).toEqual(0);
        expect(minMax?.max).toEqual(10);
      });
      it('should not return a minMax when min isNaN', () => {
        const attrExps1 = createDumpAttrExpr(attrExpsId1);
        attrExps1.qMin = 'foobar' as any;
        const minMax = Utils.getMinMax(attrExps1);
        expect(minMax).toBeUndefined();
      });
      it('should return a minMax when the attribute is an expression', () => {
        const attrExps1 = createDumpAttrExpr(attrExpsId1);
        attrExps1.qMax = 'foobar' as any;
        const minMax = Utils.getMinMax(attrExps1);
        expect(minMax).toBeUndefined();
      });
    });
  });
});
