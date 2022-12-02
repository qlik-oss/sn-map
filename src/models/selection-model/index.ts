import Utils from './utils/utils';
import Lasso from './tools/Lasso';
import Circle from './tools/Circle';
import { SelectionToolTypes } from './utils/const/selection-tools';
import SelectUtils from './utils/select-utils';

export class SelectionModel {
  mapModel: MapModelInterFace;
  selections: Selections;
  selectedValues: number[];
  selectedFeatures: idevio.map.Feature[];
  path: string;
  selectedLayerModel?: PointLayerModelInterface;
  allowSelections: boolean;
  selectionToolbar: SelectionToolbar;
  pressEvent: any;
  lasso: Lasso;
  circle: Circle;
  processSelectionCallback: Function;

  constructor(mapModel: MapModelInterFace, selections: Selections, processSelectionCallback: Function) {
    this.mapModel = mapModel;
    this.selections = selections;
    this.selectedValues = [];
    this.selectedFeatures = [];
    this.path = '';
    this.selectedLayerModel = undefined;
    this.allowSelections = true;
    this.selectionToolbar = {};
    this.pressEvent = undefined;
    this.lasso = new Lasso(mapModel, (features) => this.processSelection(features));
    this.circle = new Circle(mapModel, (features) => this.processSelection(features));
    this.processSelectionCallback = processSelectionCallback;
  }

  /**
   * Returns the active selection tool or null if none is active.
   */
  getActiveSelectionTool(): Lasso | Circle | null {
    if (this.selectionToolbar.activeTool === SelectionToolTypes.LASSO) {
      return this.lasso;
    } else if (this.selectionToolbar.activeTool === SelectionToolTypes.CIRCLE) {
      return this.circle;
    }
    return null;
  }

  processSelection(features: idevio.map.Feature[]) {
    if (features.length > 0) {
      if (!this.selectedLayerModel) {
        let layerFound = false;
        for (let i = 0; i < features.length; i++) {
          const layer = SelectUtils.getLayerFromFeature(features[i], this.mapModel);
          // ToDo: figure out what layout.layerSelectionsDisabled is all about
          // if(layer) { layerFound = !layer.isSelectionsDisabled(); }
          if (layer) {
            layerFound = true;
            this.setSelectedLayer(layer);
            break;
          }
        }
        if (!layerFound) {
          return;
        }
      }

      // ToDo: When we introduce the dropdown to switch between layers during a selection,
      // we need to keep track of all the selected values before filtering for the current layer
      const selectedLayerFeatures: idevio.map.Feature[] = features.filter((feature) => {
        return feature.getDataset() === this.selectedLayerModel?.datasetModel.dataset;
      });
      selectedLayerFeatures
        .filter((feature) => {
          return this.selectedFeatures.indexOf(feature) === -1;
        })
        .map((feature) => {
          this.selectedValues = Utils.updateSelectedValues(feature, this.selectedValues);
          this.selectedFeatures = Utils.updateSelectedFeatures(feature, this.selectedFeatures);
        });
      this.processSelectionCallback(this.path, this.selectedValues);

      // Todo: figure out why the selectionsApi is needed;
      // this.selectionsApi.selectionsMade = this.selected.length > 0;
    }
  }

  /**
   * Set selected layer
   */
  setSelectedLayer(layer: any) {
    this.path = `/gaLayers/${layer.index}/qHyperCubeDef`;
    this.selections.cancel();
    this.selections.begin(this.path);
    this.selectedLayerModel = layer;
    // this.setSelectOptionsValue( layer.id || undefined );
  }

  setSelectOptionsValue(_value?: string) {
    // Todo: we need to introduce the selectionMenuConfig, I think it is related to nebula changes
    // this.selectionMenuConfig.value = value;
  }

  setAllowSelections(allowSelections: boolean) {
    this.allowSelections = allowSelections;
  }

  setSelectionToolbar(selectionToolbar: SelectionToolbar) {
    this.selectionToolbar = selectionToolbar;
  }

  handleClick(feature: idevio.map.Feature) {
    if (feature) {
      const layer = SelectUtils.getLayerFromFeature(feature, this.mapModel);

      if (layer !== null) {
        if (!this.selections.isActive() || !this.selectedLayerModel) {
          if (!this.selectedLayerModel) {
            this.selectedLayerModel = layer;
          }
          this.path = `/gaLayers/${layer.index}/qHyperCubeDef`;
          this.selections.cancel();
          this.selections.begin(this.path);
        }

        if (layer.id === this.selectedLayerModel?.id) {
          this.selectedValues = Utils.updateSelectedValues(feature, this.selectedValues);
          this.selectedFeatures = Utils.updateSelectedFeatures(feature, this.selectedFeatures);
          this.selectedLayerModel = this.selectedValues.length ? this.selectedLayerModel : undefined;
        }
      }
    } else if (!this.selections.isActive()) {
      const pathList: string[] = [];
      this.mapModel.layers.models.map((_layerModel: any, index: number) => {
        pathList.push(`/gaLayers/${index}/qHyperCubeDef`);
      });
      this.selections.cancel();
      this.selections.begin(pathList);
    }
    this.processSelectionCallback(this.path, this.selectedValues);
  }

  handleMove(event: any) {
    const a: Coordinate = [this.pressEvent.clientX, this.pressEvent.clientY];
    const b: Coordinate = [event.clientX, event.clientY];
    if (SelectUtils.distanceBetweenPoints(a, b) > 8) {
      const selectionTool = this.getActiveSelectionTool();
      if (selectionTool) {
        const x = event.clientX + this.mapModel.webMapElement.offsetLeft;
        const y = event.clientY + this.mapModel.webMapElement.offsetTop;
        if (!selectionTool.isActive) {
          selectionTool.activate(x, y);
          // Todo: figure out why this.activate() is needed
          // this.activate();
        }
        selectionTool.move(x, y);
      }
    }
  }

  handleClickPressed(event: any) {
    this.pressEvent = event;
  }

  handleRelease() {
    this.pressEvent = undefined;
    const selectionTool = this.getActiveSelectionTool();
    selectionTool?.release();
  }

  resetSelections() {
    this.selectedLayerModel = undefined;
    this.path = '';
    this.selectedValues = [];
    this.selectedFeatures = [];
    this.handleRelease();
  }

  updateHighlight() {
    this.mapModel.map.setHighlighted(this.selectedFeatures);
  }
}
