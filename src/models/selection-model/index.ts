import Utils from './utils';

export class SelectionModel {
  mapModel: MapModelInterFace;
  selections: Selections;
  selectedValues: number[];
  selectedFeatures: idevio.map.Feature[];
  path: string;
  selectedLayer: string;
  allowSelections: boolean;
  selectionToolbar: SelectionToolbar;

  constructor(mapModel: MapModelInterFace, selections: Selections) {
    this.mapModel = mapModel;
    this.selections = selections;
    this.selectedValues = [];
    this.selectedFeatures = [];
    this.path = '';
    this.selectedLayer = '';
    this.allowSelections = true;
    this.selectionToolbar = {};
  }

  setAllowSelections(allowSelections: boolean) {
    this.allowSelections = allowSelections;
  }

  setSelectionToolbar(selectionToolbar: SelectionToolbar) {
    this.selectionToolbar = selectionToolbar;
  }

  handleClick(feature: idevio.map.Feature) {
    console.log('handleClickSelections');
    if (feature) {
      const layerModels = this.mapModel.layers.models;
      const layerIndex = Utils.getLayerIndex(feature, layerModels);
      const layer = layerIndex !== null ? layerModels[layerIndex] : null;

      if (layer !== null) {
        if (!this.selections.isActive() || this.selectedLayer === '') {
          if (this.selectedLayer === '') {
            this.selectedLayer = layer.id;
            this.selections.cancel();
          }
          this.path = `/gaLayers/${layer.index}/qHyperCubeDef`;
          this.selections.begin(this.path);
        }

        if (layer.id === this.selectedLayer) {
          this.selectedValues = Utils.updateSelectedValues(feature, this.selectedValues);
          this.selectedLayer = this.selectedValues.length ? this.selectedLayer : '';
          this.selectedFeatures = Utils.updateSelectedFeatures(feature, this.selectedFeatures);
        }
      }
    } else if (!this.selections.isActive()) {
      const selectionList: string[] = [];
      this.mapModel.layers.models.map((_layerModel: any, index: number) => {
        selectionList.push(`/gaLayers/${index}/qHyperCubeDef`);
      });
      this.selections.begin(selectionList);
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
