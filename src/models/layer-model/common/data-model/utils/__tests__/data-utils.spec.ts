import DataUtils from '../data-utils';

describe('DataUtils', () => {
  describe('getAttributeData', () => {
    let cell: NxCell;
    let meta: ExpressionMeta;

    beforeEach(() => {
      cell = {
        qElemNumber: 0,
        qState: 'S',
      };
      meta = {
        id: 'foobar',
        index: 0,
        dimIndex: 0,
        isDimension: false,
      };
    });

    it('should return empty object', () => {
      const data = DataUtils.getAttributeData(cell, meta);
      expect(data).toEqual({});
    });

    it('should return attribute expression data', () => {
      cell.qAttrExps = {
        qValues: [{ qNum: 1, qText: 'foo' }],
      };
      const data = DataUtils.getAttributeData(cell, meta);
      expect(data).toEqual({ foobar: 'foo' });
    });

    it('should return attribute dimension data', () => {
      cell.qAttrDims = {
        qValues: [{ qElemNo: 0, qText: 'foo' }],
      };
      meta.isDimension = true;
      const data = DataUtils.getAttributeData(cell, meta);
      expect(data).toEqual({ foobar: 'foo' });
    });
  });

  describe('extractAttributeDimension', () => {
    it('should return qText', () => {
      const value = { qText: 'foobar', qElemNo: 0 };
      const attrDim = DataUtils.extractAttributeDimension(value);
      expect(attrDim).toEqual('foobar');
    });

    it('should return null when no qText', () => {
      const value = { qElemNo: 0 };
      const attrDim = DataUtils.extractAttributeDimension(value);
      expect(attrDim).toBe(null);
    });
  });

  describe('extractAttributeExpression', () => {
    it('should return qText', () => {
      const value = { qText: 'foobar', qNum: 0 };
      const attrExpr = DataUtils.extractAttributeExpression(value);
      expect(attrExpr).toEqual('foobar');
    });

    it('should return qNum', () => {
      const value = { qNum: 0 };
      const attrExpr = DataUtils.extractAttributeExpression(value);
      expect(attrExpr).toEqual(0);
    });

    it('should return null when no qText', () => {
      const value = { qNum: 'NaN' };
      const attrExpr = DataUtils.extractAttributeExpression(value);
      expect(attrExpr).toBe(null);
    });
  });
});
