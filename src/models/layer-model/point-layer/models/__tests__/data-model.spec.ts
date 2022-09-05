import { PointLayerDataModel } from '../data-model';
import DataUtils from '../../../common/utils/data-utils';
import layoutMock from '../../../../../mocks/layout';
import LayoutService from '../../services/layout-service';

describe('PointLayerDataModel', () => {
  let dataModel: PointLayerDataModel;
  let layout: PointLayerLayout;
  let layoutService: LayoutService;
  beforeEach(() => {
    dataModel = new PointLayerDataModel();
    layout = JSON.parse(JSON.stringify(layoutMock.layer.point));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call necessary functions on update', () => {
    dataModel.setData = jest.fn();
    dataModel.getPointData = jest.fn();
    layoutService = LayoutService.create(layout);
    dataModel.update(layoutService);
    expect(dataModel.setData).toHaveBeenCalled();
    expect(dataModel.getPointData).toHaveBeenCalled();
  });

  describe('getPointData', () => {
    it('should skip dataPages with no qMatrix', () => {
      dataModel.extractPointData = jest.fn();
      layout.qHyperCube.qDataPages.push({} as NxDataPage);
      layoutService = LayoutService.create(layout);
      const result = dataModel.getPointData(layoutService);
      expect(result.length).toBe(1);
      expect(dataModel.extractPointData).toHaveBeenCalledTimes(1);
    });

    it('should concat data when several dataPages', () => {
      dataModel.extractPointData = jest.fn().mockReturnValue(['data']);
      layout.qHyperCube.qDataPages.push({ qMatrix: [] });
      layoutService = LayoutService.create(layout);
      const result = dataModel.getPointData(layoutService);
      expect(result.length).toBe(2);
      expect(result).toEqual(['data', 'data']);
      expect(dataModel.extractPointData).toHaveBeenCalledTimes(2);
    });
  });

  describe('extractPointData', () => {
    let dataPage: NxDataPage;
    let meta: PointMeta;
    beforeEach(() => {
      dataPage = {
        qMatrix: [[{ qElemNumber: 0, qState: 'S' }], [{ qElemNumber: 1, qState: 'S' }]],
      };
      meta = {
        location: {
          expressions: [],
          isAuto: false,
          isLatLong: false,
          locationType: '',
        },
      };
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should not flatten data before extracting', () => {
      DataUtils.flattenDataPages = jest.fn().mockReturnValue([]);
      dataModel.extractPointData(dataPage, meta);
      expect(DataUtils.flattenDataPages).not.toHaveBeenCalled();
    });

    it('should flatten data before extracting', () => {
      DataUtils.flattenDataPages = jest.fn().mockReturnValue({ qMatrix: [] });
      dataModel.extractPointData(layout.qHyperCube.qDataPages, meta);
      expect(DataUtils.flattenDataPages).toHaveBeenCalled();
    });

    it('should extract data', () => {
      dataModel.getElemData = jest.fn().mockReturnValue({ id: 'data' });

      const result = dataModel.extractPointData(dataPage, meta);
      expect(result.length).toBe(2);
      expect(result).toEqual([
        { id: 'data', location: null },
        { id: 'data', location: null },
      ]);
    });

    it('should set null values when cell is null', () => {
      dataModel.getElemData = jest.fn();
      dataPage.qMatrix = [[null], [null]] as any;
      const result = dataModel.extractPointData(dataPage, meta);
      const expectedResult = [{ id: null }, { id: null }];
      expect(result.length).toBe(2);
      expect(result).toEqual(expectedResult);
      expect(dataModel.getElemData).not.toHaveBeenCalled();
    });
  });
});
