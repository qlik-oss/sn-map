export abstract class DatasetModel {
  abstract id: string;
  abstract dataset: idevio.map.MemoryDataset | idevio.map.LocationDataset;
  abstract loading: PromiseInterface;
  featureTable: any;

  constructor() {
    this.featureTable = {};
  }

  remove() {
    if (this.dataset) {
      this.dataset.removeAll();
    }
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

  addLocationData(data: PointData[], dataOrder: string[]) {
    const collectedData = [];
    for (const index in data) {
      const row = data[index];
      if (row.id === null || row.geoname === null || row.location === null) {
        continue;
      }
      try {
        const featureData = [];
        dataOrder.forEach((key) => {
          featureData.push(row[key]);
        });
        // geoname needs to be first
        collectedData.push(featureData);
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
      if (row.id === null || row.coords === null || row.location === null) {
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

  getDatasetInfo(data: Data[]) {
    for (const index in data) {
      const row = data[index];
      const columns = this.sortColumns(Object.keys(row));
      if (row.hasOwnProperty('coords')) {
        return {
          columns,
          isGeoname: false,
        };
      }
      if (row.hasOwnProperty('geoname')) {
        return {
          columns,
          isGeoname: true,
        };
      }
    }
    return null;
  }

  sortColumns(columns: string[]) {
    return [...columns.filter((key) => key === 'geoname'), ...columns.filter((key) => key !== 'geoname')];
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
}
