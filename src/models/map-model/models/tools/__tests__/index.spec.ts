import { ToolsModel } from '..';
import webmapMock from '../../../../../mocks/webmap';
import layoutMock from '../../../../../mocks/layout';

jest.mock('../scale-bar');

describe('Tools model', () => {
  let toolsModel: ToolsModel;
  let map: idevio.map.WebMap;
  let settings: MapSettings;
  beforeEach(() => {
    global.idevio = webmapMock.idevio;
    toolsModel = new ToolsModel();
    map = new webmapMock.idevio.map.WebMap();
    settings = JSON.parse(JSON.stringify(layoutMock.map)).mapSettings;
    toolsModel.setMap(map);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should set tools', () => {
      expect(toolsModel.panTool).toBeDefined();
      expect(toolsModel.zoomTool).toBeDefined();
      expect(toolsModel.scaleBarTool).toBeDefined();
      expect(toolsModel.debugLayer).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update tools', () => {
      toolsModel.createDebugLayer();
      toolsModel.update(settings);
      expect(toolsModel.debugLayer?.setVisible).toHaveBeenCalledTimes(1);
      expect(toolsModel.scaleBarTool.connectTo).toHaveBeenCalledTimes(1);
    });
  });

  describe('setMap', () => {
    it('should set map', () => {
      toolsModel.map = undefined;
      expect(toolsModel.map).toBeUndefined();
      toolsModel.setMap(map);
      expect(toolsModel.map).toBeDefined();
    });
  });

  describe('createDebugLayer', () => {
    it('should create a debug layer', () => {
      expect(toolsModel.debugLayer).toBeUndefined();
      toolsModel.createDebugLayer();
      expect(toolsModel.debugLayer).toBeDefined();
    });

    it('should not create a debug layer when map is undefined', () => {
      toolsModel.map = undefined;
      expect(toolsModel.debugLayer).toBeUndefined();
      toolsModel.createDebugLayer();
      expect(toolsModel.debugLayer).toBeUndefined();
    });
  });

  describe('updateDebugLayer', () => {
    it('should be called with false', () => {
      settings.showDebugInfo = false;
      toolsModel.debugLayer = { setVisible: jest.fn() } as any;
      toolsModel.updateDebugLayer(settings);
      expect(toolsModel.debugLayer?.setVisible).toHaveBeenCalledWith(false);
    });

    it('should be called with true', () => {
      settings.showDebugInfo = true;
      toolsModel.debugLayer = { setVisible: jest.fn() } as any;
      toolsModel.updateDebugLayer(settings);
      expect(toolsModel.debugLayer?.setVisible).toHaveBeenCalledWith(true);
    });

    it('should skip when debuglayer is undefined', () => {
      settings.showDebugInfo = false;
      const emptyReturn = toolsModel.updateDebugLayer(settings);
      expect(emptyReturn).toBeUndefined();
    });
  });

  describe('updateScaleBar', () => {
    it('should use imperial units', () => {
      settings.useImperialUnits = true;
      toolsModel.updateScaleBar(settings);
      expect(toolsModel.scaleBarTool.useImperial).toBe(true);
    });

    it('should not use imperial units', () => {
      settings.useImperialUnits = false;
      toolsModel.updateScaleBar(settings);
      expect(toolsModel.scaleBarTool.useImperial).toBe(false);
    });

    it('should call connectTo', () => {
      settings.showScaleBar = true;
      toolsModel.updateScaleBar(settings);
      expect(toolsModel.scaleBarTool.connectTo).toHaveBeenCalledTimes(1);
    });

    it('should call disconnect', () => {
      settings.showScaleBar = false;
      toolsModel.updateScaleBar(settings);
      expect(toolsModel.scaleBarTool.disconnect).toHaveBeenCalledTimes(1);
    });

    it('should skip when map is undefined', () => {
      toolsModel.map = undefined;
      settings.showScaleBar = true;
      toolsModel.updateScaleBar(settings);
      expect(toolsModel.scaleBarTool.connectTo).toHaveBeenCalledTimes(0);
    });
  });
});
