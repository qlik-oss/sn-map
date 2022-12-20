import { getValue } from 'qlik-chart-modules';
import { DatasetModel } from '../../common/dataset-model';
import Utils from '../../../../utils/general';

export class PointLayerDatasetModel extends DatasetModel {
  id: string;
  dataset: idevio.map.MemoryDataset | idevio.map.LocationDataset;
  layer: idevio.map.FeatureLayer;
  loading: PromiseInterface;

  constructor(id: string, layer: idevio.map.FeatureLayer) {
    super();
    this.id = id;
    this.layer = layer;
    this.dataset = this.layer.getDataset();
    this.loading = Utils.createPromise().resolve();
  }

  update(crs: string, data: PointData[]) {
    this.remove();
    const info = this.getDatasetInfo(data);

    console.log('columns', info?.columns);

    if (info !== null) {
      if (info.isGeoname) {
        this.createLocationDataset(info.columns);
        this.addLocationData(data);
      } else {
        this.createMemoryDataset(crs);
        this.addFeatureData(data);
      }
      this.layer.setDataset(this.dataset);
    }
  }

  createLocationDataset(columns: string[]) {
    this.loading = Utils.createPromise();
    const options = this.getDatasetOptions(columns) as idevio.map.RemoteServiceLocationDatasetOptions;
    this.dataset = idevio.map.LocationDataset.create('i:///pointgeom/default', 'SERVICE', options);
  }

  createMemoryDataset(crs: string) {
    this.dataset = new idevio.map.MemoryDataset({ name: this.id, crs });
  }
}
