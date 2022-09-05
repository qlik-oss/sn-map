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

    if (info !== null) {
      this.createDataset(crs, info);
      if (info.isGeoname) {
        this.addLocationData(data);
      } else {
        this.addFeatureData(data);
      }
    }
  }

  createDataset(crs: string, { isGeoname, columns }: DatasetInfo) {
    if (isGeoname) {
      this.loading = Utils.createPromise();
      const options = this.getDatasetOptions(columns) as idevio.map.RemoteServiceLocationDatasetOptions;
      this.dataset = idevio.map.LocationDataset.create('i:///pointgeom/default', 'SERVICE', options);
    } else {
      this.dataset = new idevio.map.MemoryDataset({ name: this.id, crs });
    }
    this.layer.setDataset(this.dataset);
  }
}
