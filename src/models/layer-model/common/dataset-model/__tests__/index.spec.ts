import { DatasetModel } from '../';
import webmapMock from '../../../../../mocks/webmap';

describe('Dataset model', () => {
  let datasetModel: DatasetModel;
  let layer: idevio.map.FeatureLayer;
  beforeEach(() => {
    global.idevio = webmapMock.idevio;
    layer = new webmapMock.idevio.map.FeatureLayer();

    datasetModel = new DatasetModel('id', layer);
    datasetModel.dataset = new webmapMock.idevio.map.MemoryDataset();
    datasetModel.loading = {
      resolve: jest.fn(),
      reject: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('update', () => {
    beforeEach(() => {
      datasetModel.remove = jest.fn();
      datasetModel.createLocationDataset = jest.fn();
      datasetModel.createMemoryDataset = jest.fn();
      datasetModel.addLocationData = jest.fn();
      datasetModel.addFeatureData = jest.fn();
    });

    it('should remove, create and set location dataset when data has geonames', () => {
      datasetModel.getDatasetInfo = jest.fn().mockReturnValue({ isGeoName: true });
      datasetModel.update('crs', []);
      expect(datasetModel.remove).toBeCalledTimes(1);
      expect(datasetModel.getDatasetInfo).toBeCalledTimes(1);
      expect(datasetModel.createLocationDataset).toBeCalledTimes(1);
      expect(datasetModel.addLocationData).toBeCalledTimes(1);
      expect(datasetModel.createMemoryDataset).toBeCalledTimes(0);
      expect(datasetModel.layer.setDataset).toBeCalledTimes(1);
    });

    it('should remove, create and set memory dataset when data has no geonames', () => {
      datasetModel.getDatasetInfo = jest.fn().mockReturnValue({ isGeoName: false });
      datasetModel.update('crs', []);
      expect(datasetModel.remove).toBeCalledTimes(1);
      expect(datasetModel.getDatasetInfo).toBeCalledTimes(1);
      expect(datasetModel.createLocationDataset).toBeCalledTimes(0);
      expect(datasetModel.createMemoryDataset).toBeCalledTimes(1);
      expect(datasetModel.addFeatureData).toBeCalledTimes(1);
      expect(datasetModel.layer.setDataset).toBeCalledTimes(1);
    });

    it('should not create and dataset when invalid data', () => {
      datasetModel.getDatasetInfo = jest.fn().mockReturnValue(null);
      datasetModel.update('crs', []);
      expect(datasetModel.remove).toBeCalledTimes(1);
      expect(datasetModel.getDatasetInfo).toBeCalledTimes(1);
      expect(datasetModel.createLocationDataset).toBeCalledTimes(0);
      expect(datasetModel.createMemoryDataset).toBeCalledTimes(0);
      expect(datasetModel.layer.setDataset).toBeCalledTimes(0);
    });
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

  describe('createLocationDataset', () => {
    it('should set LocationDataset and a loading promise', () => {
      const info = {
        isGeoname: true,
        columns: ['name'],
      };
      datasetModel.getDatasetOptions = jest.fn().mockReturnValue({
        columnNames: ['name'],
        name: 'foobar',
      });
      datasetModel.createLocationDataset(info.columns);

      expect(global.idevio.map.LocationDataset.create).toHaveBeenCalledWith(
        'i:///pointgeom/default',
        'SERVICE',
        expect.objectContaining({ name: 'foobar' })
      );
      expect(datasetModel.loading).toBeInstanceOf(Promise);
    });
  });

  describe('createMemoryDataset', () => {
    it('should set MemoryDataset', () => {
      global.idevio.map.MemoryDataset = webmapMock.idevio.map.MemoryDataset;
      datasetModel.createMemoryDataset('crs');

      expect(datasetModel.dataset).toBeInstanceOf(webmapMock.idevio.map.MemoryDataset);
    });
  });

  describe('addLocationData', () => {
    it('should only add data when id and geoname are defined', () => {
      const data = [
        { geoname: 'foobar' },
        { id: 0, geoname: undefined },
        { id: undefined, geoname: 'foobar' },
        { id: 1, geoname: 'foobar', size: 5 },
      ] as PointData[];
      const order = ['geoname', 'id', 'size'];
      (datasetModel.dataset as idevio.map.LocationDataset).addData = jest.fn();
      datasetModel.addLocationData(data, order);
      expect((datasetModel.dataset as idevio.map.LocationDataset).addData).toHaveBeenCalledWith([['foobar', 1, 5]]);
    });
  });

  describe('addFeatureData', () => {
    it('should only add data when id and coords are defined', () => {
      const data = [
        { coords: 'foobar' },
        { id: 0, coords: undefined },
        { id: undefined, coords: 'foobar' },
        { id: 1, coords: 'foobar' },
      ] as PointData[];
      datasetModel.addFeatureData(data);
      expect(Object.keys(datasetModel.featureTable).length).toBe(1);
      expect(datasetModel.featureTable['1']).toBeDefined();
    });
  });

  describe('getDatasetInfo', () => {
    it('should get coord data', () => {
      const data = [{ id: 0 }, { id: 1, coords: 'foobar' }] as PointData[];

      const info = datasetModel.getDatasetInfo(data);
      expect(info?.columns).toEqual(['id', 'coords']);
      expect(info?.isGeoName).toBe(false);
    });

    it('should get geoname data', () => {
      const data = [{ id: 0 }, { id: 1, geoname: 'foobar' }] as PointData[];

      const info = datasetModel.getDatasetInfo(data);
      expect(info?.columns).toEqual(['geoname', 'id']);
      expect(info?.isGeoName).toBe(true);
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
