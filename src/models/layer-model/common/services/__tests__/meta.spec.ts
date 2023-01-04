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

  describe('getHyperCubeMeta', () => {
    it('return meta about dimensions, measures and attributes', () => {
      const attrExp1 = createDumpAttrExpr('foo');
      const attrExp2 = createDumpAttrExpr('bar');
      const qDimensionInfo = [
        {
          qFallbackTitle: 'dimension1',
          qAttrExprInfo: [],
          qAttrDimInfo: [],
        },
        {
          qFallbackTitle: 'dimension2',
          qAttrExprInfo: [attrExp1],
          qAttrDimInfo: [],
        },
      ];
      const qMeasureInfo = [
        {
          qFallbackTitle: 'measure',
          qAttrExprInfo: [attrExp2],
          qAttrDimInfo: [],
          qMin: 0,
          qMax: 2,
        },
      ];
      const meta = MetaUtils.getHyperCubeMeta({ qDimensionInfo, qMeasureInfo } as any);

      expect(meta.dimensions.length).toBe(2);
      expect(meta.dimensions[0].title).toBe('dimension1');
      expect(meta.dimensions[0].rowIndex).toBe(0);
      expect(meta.dimensions[1].title).toBe('dimension2');
      expect(meta.dimensions[1].rowIndex).toBe(1);

      expect(meta.measures.length).toBe(1);
      expect(meta.measures[0].title).toBe('measure');
      expect(meta.measures[0].rowIndex).toBe(2);

      expect(meta.attributes).toHaveProperty('foo');
      expect(meta.attributes).toHaveProperty('bar');
    });
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
      it('should not return a minMax when max isNaN', () => {
        const attrExps1 = createDumpAttrExpr(attrExpsId1);
        attrExps1.qMax = 'foobar' as any;
        const minMax = MetaUtils.getMinMax(attrExps1);
        expect(minMax).toBeUndefined();
      });
    });
  });
});
