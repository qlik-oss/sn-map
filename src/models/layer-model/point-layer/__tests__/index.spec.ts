/**
 * @jest-environment jsdom
 */

import webmapMock from '../../../../mocks/webmap';
import layoutMock from '../../../../mocks/layout';
import mapModelMock from '../../../../mocks/map-model';

import { PointLayerModel } from '../';

jest.mock('../../common/data-model');
jest.mock('../../common/dataset-model');
jest.mock('../models/symbol-model');
jest.mock('../../common/layer-model');

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
    pointLayerModel.update(layout);

    expect(pointLayerModel.dataModel.update).toHaveBeenCalledTimes(1);
    expect(pointLayerModel.dataModel.getData).toHaveBeenCalledTimes(1);
    expect(pointLayerModel.symbolModel.addSymbolToData).toHaveBeenCalledTimes(1);
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
});
