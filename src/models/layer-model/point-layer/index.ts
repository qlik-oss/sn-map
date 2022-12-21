import { getValue } from 'qlik-chart-modules';
import { DatasetModel } from '../common/dataset-model';
import { DataModel } from '../common/data-model';
import { SymbolModel } from './models/symbol-model';
import { LayerModel } from '../common/layer-model';
import LayoutService from '../common/services/layout-service';

export class PointLayerModel extends LayerModel implements PointLayerModelInterface {
  id: string;
  layer: idevio.map.FeatureLayer;
  dataModel: DataModel;
  datasetModel: DatasetModel;
  symbolModel: SymbolModel;

  constructor(mapModel: MapModelInterFace, id: string) {
    super(mapModel);
    this.id = id;
    this.layer = new idevio.map.FeatureLayer(mapModel.map, { drawOrder: 1001, pickable: true });
    this.dataModel = new DataModel();
    this.datasetModel = new DatasetModel(id, this.layer);
    this.symbolModel = new SymbolModel();
  }

  update(layout: PointLayerLayout) {
    const layoutService = LayoutService.create(layout);

    this.dataModel.update(layoutService);
    const data = this.dataModel.getData() as PointData[];

    const collectedData = this.symbolModel.addSymbolToData(data, layoutService) as PointData[];
    const crs = getValue(this.mapModel, 'baseMapModel.crs');
    this.datasetModel.update(crs, collectedData);

    this.setStyles();
  }

  setStyles() {
    const styles = this.symbolModel.getStyles();
    this.layer.setStyles(styles);
  }

  remove() {
    if (this.layer) {
      this.layer.remove();
    }
    this.datasetModel.remove();
  }
}
