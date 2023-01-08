import { PointLayerModel } from './point-layer/';
import { GeodataLayerModel } from './geodata-layer/';
import { UnknownLayerModel } from './unkown-layer';
import { getValue } from 'qlik-chart-modules';

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
      case 'PointLayer':
        return new PointLayerModel(this.mapModel, layerLayout.cId);
      case 'GeodataLayer':
        return new GeodataLayerModel(this.mapModel, layerLayout.cId);
      default:
        return new UnknownLayerModel(this.mapModel, layerLayout.cId);
    }
  }

  updateLayerModel(layerModel: GaLayersModelInterface, layerLayout: GaLayersLayout) {
    switch (layerLayout.type) {
      case 'PointLayer':
        (layerModel as PointLayerModel).update(layerLayout as PointLayerLayout);
        break;
      case 'GeodataLayer':
        (layerModel as GeodataLayerModel).update(layerLayout as GeodataLayerProperties);
        break;
    }
  }

  cleanLayerModels() {
    [...this.models].forEach((layer) => {
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

  /**
   * Checks if any of the maps layers has features.
   * @param ignoreExcludedFromAutoZoom if true will ignore layers which have exclFromAutozoom set to true.
   */
  hasFeatures(ignoreExcludedFromAutoZoom: boolean) {
    if (!this.models || this.models.length === 0) {
      return false;
    }

    let hasFeatures = false;
    for (let i = 0; i < this.models.length; i++) {
      const datasetModel = getValue(this.models[i], 'datasetModel', false);
      if (ignoreExcludedFromAutoZoom && datasetModel.layout.exclFromAutozoom) {
        continue;
      }
      if (datasetModel.hasFeatures()) {
        hasFeatures = true;
        break;
      }
    }

    return hasFeatures;
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
