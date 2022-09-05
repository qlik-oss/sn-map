/**
 * @jest-environment jsdom
 */

import { LayerModel } from '../';
import webmapMock from '../../../../../mocks/webmap';

class MockedLayer extends LayerModel {
  layer: idevio.map.FeatureLayer;

  constructor(map: any) {
    super(map);
    this.layer = new idevio.map.FeatureLayer(map);
  }

  update() {}
}

describe('LayerModel', () => {
  let map: idevio.map.WebMap;
  let layerModel: LayerModel;

  global.idevio = webmapMock.idevio;

  beforeEach(() => {
    const div = document.createElement('div');
    map = new idevio.map.WebMap({ div });
    layerModel = new MockedLayer(map);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('setIndex', () => {
    it('should set index and set draw order', () => {
      layerModel.setIndex(0);
      expect(layerModel.index).toBe(0);
      expect(layerModel.layer.setDrawOrder).toHaveBeenCalledWith(100);
    });
  });
});
