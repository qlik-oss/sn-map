import { getValue } from 'qlik-chart-modules';
import { DatasetModel } from '../common/dataset-model';
import { SymbolModel } from './models/symbol-model';
import { LayerModel } from '../common/layer-model';
import LayoutService from '../common/services/layout-service';
import DataUtils from '../../../utils/data';

export class PointLayerModel extends LayerModel implements PointLayerModelInterface {
  id: string;
  layer: idevio.map.FeatureLayer;
  datasetModel: DatasetModel;
  symbolModel: SymbolModel;

  constructor(mapModel: MapModelInterFace, id: string) {
    super(mapModel);
    this.id = id;
    this.layer = new idevio.map.FeatureLayer(mapModel.map, { drawOrder: 1001, pickable: true });
    this.datasetModel = new DatasetModel(id, this.layer);
    this.symbolModel = new SymbolModel();
  }

  update(layout: PointLayerLayout) {
    const layoutService = LayoutService.create(layout);
    const data = this.collectData(layoutService);
    const crs = getValue(this.mapModel, 'baseMapModel.crs');
    this.datasetModel.update(crs, data);
    this.setStyles();
  }

  collectData(layoutService: LayoutService) {
    let collectedData: PointData[] = [];
    const dataPages = layoutService.getDataPages();
    const sizeMeta = getValue(layoutService, 'meta.attributes.size');
    for (const page in dataPages) {
      let dataPage = dataPages[page];
      if (Array.isArray(dataPage)) {
        dataPage = DataUtils.flattenDataPages(dataPage);
      }

      const data = dataPage.qMatrix.map((row: NxCell[]) => {
        const elemData = DataUtils.getElemData(row, 0);
        const geom = DataUtils.getGeometry(row, layoutService, 0);
        const size = DataUtils.getAttribute(row, sizeMeta);
        const style = { ...size };
        const key = this.symbolModel.getSymbolKey(style, layoutService);
        return {
          ...elemData,
          ...geom,
          ...size,
          key,
        };
      });

      collectedData = collectedData.concat(data as PointData[]);
    }

    return collectedData;
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
