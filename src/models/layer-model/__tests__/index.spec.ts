/**
 * @jest-environment jsdom
 */

import { LayersHandler } from '../';
import layoutMock from '../../../mocks/layout';
import webmapMock from '../../../mocks/webmap';
import mapModelMock from '../../../mocks/map-model';
import { GeodataLayerModel } from '../geodata-layer';

import { PointLayerModel } from '../point-layer/';
import { UnknownLayerModel } from '../unkown-layer';
import { AreaLayerModel } from '../area-layer';

describe('Layer models', () => {
  let layout: PointLayerLayout;
  let layerHandler: LayersHandler;

  global.idevio = webmapMock.idevio;

  beforeEach(() => {
    layout = { ...layoutMock.layer.point };
    layerHandler = new LayersHandler(mapModelMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('update', () => {
    it('should call necessary functions', () => {
      layerHandler.createLayerModel = jest.fn();
      layerHandler.cleanLayerModels = jest.fn();
      layerHandler.reOrderLayers = jest.fn();
      layerHandler.update(layoutMock.map.gaLayers);
      expect(layerHandler.createLayerModel).toHaveBeenCalled();
      expect(layerHandler.cleanLayerModels).toHaveBeenCalled();
      expect(layerHandler.reOrderLayers).toHaveBeenCalled();
    });
  });

  describe('updateAllLayerModels', () => {
    it('should add layer when layer is missing', () => {
      layerHandler.createLayerModel = jest.fn().mockReturnValue('foobar');
      layerHandler.findLayer = jest.fn().mockReturnValue(false);
      layerHandler.addLayer = jest.fn();
      const gaLayers = [layoutMock.layer.point];
      layerHandler.updateAllLayerModels(gaLayers);
      expect(layerHandler.addLayer).toHaveBeenCalledWith('foobar');
    });

    it('should update layer when layer exist', () => {
      const layerModel = {};
      layerHandler.findLayer = jest.fn().mockReturnValue(layerModel);
      layerHandler.updateLayerModel = jest.fn();
      const gaLayers = [layoutMock.layer.point];
      layerHandler.updateAllLayerModels(gaLayers);
      expect(layerHandler.updateLayerModel).toHaveBeenCalled();
    });
  });

  describe('updateLayerModel', () => {
    it('should update layer when valid type', () => {
      const layerModel = {
        type: 'PointLayer',
        update: jest.fn(),
      } as any;
      const layout = layoutMock.layer.point;
      layerHandler.updateLayerModel(layerModel, layout);
      expect(layerModel.update).toHaveBeenCalled();
    });

    it('should not update layer when invalid type', () => {
      const layerModel = {
        type: 'Unknown',
        update: jest.fn(),
      } as any;
      const layout = { type: 'Unknown' } as any;
      layerHandler.updateLayerModel(layerModel, layout);
      expect(layerModel.update).not.toHaveBeenCalled();
    });
  });

  describe('findLayer', () => {
    it('should return layer', () => {
      layerHandler.models = [
        {
          id: 'foobar',
        } as any,
      ];
      const result = layerHandler.findLayer('foobar');
      expect(result.id).toBe('foobar');
    });

    it('should not return layer', () => {
      layerHandler.models = [
        {
          id: 'foobar',
        } as any,
      ];
      const result = layerHandler.findLayer('dummy');
      expect(result).toBeUndefined();
    });
  });

  describe('createLayerModel', () => {
    it('should return unknown layer when wrong type', () => {
      layout.type = 'undefined';
      const layer = layerHandler.createLayerModel(layout);
      expect(layer).toBeInstanceOf(UnknownLayerModel);
    });

    it('should return a area layer model', () => {
      layout.type = 'AreaLayer';
      const layer = layerHandler.createLayerModel(layout);
      expect(layer).toBeInstanceOf(AreaLayerModel);
    });

    it('should return a point layer model', () => {
      const layer = layerHandler.createLayerModel(layout);
      expect(layer).toBeInstanceOf(PointLayerModel);
    });

    it('should return a geodata layer model', () => {
      layout.type = 'GeodataLayer';
      const layer = layerHandler.createLayerModel(layout);
      expect(layer).toBeInstanceOf(GeodataLayerModel);
    });
  });

  describe('cleanLayerModels', () => {
    it('should remove layers that do not match layerIds', () => {
      layerHandler.models = [
        {
          id: 'foo',
          remove: jest.fn(),
        } as any,
        {
          id: 'bar',
          remove: jest.fn(),
        } as any,
      ];
      layerHandler.layerIds = ['bar', 'dummy'];
      layerHandler.cleanLayerModels();
      expect(layerHandler.models.length).toBe(1);
      expect(layerHandler.models[0].id).toBe('bar');
    });
  });

  describe('addLayer', () => {
    it('should add layer', () => {
      layerHandler.addLayer('foobar' as any);
      expect(layerHandler.models.length).toBe(1);
      expect(layerHandler.models[0]).toBe('foobar');
    });

    it('should not add existing layer', () => {
      const layer = {
        id: 'foobar',
      } as any;
      layerHandler.models = [layer];
      layerHandler.addLayer(layer);
      expect(layerHandler.models.length).toBe(1);
      expect(layerHandler.models[0].id).toBe('foobar');
    });
  });

  describe('removeLayer', () => {
    it('should remove layer', () => {
      const layer1 = {
        id: 'foo',
        remove: jest.fn(),
      } as any;

      const layer2 = {
        id: 'bar',
        remove: jest.fn(),
      } as any;

      layerHandler.models = [layer1, layer2];
      layerHandler.removeLayer(layer1);
      expect(layerHandler.models.length).toBe(1);
      expect(layerHandler.models[0]).toBe(layer2);
      expect(layer1.remove).toHaveBeenCalled();
    });
  });

  describe('reOrderLayers', () => {
    it('should set layer index so they match layerIds', () => {
      const layer1 = {
        id: 'foo',
        setIndex: jest.fn(),
      } as any;

      const layer2 = {
        id: 'bar',
        setIndex: jest.fn(),
      } as any;

      layerHandler.models = [layer1, layer2];
      layerHandler.layerIds = ['bar', 'foo'];
      layerHandler.reOrderLayers();
      expect(layerHandler.models[0].setIndex).toHaveBeenCalledWith(1);
      expect(layerHandler.models[1].setIndex).toHaveBeenCalledWith(0);
    });
  });

  describe('done', () => {
    it('should collect all layer promises', async () => {
      const layer1 = {
        datasetModel: {
          loading: jest.fn(async () => Promise.resolve('foo')),
        },
      } as any;

      const layer2 = {
        datasetModel: {
          loading: jest.fn(async () => Promise.resolve('bar')),
        },
      } as any;

      const layer3 = {} as any;

      layerHandler.models = [layer1, layer2, layer3];
      const promises = await layerHandler.done();
      expect(promises.length).toBe(2);
    });
  });
});
