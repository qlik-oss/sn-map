import Utils from './utils';

export class SelectionModel {
  mapModel: MapModelInterFace;
  selections: Selections;
  selectedValues: number[];
  selectedFeatures: idevio.map.Feature[];
  path: string;
  selectedLayer: string;
  allowSelections: boolean;

  constructor(mapModel: MapModelInterFace, selections: Selections) {
    this.mapModel = mapModel;
    this.selections = selections;
    this.selectedValues = [];
    this.selectedFeatures = [];
    this.path = '';
    this.selectedLayer = '';
    this.allowSelections = true;
  }

  setAllowSelections(allowSelections: boolean) {
    this.allowSelections = allowSelections;
  }

  handleClick(feature: idevio.map.Feature) {
    const layerModels = this.mapModel.layers.models;
    const layerIndex = Utils.getLayerIndex(feature, layerModels);
    const layer = layerIndex !== null ? layerModels[layerIndex] : null;

    if (layer !== null) {
      if (!this.selections.isActive()) {
        this.path = `/gaLayers/${layer.index}/qHyperCubeDef`;
        this.selections.begin(this.path);
      }

      if (this.selectedLayer === '') {
        this.selectedLayer = layer.id;
      }

      if (layer.id === this.selectedLayer) {
        this.selectedValues = Utils.updateSelectedValues(feature, this.selectedValues);
        this.selectedLayer = this.selectedValues.length ? this.selectedLayer : '';

        this.selectedFeatures = Utils.updateSelectedFeatures(feature, this.selectedFeatures);
      }
    }

    return {
      path: this.path,
      values: this.selectedValues,
    };
  }

  resetSelections() {
    this.selectedLayer = '';
    this.path = '';
    this.selectedValues = [];
    this.selectedFeatures = [];
  }

  updateHighlight() {
    this.mapModel.map.setHighlighted(this.selectedFeatures);
  }
}
