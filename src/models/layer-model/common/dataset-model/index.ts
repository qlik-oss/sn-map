import GeneralUtils from '../../../../utils/general';
import Util from './utils';
export class DatasetModel {
  id: string;
  layer: idevio.map.FeatureLayer;
  geom: string;
  dataset: idevio.map.MemoryDataset | idevio.map.LocationDataset;
  loading: PromiseInterface;
  featureTable: any;

  constructor(id: string, layer: idevio.map.FeatureLayer, geom: string = 'i:///pointgeom/default') {
    this.id = id;
    this.layer = layer;
    this.geom = geom;
    this.dataset = this.layer.getDataset();
    this.loading = GeneralUtils.createPromise().resolve();
    this.featureTable = {};
  }

  update(crs: string, data: PointData[]) {
    this.remove();
    const info = this.getDatasetInfo(data);

    if (info !== null) {
      if (info.isGeoName) {
        this.createLocationDataset(info.columns);
        this.addLocationData(data, info.columns);
      } else {
        this.createMemoryDataset(crs);
        this.addFeatureData(data);
      }
      this.layer.setDataset(this.dataset);
    }
  }

  remove() {
    if (this.dataset) {
      this.dataset.removeAll();
    }
  }

  getDatasetInfo(data: Data[]) {
    for (const index in data) {
      const row = data[index];
      const columns = Object.keys(row);
      if (row.hasOwnProperty('coords')) {
        return {
          columns,
          isGeoName: false,
        };
      }
      if (row.hasOwnProperty('geoname')) {
        return {
          columns: Util.sortColumns(columns), // geoname needs to be first
          isGeoName: true,
        };
      }
    }
    return null;
  }

  createLocationDataset(columns: string[]) {
    this.loading = GeneralUtils.createPromise();
    const options = this.getDatasetOptions(columns) as idevio.map.RemoteServiceLocationDatasetOptions;
    this.dataset = idevio.map.LocationDataset.create(this.geom, 'SERVICE', options);
  }

  createMemoryDataset(crs: string) {
    this.dataset = new idevio.map.MemoryDataset({ name: this.id, crs });
  }

  addLocationData(data: PointData[], dataOrder: string[]) {
    const collectedData = [];
    for (const index in data) {
      const row = data[index];
      if (row.id === null || row.geoname === undefined) {
        continue;
      }
      try {
        const locationData: PointData[] = [];
        dataOrder.forEach((key) => {
          locationData.push(row[key] as any);
        });
        collectedData.push(locationData);
      } catch {
        console.log('Failed lookup; ', row.geoname);
      }
    }
    (this.dataset as idevio.map.LocationDataset).addData(collectedData);
  }

  addFeatureData(data: PointData[]) {
    this.featureTable = {};
    for (const index in data) {
      const row = data[index];
      if (row.id === null || row.coords === undefined) {
        continue;
      }
      try {
        const coords = row.coords;
        delete row.coords;
        const feature = new idevio.map.PointFeature(this.dataset, {
          coordinate: coords,
          attributes: row,
        });
        this.featureTable[String(row.id)] = feature;
      } catch {
        console.log('Failed lookup; ', row.coords);
      }
    }
  }

  getDatasetOptions(columnNames: string[]) {
    return {
      columnNames,
      name: this.id,
      onload: () => {
        this.loading.resolve();
        const features = this.dataset.getAll();
        if (features) {
          features.forEach((feature) => {
            const id = feature.getAttribute('id');
            const subIds = feature.getAttribute('subIds') as number[];
            if (subIds && subIds.length) {
              subIds.forEach((subId) => (this.featureTable[String([id, subId])] = feature));
            } else {
              this.featureTable[id] = feature;
            }
          });
        }
      },
      onerror: () => {},
    };
  }

  /**
   * Can only be used after this.dataset is loaded.
   */
  hasFeatures() {
    const features = this.dataset ? this.dataset.getAll() : null;
    return features !== null && features?.length > 0;
  }

  getBounds(): Rectangle | null {
    if (this.hasFeatures()) {
      return this.dataset.getAlternateBounds();
    } else {
      return null;
    }
  }
}
