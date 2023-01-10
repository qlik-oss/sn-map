import { getValue } from 'qlik-chart-modules';
import { DatasetModel } from '../common/dataset-model';
import { LayerModel } from '../common/layer-model';
import { StyleModel } from './models/style-model';
import LayoutService from '../common/services/layout-service';
import DataUtils from '../../../utils/data';
import LocationUtils from '../../../utils/location';
import LayerType from '../../../utils/const/layer-type';
import LocationType from '../../../utils/const/location-type';
import { AreaLayerModelInterface } from '../../../typings/models/layer-model';

export class AreaLayerModel extends LayerModel implements AreaLayerModelInterface {
  id: string;
  layer: idevio.map.FeatureLayer;
  datasetModel: DatasetModel;
  styleModel: StyleModel;

  constructor(mapModel: MapModelInterFace, id: string) {
    super(mapModel);
    this.id = id;
    this.layer = new idevio.map.FeatureLayer(mapModel.map, { drawOrder: 1001, pickable: true });
    this.datasetModel = new DatasetModel(id, this.layer, 'i:///areageom/default', LayerType.AREA);
    this.styleModel = new StyleModel();
  }

  update(layout: AreaLayerLayout) {
    const layoutService = LayoutService.create(layout);
    const data = this.collectData(layoutService);
    this.datasetModel.update(data);
    this.setStyles();
  }

  collectData(layoutService: LayoutService) {
    let collectedData: Data[] = [];
    let locationType = LocationType.UNKOWN;

    const dataPages = layoutService.getDataPages();
    dataPages.forEach((dataPage, index) => {
      if (Array.isArray(dataPage)) {
        dataPage = DataUtils.flattenDataPages(dataPage);
      }

      if (index === 0) {
        locationType = LocationUtils.getLocationKind(dataPage, layoutService, 0);
      }

      const data = dataPage.qMatrix.map((row: NxCell[]) => {
        return this.extractData(row, layoutService, locationType);
      });

      collectedData = collectedData.concat(data as Data[]);
    });

    // Modify dataset settings
    this.datasetModel.crs = getValue(this.mapModel, 'baseMapModel.crs');
    this.datasetModel.locationType = locationType;

    return collectedData;
  }

  extractData(row: NxCell[], layoutService: LayoutService, locationType: string) {
    const elemData = DataUtils.getElemData(row, 0);
    const location = LocationUtils.getLocation(row, layoutService, 0);
    const geom = LocationUtils.getGeometry(location, locationType, row, layoutService);
    const styleKey = this.styleModel.getStyleKey(layoutService);

    return {
      geom,
      attributes: {
        ...elemData,
        styleKey,
      },
    };
  }

  setStyles() {
    const styles = this.styleModel.getStyles();
    this.layer.setStyles(styles);
  }

  remove() {
    if (this.layer) {
      this.layer.remove();
    }
    this.datasetModel.remove();
  }
}
