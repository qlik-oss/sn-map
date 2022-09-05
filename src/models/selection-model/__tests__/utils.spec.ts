/**
 * @jest-environment jsdom
 */

import webmapMock from '../../../mocks/webmap';
import layerModelMock from '../../../mocks/layer-model';

import Utils from '../utils';

describe('Selection utils', () => {
  let feature: idevio.map.Feature;
  let layerModels: PointLayerModelInterface[];
  beforeEach(() => {
    feature = new webmapMock.idevio.map.Feature();
    layerModels = [layerModelMock.mockedPointLayerModel];
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getLayerIndex', () => {
    it('should return correct index', () => {
      feature.getDataset = jest.fn().mockReturnValue('foobar');
      layerModels[0].datasetModel = {
        dataset: 'foobar',
      };
      const index = Utils.getLayerIndex(feature, layerModels);
      expect(index).toBe(0);
    });
    it('should return null when can not find layer index', () => {
      feature.getDataset = jest.fn().mockReturnValue('foobar');
      const index = Utils.getLayerIndex(feature, []);
      expect(index).toBe(null);
    });
  });

  describe('updateSelectedValues', () => {
    it('should add value', () => {
      feature.getAttribute = jest.fn().mockReturnValue(1);
      const values = [0];
      const updatedValues = Utils.updateSelectedValues(feature, values);
      expect(updatedValues).toEqual([0, 1]);
    });

    it('should remove value', () => {
      feature.getAttribute = jest.fn().mockReturnValue(1);
      const values = [0, 1];
      const updatedValues = Utils.updateSelectedValues(feature, values);
      expect(updatedValues).toEqual([0]);
    });
  });

  describe('updateSelectedFeatures', () => {
    it('should add feature', () => {
      const updatedFeatures = Utils.updateSelectedFeatures(feature, []);
      expect(updatedFeatures).toEqual([feature]);
    });

    it('should remove feature', () => {
      const features = [feature];
      const updatedFeatures = Utils.updateSelectedFeatures(feature, features);
      expect(updatedFeatures).toEqual([]);
    });
  });
});
