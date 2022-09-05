import { DatasetModel } from '../';
import mockedWebmap from '../../../../../mocks/webmap';

class MockedDataset extends DatasetModel {
  dataset: idevio.map.MemoryDataset;
  loading: PromiseInterface;
  id: string;
  constructor() {
    super();
    this.id = 'id1';
    this.dataset = new mockedWebmap.idevio.map.MemoryDataset();
    this.loading = {
      resolve: jest.fn(),
      reject: jest.fn(),
    };
  }
}

describe('Dataset model', () => {
  let datasetModel: DatasetModel;
  beforeEach(() => {
    global.idevio = mockedWebmap.idevio;
    datasetModel = new MockedDataset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('removeAll', () => {
    it('should call removeAll', () => {
      datasetModel.remove();
      expect(datasetModel.dataset.removeAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAll', () => {
    it('should call getAll', () => {
      datasetModel.hasFeatures();
      expect(datasetModel.dataset.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAlternateBounds', () => {
    it('should call getAlternateBounds', () => {
      datasetModel.hasFeatures = jest.fn().mockReturnValue(true);
      datasetModel.getBounds();
      expect(datasetModel.dataset.getAlternateBounds).toHaveBeenCalledTimes(1);
    });

    it('should not call getAlternateBounds when there are no features', () => {
      datasetModel.getBounds();
      expect(datasetModel.dataset.getAlternateBounds).toHaveBeenCalledTimes(0);
    });
  });

  describe('hasFeatures', () => {
    it('should have features', () => {
      datasetModel.dataset.getAll = jest.fn().mockReturnValue(['foobar']);
      const hasFeatures = datasetModel.hasFeatures();
      expect(hasFeatures).toBe(true);
    });

    it('should not have features when no dataset', () => {
      (datasetModel.dataset as any) = undefined;
      const hasFeatures = datasetModel.hasFeatures();
      expect(hasFeatures).toBe(false);
    });

    it('should not have features when features is null', () => {
      datasetModel.dataset.getAll = jest.fn().mockReturnValue(null);
      const hasFeatures = datasetModel.hasFeatures();
      expect(hasFeatures).toBe(false);
    });

    it('should not have features when no features', () => {
      datasetModel.dataset.getAll = jest.fn().mockReturnValue([]);
      const hasFeatures = datasetModel.hasFeatures();
      expect(hasFeatures).toBe(false);
    });
  });

  describe('addLocationData', () => {
    it('should add data', () => {
      const data = [
        { id: 0, geoname: null },
        { id: null, geoname: 'foobar' },
        { id: 1, geoname: 'foobar' },
      ];
      (datasetModel.dataset as idevio.map.LocationDataset).addData = jest.fn();
      datasetModel.addLocationData(data);
      expect((datasetModel.dataset as idevio.map.LocationDataset).addData).toHaveBeenCalledWith([[1, 'foobar']]);
    });
  });

  describe('addFeatureData', () => {
    it('should add data', () => {
      const data = [
        { id: 0, coords: null },
        { id: null, coords: 'foobar' },
        { id: 1, coords: 'foobar' },
      ];
      datasetModel.addFeatureData(data);
      expect(Object.keys(datasetModel.featureTable).length).toBe(1);
      expect(datasetModel.featureTable['1']).toBeDefined();
    });
  });

  describe('getDatasetInfo', () => {
    it('should get coord data', () => {
      const data = [
        { id: 0, location: null },
        { id: 1, coords: 'foobar' },
      ];

      const info = datasetModel.getDatasetInfo(data);
      expect(info?.columns).toEqual(['id', 'coords']);
      expect(info?.isGeoname).toBe(false);
    });

    it('should get geoname data', () => {
      const data = [
        { id: 0, location: null },
        { id: 1, geoname: 'foobar' },
      ];

      const info = datasetModel.getDatasetInfo(data);
      expect(info?.columns).toEqual(['id', 'geoname']);
      expect(info?.isGeoname).toBe(true);
    });

    it('should return null when no geoname or coords', () => {
      const data = [{ id: 0, location: 'foobar' }];

      const info = datasetModel.getDatasetInfo(data);
      expect(info).toBe(null);
    });
  });

  describe('getDatasetOptions', () => {
    it('should get dataset options and trigger load', () => {
      const options = datasetModel.getDatasetOptions([]);
      options.onload();
      expect(datasetModel.loading.resolve).toHaveBeenCalledTimes(1);
    });

    it('should add feature id to featureTable', () => {
      datasetModel.dataset.getAll = jest.fn().mockReturnValue([
        {
          getAttribute: (attr: string) => {
            return attr === 'id' ? 'foo' : null;
          },
        },
        {
          getAttribute: (attr: string) => {
            return attr === 'id' ? 'bar' : null;
          },
        },
      ]);
      const options = datasetModel.getDatasetOptions([]);
      options.onload();
      expect(datasetModel.featureTable.foo).toBeDefined();
      expect(datasetModel.featureTable.bar).toBeDefined();
    });

    it('should add feature id to featureTable', () => {
      datasetModel.dataset.getAll = jest.fn().mockReturnValue([
        {
          getAttribute: (attr: string) => {
            return attr === 'id' ? 'foo' : ['subId1', 'subId2'];
          },
        },
        {
          getAttribute: (attr: string) => {
            return attr === 'id' ? 'bar' : ['subId1', 'subId2'];
          },
        },
      ]);
      const options = datasetModel.getDatasetOptions([]);
      options.onload();
      expect(datasetModel.featureTable['foo,subId1']).toBeDefined();
      expect(datasetModel.featureTable['foo,subId2']).toBeDefined();
      expect(datasetModel.featureTable['bar,subId1']).toBeDefined();
      expect(datasetModel.featureTable['bar,subId2']).toBeDefined();
    });
  });
});
