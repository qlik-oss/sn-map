/**
 * @jest-environment jsdom
 */

import webmapMock from '../../../../mocks/webmap';
import layoutMock from '../../../../mocks/layout';
import mapModelMock from '../../../../mocks/map-model';
import LayoutService from '../../common/services/layout-service';
import DataUtils from '../../../../utils/data';
import LocationUtils from '../../../../utils/location';

import { AreaLayerModel } from '../';

jest.mock('../../common/dataset-model');
jest.mock('../models/style-model');
jest.mock('../../common/layer-model');
jest.mock('../../../../utils/data');
jest.mock('../../../../utils/location');

describe('Area model', () => {
  let areaLayerModel: AreaLayerModel;
  let layout: AreaLayerLayout;
  beforeEach(() => {
    global.idevio = webmapMock.idevio;
    layout = layoutMock.layer.area;
    areaLayerModel = new AreaLayerModel(mapModelMock, layout.cId);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('update should call necessary functions', () => {
    areaLayerModel.setStyles = jest.fn();
    areaLayerModel.collectData = jest.fn();
    areaLayerModel.update(layout);

    expect(areaLayerModel.collectData).toHaveBeenCalledTimes(1);
    expect(areaLayerModel.datasetModel.update).toHaveBeenCalledTimes(1);
    expect(areaLayerModel.setStyles).toHaveBeenCalledTimes(1);
  });

  it('should set styles', () => {
    areaLayerModel.styleModel.getStyles = jest.fn().mockImplementation(() => {
      return 'foobar';
    });
    areaLayerModel.setStyles();

    expect(areaLayerModel.styleModel.getStyles).toHaveBeenCalledTimes(1);
    expect(areaLayerModel.layer.setStyles).toHaveBeenCalledWith('foobar');
  });

  it('should remove layer and dataset', () => {
    areaLayerModel.remove();

    expect(areaLayerModel.layer.remove).toHaveBeenCalledTimes(1);
    expect(areaLayerModel.datasetModel.remove).toHaveBeenCalledTimes(1);
  });

  describe('collectData', () => {
    let layoutService: LayoutService;
    beforeEach(() => {
      layout = JSON.parse(JSON.stringify(layoutMock.layer.area));
      layoutService = LayoutService.create(layout);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call necessary functions for extracting data and modify dataset settings', () => {
      areaLayerModel.extractData = jest.fn();
      LocationUtils.getLocationKind = jest.fn().mockReturnValue('foobar_location');
      areaLayerModel.collectData(layoutService);

      expect(DataUtils.flattenDataPages).not.toHaveBeenCalled();
      expect(areaLayerModel.extractData).toHaveBeenCalledTimes(1);
      expect(LocationUtils.getLocationKind).toHaveBeenCalledTimes(1);
      expect(areaLayerModel.datasetModel.locationType).toBe('foobar_location');
    });

    it('should flatten dataPage it is an array', () => {
      areaLayerModel.extractData = jest.fn();
      DataUtils.flattenDataPages = jest.fn().mockReturnValue({ qMatrix: [{}] });
      layout.qHyperCube.qDataPages = [[{ qMatrix: [{}] }, { qMatrix: [{}] }], { qMatrix: [{}] }] as any;
      layoutService = LayoutService.create(layout);

      areaLayerModel.collectData(layoutService);
      expect(DataUtils.flattenDataPages).toHaveBeenCalledTimes(1);
      expect(areaLayerModel.extractData).toHaveBeenCalledTimes(2);
      expect(LocationUtils.getLocationKind).toHaveBeenCalledTimes(1);
    });
  });

  describe('extractData', () => {
    let layoutService: LayoutService;
    beforeEach(() => {
      layout = JSON.parse(JSON.stringify(layoutMock.layer.area));
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
      LocationUtils.getLocation = jest.fn();
      LocationUtils.getGeometry = jest.fn().mockReturnValue('Sweden');
      areaLayerModel.styleModel.getStyleKey = jest.fn().mockReturnValue('foobar_key');

      const result = areaLayerModel.extractData([], layoutService, 'NAMES');
      expect(result).toEqual({ geom: 'Sweden', attributes: { ...elem, styleKey: 'foobar_key' } });
      expect(LocationUtils.getLocation).toHaveBeenCalledTimes(1);
    });
  });
});
