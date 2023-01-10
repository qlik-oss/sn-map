import DataUtils from '../data';
import mockLayout from '../../mocks/layout';

jest.mock('../location');

describe('DataUtils', () => {
  let row: NxCell[];
  let meta: ExpressionMeta;

  beforeEach(() => {
    row = [
      {
        qElemNumber: 0,
        qText: 'foobar',
        qState: 'X',
      },
    ];
    meta = {
      id: 'foobar',
      index: 0,
      dimIndex: 0,
      isDimension: false,
      title: 'title',
      minValue: 0,
      maxValue: 1,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('getElementData', () => {
    it('should return element data', () => {
      let result = DataUtils.getElemData(row, 0);
      expect(result.id).toBe(0);
      result = DataUtils.getElemData(row, 1);
      expect(result.id).toBeNull();
    });
  });
  describe('getAttribute', () => {
    let cell: NxCell;

    beforeEach(() => {
      cell = {
        qElemNumber: 0,
        qState: 'S',
      };
    });

    it('should return empty object', () => {
      const data = DataUtils.getAttribute(row, meta);
      expect(data).toEqual({});
    });

    it('should return attribute expression data', () => {
      cell.qAttrExps = {
        qValues: [{ qNum: 1 }],
      };
      row = [cell];
      const data = DataUtils.getAttribute(row, meta);
      expect(data).toEqual({ foobar: 1 });
    });

    it('should return attribute dimension data', () => {
      cell.qAttrDims = {
        qValues: [{ qElemNo: 0, qText: 'foo' }],
      };
      meta.isDimension = true;
      row = [cell];
      const data = DataUtils.getAttribute(row, meta);
      expect(data).toEqual({ foobar: 'foo' });
    });

    it('should return empty object when meta is undefined', () => {
      row = [cell];
      const data = DataUtils.getAttribute(row, undefined);
      expect(data).toEqual({});
    });
  });

  describe('extractValue', () => {
    let value: NxSimpleValue;

    beforeEach(() => {
      value = {
        qNum: 1,
        qText: 'foobar',
      };
    });

    it('should return qNum', () => {
      const result = DataUtils.extractValue(value, meta);
      expect(result).toBe(1);
    });

    it('should return qText when no minValue or maxValue', () => {
      meta.minValue = undefined;
      meta.maxValue = undefined;
      const result = DataUtils.extractValue(value, meta);
      expect(result).toEqual('foobar');
    });

    it('should return undefined when qNum is NaN and no qText', () => {
      value = { qNum: 'string' };
      const result = DataUtils.extractValue(value, meta);
      expect(result).toBeUndefined();
    });
  });

  describe('flattenDataPages', () => {
    let dataPages: NxDataPage[];

    beforeEach(() => {
      dataPages = mockLayout.layer.base.qHyperCube.qDataPages;
    });
    it('should flatten data', () => {
      dataPages.push({
        qMatrix: [[{ qElemNumber: 0, qState: 'S' }], [{ qElemNumber: 1, qState: 'S' }]],
      });
      expect(dataPages.length).toBe(2);
      const result = DataUtils.flattenDataPages(dataPages);
      expect(result.qMatrix).toBeDefined();
      expect(result.qMatrix?.length).toBe(3);
    });
  });
});
