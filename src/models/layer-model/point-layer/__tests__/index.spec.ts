/**
 * @jest-environment jsdom
 */

import webmapMock from '../../../../mocks/webmap';
import layoutMock from '../../../../mocks/layout';
import mapModelMock from '../../../../mocks/map-model';
import LayoutService from '../../common/services/layout-service';
import DataUtils from '../../../../utils/data';

import { PointLayerModel } from '../';

jest.mock('../../common/dataset-model');
jest.mock('../models/symbol-model');
jest.mock('../../common/layer-model');
jest.mock('../../../../utils/data');

describe('Point model', () => {
  let pointLayerModel: PointLayerModel;
  let layout: PointLayerLayout;
  beforeEach(() => {
    global.idevio = webmapMock.idevio;
    layout = layoutMock.layer.point;
    pointLayerModel = new PointLayerModel(mapModelMock, layout.cId);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('update should call necessary functions', () => {
    pointLayerModel.setStyles = jest.fn();
    pointLayerModel.collectData = jest.fn();
    pointLayerModel.update(layout);

    expect(pointLayerModel.collectData).toHaveBeenCalledTimes(1);
    expect(pointLayerModel.datasetModel.update).toHaveBeenCalledTimes(1);
    expect(pointLayerModel.setStyles).toHaveBeenCalledTimes(1);
  });

  it('should set styles', () => {
    pointLayerModel.symbolModel.getStyles = jest.fn().mockImplementation(() => {
      return 'foobar';
    });
    pointLayerModel.setStyles();

    expect(pointLayerModel.symbolModel.getStyles).toHaveBeenCalledTimes(1);
    expect(pointLayerModel.layer.setStyles).toHaveBeenCalledWith('foobar');
  });

  it('should remove layer and dataset', () => {
    pointLayerModel.remove();

    expect(pointLayerModel.layer.remove).toHaveBeenCalledTimes(1);
    expect(pointLayerModel.datasetModel.remove).toHaveBeenCalledTimes(1);
  });

  describe('collectData', () => {
    let layoutService: LayoutService;
    beforeEach(() => {
      layout = JSON.parse(JSON.stringify(layoutMock.layer.point));
      layoutService = LayoutService.create(layout);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should collect data for each point from the dataPages', () => {
      DataUtils.getElemData = jest.fn().mockReturnValue({ id: 'foobar' });
      DataUtils.getGeometry = jest.fn().mockReturnValue({ geoname: 'Sweden' });
      DataUtils.getAttribute = jest.fn().mockReturnValue({ size: 22 });
      pointLayerModel.symbolModel.getSymbolKey = jest.fn().mockReturnValue('size');
      const row = layoutService.getDataPages()[0].qMatrix[0];
      const data = pointLayerModel.collectData(layoutService);

      expect(DataUtils.flattenDataPages).toHaveBeenCalledTimes(0);
      expect(DataUtils.getElemData).toHaveBeenCalledWith(row, 0);
      expect(DataUtils.getGeometry).toHaveBeenCalledWith(row, layoutService, 0);
      expect(DataUtils.getAttribute).toHaveBeenCalledWith(row, undefined);
      expect(data).toEqual([{ id: 'foobar', geoname: 'Sweden', size: 22, key: 'size' }]);
    });

    it('should flatten dataPage when it is an array', () => {
      DataUtils.flattenDataPages = jest.fn().mockReturnValue({ qMatrix: [] });
      layout.qHyperCube.qDataPages = [[{ qMatrix: [{}] }, { qMatrix: [{}] }], { qMatrix: [{}] }] as any;
      layoutService = LayoutService.create(layout);
      pointLayerModel.collectData(layoutService);
      expect(DataUtils.flattenDataPages).toHaveBeenCalledTimes(1);
      expect(DataUtils.getElemData).toHaveBeenCalledTimes(1);
    });
  });
});
