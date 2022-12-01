/**
 * @jest-environment jsdom
 */

import mapModelMock from '../../../mocks/map-model';
import layerModelMock from '../../../mocks/layer-model';
import webmapMock from '../../../mocks/webmap';

import { SelectionModel } from '../index';
import Utils from '../utils/utils';

jest.mock('../utils');

describe('SelectionModel', () => {
  let selectionsModel: SelectionModel;
  let feature: idevio.map.Feature;
  let selections: Selections;

  beforeEach(() => {
    selections = {
      begin: jest.fn(),
      isActive: jest.fn(),
      cancel: jest.fn(),
    };
    mapModelMock.map = new webmapMock.idevio.map.WebMap();
    selectionsModel = new SelectionModel(mapModelMock, selections);
    feature = new webmapMock.idevio.map.Feature();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('setAllowSelections', () => {
    it('should set allowSelections', () => {
      expect(selectionsModel.allowSelections).toBe(true);
      selectionsModel.setAllowSelections(false);
      expect(selectionsModel.allowSelections).toBe(false);
    });
  });

  describe('handleClick', () => {
    beforeEach(() => {
      selectionsModel.mapModel.layers = {
        models: [layerModelMock],
      };
      Utils.getLayerIndex = jest.fn().mockReturnValue(0);
      Utils.updateSelectedValues = jest.fn().mockReturnValue([0]);
      Utils.updateSelectedFeatures = jest.fn().mockReturnValue([feature]);
    });

    it('should return selected layer path and values', () => {
      selectionsModel.selections.isActive = jest.fn().mockReturnValue(false);
      selectionsModel.mapModel.layers.models[0].index = 1;
      const result = selectionsModel.handleClick(feature);
      expect(result.path).toBe('/gaLayers/1/qHyperCubeDef');
      expect(result.values).toEqual([0]);
      expect(Utils.getLayerIndex).toHaveBeenCalledTimes(1);
      expect(selectionsModel.selections.begin).toHaveBeenCalledTimes(1);
      expect(Utils.updateSelectedValues).toHaveBeenCalledTimes(1);
      expect(Utils.updateSelectedFeatures).toHaveBeenCalledTimes(1);
    });

    it('should not update selections when selecting a different layer', () => {
      selectionsModel.selections.isActive = jest.fn().mockReturnValue(true);
      selectionsModel.selectedLayer = 'foobar';
      const result = selectionsModel.handleClick(feature);
      expect(result.path).toBe('');
      expect(result.values).toEqual([]);
      expect(Utils.getLayerIndex).toHaveBeenCalledTimes(1);
      expect(selectionsModel.selections.begin).toHaveBeenCalledTimes(0);
      expect(Utils.updateSelectedValues).toHaveBeenCalledTimes(0);
      expect(Utils.updateSelectedFeatures).toHaveBeenCalledTimes(0);
    });

    it('should reset selected layer when no selected values', () => {
      Utils.updateSelectedValues = jest.fn().mockReturnValue([0]);
      selectionsModel.selections.isActive = jest.fn().mockReturnValue(true);
      selectionsModel.mapModel.layers.models[0] = { id: 'foobar' } as any;
      selectionsModel.handleClick(feature);
      expect(selectionsModel.selectedLayer).toBe('foobar');

      Utils.updateSelectedValues = jest.fn().mockReturnValue([]);
      selectionsModel.handleClick(feature);
      expect(selectionsModel.selectedLayer).toBe('');
    });

    it('should return default when no layerModal', () => {
      Utils.getLayerIndex = jest.fn().mockReturnValue(null);
      const result = selectionsModel.handleClick(feature);
      expect(result.path).toBe('');
      expect(result.values).toEqual([]);
      expect(Utils.getLayerIndex).toHaveBeenCalledTimes(1);
      expect(selectionsModel.selections.begin).toHaveBeenCalledTimes(0);
      expect(Utils.updateSelectedValues).toHaveBeenCalledTimes(0);
      expect(Utils.updateSelectedFeatures).toHaveBeenCalledTimes(0);
    });
  });

  describe('resetSelections', () => {
    it('should reset selections', () => {
      selectionsModel.path = 'foobar';
      selectionsModel.selectedLayer = 'layer';
      selectionsModel.selectedValues = [0, 1];
      selectionsModel.selectedFeatures = [feature];
      selectionsModel.resetSelections();
      expect(selectionsModel.path).toBe('');
      expect(selectionsModel.selectedLayer).toBe('');
      expect(selectionsModel.selectedLayer.length).toBe(0);
      expect(selectionsModel.selectedFeatures.length).toBe(0);
    });
  });

  describe('updateHighlights', () => {
    it('should call setHighlighted', () => {
      selectionsModel.updateHighlight();
      expect(selectionsModel.mapModel.map.setHighlighted).toHaveBeenCalledTimes(1);
    });
  });
});
