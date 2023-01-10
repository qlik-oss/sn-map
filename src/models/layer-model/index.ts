import { getValue } from 'qlik-chart-modules';
import { PointLayerModel } from './point-layer/';
import { GeodataLayerModel } from './geodata-layer/';
import { UnknownLayerModel } from './unkown-layer';
import LayerType from '../../utils/const/layer-type';
import { AreaLayerModel } from './area-layer';

export class LayersHandler {
  mapModel: MapModelInterFace;
  models: GaLayersModelInterface[];
  layerIds: string[];

  constructor(mapModel: MapModelInterFace) {
    this.mapModel = mapModel;
    this.models = [];
    this.layerIds = [];
  }

  update(gaLayers: GaLayersLayout[]) {
    this.layerIds = [];
    this.updateAllLayerModels(gaLayers);
    this.cleanLayerModels();
    this.reOrderLayers();
  }

  updateAllLayerModels(gaLayers: GaLayersLayout[]) {
    gaLayers.forEach((layerLayout: GaLayersLayout) => {
      const id = layerLayout.cId;
      this.layerIds.push(id);
      const layerModel = this.findLayer(id);
      if (!layerModel) {
        const newLayerModel = this.createLayerModel(layerLayout);
        this.addLayer(newLayerModel);
      } else {
        this.updateLayerModel(layerModel, layerLayout);
      }
    });
  }

  findLayer(id: string) {
    return this.models.filter((layer) => layer.id === id)[0];
  }

  createLayerModel(layerLayout: GaLayersLayout) {
    switch (layerLayout.type) {
      case LayerType.AREA:
        return new AreaLayerModel(this.mapModel, layerLayout.cId);
      case LayerType.POINT:
        return new PointLayerModel(this.mapModel, layerLayout.cId);
      case LayerType.GEODATA:
        return new GeodataLayerModel(this.mapModel, layerLayout.cId);
      default:
        return new UnknownLayerModel(this.mapModel, layerLayout.cId);
    }
  }

  updateLayerModel(layerModel: GaLayersModelInterface, layerLayout: GaLayersLayout) {
    switch (layerLayout.type) {
      case LayerType.AREA:
      case LayerType.POINT:
      case LayerType.GEODATA:
        layerModel.update(layerLayout as any);
        break;
    }
  }

  cleanLayerModels() {
    this.models.forEach((layer) => {
      if (this.layerIds.indexOf(layer.id) === -1) {
        this.removeLayer(layer);
      }
    });
  }

  addLayer(layer: GaLayersModelInterface) {
    if (this.models.indexOf(layer) === -1) {
      this.models.push(layer);
    }
  }

  removeLayer(layer: GaLayersModelInterface) {
    const index = this.models.indexOf(layer);
    if (index !== -1) {
      this.models.splice(index, 1);
      layer.remove();
    }
  }

  reOrderLayers() {
    this.layerIds.forEach((id, index) => {
      const layerModel = this.findLayer(id);
      layerModel.setIndex(index);
    });
  }

  async done() {
    const promises: PromiseInterface[] = [];
    this.models.forEach((layer) => {
      const datasetModel = getValue(layer, 'datasetModel', false);
      if (datasetModel) {
        promises.push(datasetModel.loading);
      }
    });
    return Promise.all(promises);
  }
}
