import LayerType from '../../../../utils/const/layer-type';
import LocationType from '../../../../utils/const/location-type';
import GeneralUtils from '../../../../utils/general';
export class DatasetModel {
  id: string;
  layer: idevio.map.FeatureLayer;
  geom: string;
  dataset: idevio.map.MemoryDataset | idevio.map.LocationDataset;
  loading: PromiseInterface;
  featureTable: any;
  layerType: LayerType;
  crs: string;
  locationType: string;

  constructor(id: string, layer: idevio.map.FeatureLayer, geom: string, layerType: LayerType) {
    this.id = id;
    this.layer = layer;
    this.geom = geom;
    this.dataset = this.layer.getDataset();
    this.loading = GeneralUtils.createPromise().resolve();
    this.featureTable = {};
    this.layerType = layerType;
    this.geom = geom;
    (this.crs = ''), (this.locationType = LocationType.UNKOWN);
  }

  update(data: Data[]) {
    this.remove();
    if (this.locationType === LocationType.UNKOWN || !data.length) return;
    if (this.locationType === LocationType.NAMES) {
      this.createLocationDataset(data);
      this.addLocationData(data);
    } else {
      this.createMemoryDataset();
      this.addFeatureData(data);
    }
    this.layer.setDataset(this.dataset);
  }

  remove() {
    if (this.dataset) {
      this.dataset.removeAll();
    }
  }

  createLocationDataset(data: Data[]) {
    this.loading = GeneralUtils.createPromise();
    // geoname needs to be the first attribute for location lookup.
    const columnNames = ['geoname'].concat(Object.keys(data[0].attributes));
    const options = this.getDatasetOptions(columnNames) as idevio.map.RemoteServiceLocationDatasetOptions;
    this.dataset = idevio.map.LocationDataset.create(this.geom, 'SERVICE', options);
  }

  createMemoryDataset() {
    this.dataset = new idevio.map.MemoryDataset({ name: this.id, crs: this.crs });
  }

  addLocationData(data: Data[]) {
    const locationData = data.map((row) => {
      return [row.geom].concat(Object.values(row.attributes));
    });
    (this.dataset as idevio.map.LocationDataset).addData(locationData);
  }

  addFeatureData(data: Data[]) {
    this.featureTable = {};
    data.forEach((row) => {
      let featureData = {
        coordinate: row.geom,
        attributes: row.attributes,
      };
      try {
        switch (this.layerType) {
          case LayerType.POINT:
            this.featureTable[String(row.attributes.id)] = new idevio.map.PointFeature(this.dataset, featureData);
            break;
          case LayerType.AREA:
            this.featureTable[String(row.attributes.id)] = new idevio.map.PolygonFeature(this.dataset, featureData);
            break;
        }
      } catch {
        console.error('Location error:', row.geom);
      }
    });
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
