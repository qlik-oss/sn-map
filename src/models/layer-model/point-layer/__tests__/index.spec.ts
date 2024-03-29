/**
 * @jest-environment jsdom
 */

import webmapMock from '../../../../mocks/webmap';
import layoutMock from '../../../../mocks/layout';
import mapModelMock from '../../../../mocks/map-model';
import LayoutService from '../../common/services/layout-service';
import DataUtils from '../../../../utils/data';
import LocationUtils from '../../../../utils/location';

import { PointLayerModel } from '../';

jest.mock('../../common/dataset-model');
jest.mock('../models/style-model');
jest.mock('../../common/layer-model');
jest.mock('../../../../utils/data');
jest.mock('../../../../utils/location');

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
    pointLayerModel.styleModel.getStyles = jest.fn().mockImplementation(() => {
      return 'foobar';
    });
    pointLayerModel.setStyles();

    expect(pointLayerModel.styleModel.getStyles).toHaveBeenCalledTimes(1);
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

    it('should call necessary functions for extracting data and modify dataset settings', () => {
      pointLayerModel.extractData = jest.fn();
      LocationUtils.getLocationKind = jest.fn().mockReturnValue('foobar_location');
      pointLayerModel.collectData(layoutService);

      expect(DataUtils.flattenDataPages).not.toHaveBeenCalled();
      expect(pointLayerModel.extractData).toHaveBeenCalledTimes(1);
      expect(LocationUtils.getLocationKind).toHaveBeenCalledTimes(1);
      expect(pointLayerModel.datasetModel.locationType).toBe('foobar_location');
    });

    it('should flatten dataPage it is an array', () => {
      pointLayerModel.extractData = jest.fn();
      DataUtils.flattenDataPages = jest.fn().mockReturnValue({ qMatrix: [{}] });
      layout.qHyperCube.qDataPages = [[{ qMatrix: [{}] }, { qMatrix: [{}] }], { qMatrix: [{}] }] as any;
      layoutService = LayoutService.create(layout);

      pointLayerModel.collectData(layoutService);
      expect(DataUtils.flattenDataPages).toHaveBeenCalledTimes(1);
      expect(pointLayerModel.extractData).toHaveBeenCalledTimes(2);
      expect(LocationUtils.getLocationKind).toHaveBeenCalledTimes(1);
    });
  });

  describe('extractData', () => {
    let layoutService: LayoutService;
    beforeEach(() => {
      layout = JSON.parse(JSON.stringify(layoutMock.layer.point));
      layoutService = LayoutService.create(layout);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should extract and return data', () => {
      const elem = {
        id: 0,
        dimensionValue: 'dimension',
        state: 'X',
      };
      DataUtils.getElemData = jest.fn().mockReturnValue(elem);
      DataUtils.getAttribute = jest.fn().mockReturnValue({ size: 10 });
      LocationUtils.getLocation = jest.fn();
      LocationUtils.getGeometry = jest.fn().mockReturnValue('Sweden');
      pointLayerModel.styleModel.getStyleKey = jest.fn().mockReturnValue('foobar_key');

      const result = pointLayerModel.extractData([], layoutService, 'NAMES');
      expect(result).toEqual({ geom: 'Sweden', attributes: { ...elem, size: 10, styleKey: 'foobar_key' } });
      expect(LocationUtils.getLocation).toHaveBeenCalledTimes(1);
    });
  });
});
