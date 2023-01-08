/**
 * @jest-environment jsdom
 */

import mapModelMock from '../../../mocks/map-model';
import layerModelMock from '../../../mocks/layer-model';
import webmapMock from '../../../mocks/webmap';

import { SelectionModel } from '../index';
import Utils from '../utils/utils';

jest.mock('../utils/utils');

describe('SelectionModel', () => {
  let selectionsModel: SelectionModel;
  let feature: idevio.map.Feature;
  let selections: Selections;
  let processSelectionResult: { path: string; values: number[] };

  beforeEach(() => {
    selections = {
      begin: jest.fn(),
      isActive: jest.fn(),
      cancel: jest.fn(),
    };
    processSelectionResult = { path: '', values: [] };
    const processSelectionCallback = (path: string, values: []) => {
      processSelectionResult = { path, values };
    };
    mapModelMock.map = new webmapMock.idevio.map.WebMap();
    selectionsModel = new SelectionModel(mapModelMock, selections, processSelectionCallback);
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
      selectionsModel.handleClick(feature);
      expect(processSelectionResult.path).toBe('/gaLayers/1/qHyperCubeDef');
      expect(processSelectionResult.values).toEqual([0]);
      expect(Utils.getLayerIndex).toHaveBeenCalledTimes(1);
      expect(selectionsModel.selections.begin).toHaveBeenCalledTimes(1);
      expect(Utils.updateSelectedValues).toHaveBeenCalledTimes(1);
      expect(Utils.updateSelectedFeatures).toHaveBeenCalledTimes(1);
    });

    it('should not update selections when selecting a different layer', () => {
      selectionsModel.selections.isActive = jest.fn().mockReturnValue(true);
      selectionsModel.selectedLayerModel = { id: 'foobar' } as any;
      selectionsModel.handleClick(feature);
      expect(processSelectionResult.path).toBe('');
      expect(processSelectionResult.values).toEqual([]);
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
      expect(selectionsModel.selectedLayerModel?.id).toBe('foobar');

      Utils.updateSelectedValues = jest.fn().mockReturnValue([]);
      selectionsModel.handleClick(feature);
      expect(selectionsModel.selectedLayerModel?.id).toBe(undefined);
    });

    it('should return default when no layerModal', () => {
      Utils.getLayerIndex = jest.fn().mockReturnValue(null);
      selectionsModel.handleClick(feature);
      expect(processSelectionResult.path).toBe('');
      expect(processSelectionResult.values).toEqual([]);
      expect(Utils.getLayerIndex).toHaveBeenCalledTimes(1);
      expect(selectionsModel.selections.begin).toHaveBeenCalledTimes(0);
      expect(Utils.updateSelectedValues).toHaveBeenCalledTimes(0);
      expect(Utils.updateSelectedFeatures).toHaveBeenCalledTimes(0);
    });
  });

  describe('resetSelections', () => {
    it('should reset selections', () => {
      selectionsModel.path = 'foobar';
      selectionsModel.selectedLayerModel = { id: 'layer' } as any;
      selectionsModel.selectedValues = [0, 1];
      selectionsModel.selectedFeatures = [feature];
      selectionsModel.resetSelections();
      expect(selectionsModel.path).toBe('');
      expect(selectionsModel.selectedLayerModel?.id).toBe(undefined);
      expect(selectionsModel.selectedValues.length).toBe(0);
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
