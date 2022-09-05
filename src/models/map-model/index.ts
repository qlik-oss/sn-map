import { getValue } from 'qlik-chart-modules';
import { BaseMapModel } from './models/base-map';
import { ToolsModel } from './models/tools';
import AutoZoomService from './services/auto-zoom-service';
import { LayersHandler } from '../layer-model';
import { AttributionModel } from './models/attribution';
import MapUtils from '../../utils/map';

export class MapModel implements MapModelInterFace {
  id: string;
  settings: MapSettings;
  map: idevio.map.WebMap;
  toolsModel: ToolsModel;
  baseMapModel: BaseMapModelInterface;
  attributionModel: AttributionModel;
  layers: LayersHandler;
  autoZoomService: AutoZoomService;
  parentDiv: HTMLElement;

  constructor(webMapElement: HTMLElement, layout: MapLayout) {
    this.id = layout.qInfo.qId;
    this.settings = layout.mapSettings;
    this.autoZoomService = new AutoZoomService();
    this.toolsModel = new ToolsModel();
    this.parentDiv = getValue(webMapElement, 'parentElement.parentElement');

    const wmOptions: idevio.map.WebMapOptions = {
      div: webMapElement,
      baseMap: 'empty',
      tools: [this.toolsModel.panTool, this.toolsModel.zoomTool],
      center: [30, 0],
      zoomLevel: 3,
    };

    this.map = new idevio.map.WebMap(wmOptions);
    this.baseMapModel = new BaseMapModel(this.map);
    this.attributionModel = new AttributionModel(this.map);
    this.toolsModel.setMap(this.map);
    this.toolsModel.createDebugLayer();
    this.layers = new LayersHandler(this);

    MapUtils.registerMap(this.id, this.map);

    this.update(layout);
    this.map.repaint();
  }

  setSettings(settings: MapSettings) {
    this.settings = settings;
  }

  async update(layout: MapLayout) {
    const mapSettings = getValue(layout, 'mapSettings');
    const gaLayers = getValue(layout, 'gaLayers');

    this.setSettings(mapSettings);

    this.baseMapModel.update(mapSettings);
    this.toolsModel.update(mapSettings);
    this.layers.update(gaLayers);

    await this.layers.done();
    await this.present();
  }

  async present() {
    await this.triggerZoom();
    this.presentationReady();
  }

  async triggerZoom() {
    const autoZoomOnSelection = getValue(this.settings, 'autoZoomOnSelection');
    if (!autoZoomOnSelection) return;
    const layerModels = this.layers.models;
    return this.autoZoomService.zoom(layerModels, this.map);
  }

  presentationReady() {
    if (this.parentDiv && !this.parentDiv.classList.contains('qv-map-rendered')) {
      this.parentDiv.classList.add('qv-map-rendered');
    }
  }

  destroy() {
    MapUtils.unregisterMap(this.id);
    this.layers.models.forEach((layerModel) => {
      layerModel.remove();
    });
    this.map.destroy();
  }
}
