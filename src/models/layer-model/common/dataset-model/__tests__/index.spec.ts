import { DatasetModel } from '../';
import webmapMock from '../../../../../mocks/webmap';
import LayerType from '../../../../../utils/const/layer-type';

describe('Dataset model', () => {
  let datasetModel: DatasetModel;
  let layer: idevio.map.FeatureLayer;
  let data: Data[];
  beforeEach(() => {
    global.idevio = webmapMock.idevio;
    layer = new webmapMock.idevio.map.FeatureLayer();

    datasetModel = new DatasetModel('id', layer, 'geom', LayerType.POINT);
    datasetModel.dataset = new webmapMock.idevio.map.MemoryDataset();
    datasetModel.loading = {
      resolve: jest.fn(),
      reject: jest.fn(),
    };
    data = [
      {
        geom: 'Sweden',
        attributes: {
          id: 0,
          dimensionValue: 'dimension',
          state: 'X',
          styleKey: 'styleKey',
        },
      },
    ];
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

    it('should remove, create and set location dataset when locationType is NAMES', () => {
      datasetModel.locationType = 'NAMES';
      datasetModel.update(data);
      expect(datasetModel.remove).toBeCalledTimes(1);
      expect(datasetModel.createLocationDataset).toBeCalledTimes(1);
      expect(datasetModel.addLocationData).toBeCalledTimes(1);
      expect(datasetModel.createMemoryDataset).toBeCalledTimes(0);
      expect(datasetModel.layer.setDataset).toBeCalledTimes(1);
    });

    it('should remove, create and set memory dataset when locationType LATLONGS', () => {
      datasetModel.locationType = 'LATLONGS';
      datasetModel.update(data);
      expect(datasetModel.remove).toBeCalledTimes(1);
      expect(datasetModel.createLocationDataset).toBeCalledTimes(0);
      expect(datasetModel.createMemoryDataset).toBeCalledTimes(1);
      expect(datasetModel.addFeatureData).toBeCalledTimes(1);
      expect(datasetModel.layer.setDataset).toBeCalledTimes(1);
    });

    it('should not create dataset when locationType is UNKOWN', () => {
      datasetModel.locationType = 'UNKOWN';
      datasetModel.update(data);
      expect(datasetModel.remove).toBeCalledTimes(1);
      expect(datasetModel.createLocationDataset).not.toBeCalled();
      expect(datasetModel.createMemoryDataset).not.toBeCalled();
      expect(datasetModel.layer.setDataset).not.toBeCalled();
    });

    it('should not create dataset when no data', () => {
      datasetModel.locationType = 'NAMES';
      datasetModel.update([]);
      expect(datasetModel.remove).toBeCalledTimes(1);
      expect(datasetModel.createLocationDataset).not.toBeCalled();
      expect(datasetModel.createMemoryDataset).not.toBeCalled();
      expect(datasetModel.layer.setDataset).not.toBeCalled();
    });
  });

  describe('remove', () => {
    it('should call removeAll', () => {
      datasetModel.remove();
      expect(datasetModel.dataset.removeAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('createLocationDataset', () => {
    it('should set LocationDataset, a loading promise and call getDatasetOptions with geoname as the first value', () => {
      datasetModel.getDatasetOptions = jest.fn();
      datasetModel.createLocationDataset(data);

      expect(datasetModel.getDatasetOptions).toHaveBeenCalledWith([
        'geoname',
        'id',
        'dimensionValue',
        'state',
        'styleKey',
      ]);
      expect(global.idevio.map.LocationDataset.create).toHaveBeenCalled;
      expect(datasetModel.loading).toBeInstanceOf(Promise);
    });
  });

  describe('createMemoryDataset', () => {
    it('should set MemoryDataset', () => {
      global.idevio.map.MemoryDataset = webmapMock.idevio.map.MemoryDataset;
      datasetModel.createMemoryDataset();

      expect(datasetModel.dataset).toBeInstanceOf(webmapMock.idevio.map.MemoryDataset);
    });
  });

  describe('addLocationData', () => {
    it('should convert data into an array and add it to the LocationDataset', () => {
      const expectedResult = [['Sweden', 0, 'dimension', 'X', 'styleKey']];
      (datasetModel.dataset as idevio.map.LocationDataset).addData = jest.fn();
      datasetModel.addLocationData(data);
      expect((datasetModel.dataset as idevio.map.LocationDataset).addData).toHaveBeenCalledWith(expectedResult);
    });
  });

  describe('addFeatureData', () => {
    it('should add PointFeature when PointLayer', () => {
      datasetModel.addFeatureData(data);
      expect(Object.keys(datasetModel.featureTable).length).toBe(1);
      expect(datasetModel.featureTable).toHaveProperty('0');
      expect(datasetModel.featureTable['0']).toBeInstanceOf(webmapMock.idevio.map.PointFeature);
    });

    it('should add PolygonFeature when AreaLayer', () => {
      datasetModel.layerType = LayerType.AREA;
      datasetModel.addFeatureData(data);
      expect(Object.keys(datasetModel.featureTable).length).toBe(1);
      expect(datasetModel.featureTable).toHaveProperty('0');
      expect(datasetModel.featureTable['0']).toBeInstanceOf(webmapMock.idevio.map.PolygonFeature);
    });
  });

  describe('getDatasetOptions', () => {
    it('should get dataset options and trigger load', () => {
      const options = datasetModel.getDatasetOptions([]);
      options.onload();
      expect(datasetModel.loading.resolve).toHaveBeenCalledTimes(1);
      expect(datasetModel.dataset.getAll).toHaveBeenCalledTimes(1);
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
      expect(datasetModel.featureTable).toHaveProperty('foo');
      expect(datasetModel.featureTable).toHaveProperty('bar');
      expect(datasetModel.dataset.getAll).toHaveBeenCalledTimes(1);
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
      expect(datasetModel.featureTable).toHaveProperty('foo,subId1');
      expect(datasetModel.featureTable).toHaveProperty('foo,subId2');
      expect(datasetModel.featureTable).toHaveProperty('bar,subId1');
      expect(datasetModel.featureTable).toHaveProperty('bar,subId2');
      expect(datasetModel.dataset.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('hasFeatures', () => {
    it('should have features', () => {
      datasetModel.dataset.getAll = jest.fn().mockReturnValue(['foobar']);
      const hasFeatures = datasetModel.hasFeatures();
      expect(hasFeatures).toBe(true);
      expect(datasetModel.dataset.getAll).toHaveBeenCalledTimes(1);
    });

    it('should not have features when no dataset', () => {
      (datasetModel.dataset as any) = undefined;
      const hasFeatures = datasetModel.hasFeatures();
      expect(hasFeatures).toBe(false);
    });

    it('should not have features when features are null', () => {
      datasetModel.dataset.getAll = jest.fn().mockReturnValue(null);
      const hasFeatures = datasetModel.hasFeatures();
      expect(hasFeatures).toBe(false);
    });

    it('should not have features when no features', () => {
      datasetModel.dataset.getAll = jest.fn().mockReturnValue([]);
      const hasFeatures = datasetModel.hasFeatures();
      expect(hasFeatures).toBe(false);
      expect(datasetModel.dataset.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getBounds', () => {
    it('should call getAlternateBounds', () => {
      datasetModel.hasFeatures = jest.fn().mockReturnValue(true);
      datasetModel.getBounds();
      expect(datasetModel.dataset.getAlternateBounds).toHaveBeenCalledTimes(1);
    });

    it('should not call getAlternateBounds when there are no features', () => {
      datasetModel.getBounds();
      expect(datasetModel.dataset.getAlternateBounds).not.toHaveBeenCalled();
    });
  });
});
