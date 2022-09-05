/**
 * @jest-environment jsdom
 */

import mockLayout from '../../../mocks/layout';
import webmapMock from '../../../mocks/webmap';
import { MapModel } from '../';

jest.mock('../models/base-map');
jest.mock('../models/tools');
jest.mock('../services/auto-zoom-service');
jest.mock('../../layer-model');
jest.mock('../utils/view-bounds');
jest.mock('../../../utils/map');

describe('Map model', () => {
  let mapModel: MapModel;
  let parentDiv: HTMLElement;
  let mapContainer: HTMLElement;
  let webmapElement: HTMLElement;
  let layout: MapLayout;

  beforeEach(() => {
    global.idevio = webmapMock.idevio;
    parentDiv = document.createElement('div');
    mapContainer = document.createElement('div');
    webmapElement = document.createElement('div');
    mapContainer.appendChild(webmapElement);
    parentDiv.appendChild(mapContainer);
    mapModel = new MapModel(webmapElement, mockLayout.map);
    layout = JSON.parse(JSON.stringify(mockLayout.map));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should repaint map on construction', () => {
    expect(mapModel.map.repaint).toHaveBeenCalledTimes(1);
  });

  describe('setSettings', () => {
    it('should set settings', () => {
      expect(mapModel.settings.autoZoomOnSelection).toBe(false);
      layout.mapSettings.autoZoomOnSelection = true;
      mapModel.setSettings(layout.mapSettings);
      expect(mapModel.settings.autoZoomOnSelection).toBe(true);
    });
  });

  describe('update', () => {
    it('should call update functions', async () => {
      mapModel.baseMapModel.update = jest.fn();
      mapModel.toolsModel.update = jest.fn();
      mapModel.layers.update = jest.fn();
      mapModel.layers.done = jest.fn();
      mapModel.present = jest.fn();
      await mapModel.update(mockLayout.map);
      expect(mapModel.baseMapModel.update).toHaveBeenCalledTimes(1);
      expect(mapModel.toolsModel.update).toHaveBeenCalledTimes(1);
      expect(mapModel.layers.update).toHaveBeenCalledTimes(1);
      expect(mapModel.layers.done).toHaveBeenCalledTimes(1);
      expect(mapModel.present).toHaveBeenCalledTimes(1);
    });
  });

  describe('present', () => {
    it('should trigger zoom and waitForEvents', async () => {
      mapModel.triggerZoom = jest.fn();
      mapModel.presentationReady = jest.fn();
      await mapModel.present();
      expect(mapModel.triggerZoom).toHaveBeenCalledTimes(1);
      expect(mapModel.presentationReady).toHaveBeenCalledTimes(1);
    });
  });

  describe('triggerZoom', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should zoom when auto zoom is enabled', () => {
      mapModel.autoZoomService.zoom = jest.fn();
      layout.mapSettings.autoZoomOnSelection = true;
      mapModel.setSettings(layout.mapSettings);
      mapModel.triggerZoom();
      expect(mapModel.autoZoomService.zoom).toHaveBeenCalledTimes(1);
    });

    it('should not trigger zoom when auto zoom is disabled', () => {
      mapModel.autoZoomService.zoom = jest.fn();
      layout.mapSettings.autoZoomOnSelection = false;
      mapModel.setSettings(layout.mapSettings);
      mapModel.triggerZoom();
      expect(mapModel.autoZoomService.zoom).toHaveBeenCalledTimes(0);
    });
  });

  describe('presentationReady', () => {
    it('should add is rendered class to parentDiv if it is missing', () => {
      mapModel.presentationReady();
      expect(parentDiv.classList.contains('qv-map-rendered')).toBeTruthy();
    });
  });

  describe('destroy', () => {
    it('should call destroy', () => {
      mapModel.layers = {
        models: [{ remove: jest.fn() }],
      } as any;
      mapModel.destroy();
      expect(mapModel.map.destroy).toHaveBeenCalledTimes(1);
      expect(mapModel.layers.models[0].remove).toHaveBeenCalledTimes(1);
    });
  });
});
