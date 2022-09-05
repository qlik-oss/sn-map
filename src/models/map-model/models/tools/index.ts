import ScaleBarTool from './scale-bar';
import { getValue } from 'qlik-chart-modules';

export class ToolsModel {
  map?: idevio.map.WebMap;
  panTool: idevio.map.PanTool;
  zoomTool: idevio.map.ZoomTool;
  scaleBarTool: ScaleBarTool;
  debugLayer?: idevio.map.WebMapInfoLayer;

  constructor() {
    this.panTool = new idevio.map.PanTool({
      allowShift: true,
    });

    this.zoomTool = new idevio.map.ZoomTool();
    this.scaleBarTool = new ScaleBarTool();
  }

  setMap(map: idevio.map.WebMap) {
    this.map = map;
  }

  createDebugLayer() {
    if (!this.map) return;

    const options = {
      x: 40,
      y: 5,
      color: 'red',
      font: '12px monospace',
      name: 'Debug Info',
      drawOrder: 9999,
      loading: false,
      interacting: false,
      ratio: false,
      visible: false,
    };
    this.debugLayer = new idevio.map.WebMapInfoLayer(this.map, options);
  }

  update(mapSettings: MapSettings) {
    this.updateDebugLayer(mapSettings);
    this.updateScaleBar(mapSettings);
  }

  updateDebugLayer(mapSettings: MapSettings) {
    if (!this.debugLayer) return;
    const showDebugInfo = getValue(mapSettings, 'showDebugInfo', false);
    this.debugLayer!.setVisible(showDebugInfo);
  }

  updateScaleBar(mapSettings: MapSettings) {
    if (!this.map) return;
    this.scaleBarTool.useImperial = getValue(mapSettings, 'useImperialUnits', false);
    if (mapSettings.showScaleBar) {
      this.scaleBarTool.connectTo(this.map);
    } else {
      this.scaleBarTool.disconnect();
    }
  }
}
