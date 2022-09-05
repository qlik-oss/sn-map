import webmapMock from '../../../../../mocks/webmap';
import { PointLayerDatasetModel } from '../dataset-model';

jest.mock('../../../common/dataset-model');

describe('Dataset model', () => {
  let pointLayerDatasetModel: PointLayerDatasetModel;
  let layer: idevio.map.FeatureLayer;
  beforeEach(() => {
    global.idevio = webmapMock.idevio;
    layer = new webmapMock.idevio.map.FeatureLayer();

    pointLayerDatasetModel = new PointLayerDatasetModel('id', layer);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('update', () => {
    it('should call addLocationData', () => {
      const info = {
        isGeoname: true,
        columns: {},
      };
      pointLayerDatasetModel.getDatasetInfo = jest.fn().mockReturnValue(info);
      pointLayerDatasetModel.createDataset = jest.fn();
      pointLayerDatasetModel.update('crs', []);
      expect(pointLayerDatasetModel.getDatasetInfo).toHaveBeenCalledTimes(1);
      expect(pointLayerDatasetModel.createDataset).toHaveBeenCalledWith('crs', info);
      expect(pointLayerDatasetModel.addLocationData).toHaveBeenCalledTimes(1);
    });

    it('should call addFeatureData', () => {
      pointLayerDatasetModel.getDatasetInfo = jest.fn().mockReturnValue({
        isGeoname: false,
        columns: {},
      });
      pointLayerDatasetModel.update('crs', []);
      expect(pointLayerDatasetModel.getDatasetInfo).toHaveBeenCalledTimes(1);
      expect(pointLayerDatasetModel.addFeatureData).toHaveBeenCalledTimes(1);
    });

    it('should not call addLocationData or addFeatureData when null', () => {
      pointLayerDatasetModel.getDatasetInfo = jest.fn().mockReturnValue(null);
      pointLayerDatasetModel.update('crs', []);
      expect(pointLayerDatasetModel.getDatasetInfo).toHaveBeenCalledTimes(1);
      expect(pointLayerDatasetModel.addLocationData).toHaveBeenCalledTimes(0);
      expect(pointLayerDatasetModel.addFeatureData).toHaveBeenCalledTimes(0);
    });
  });

  describe('createDataset', () => {
    it('should set LocationDataset and a loading promise', () => {
      const info = {
        isGeoname: true,
        columns: ['name'],
      };
      pointLayerDatasetModel.getDatasetOptions = jest.fn().mockReturnValue({
        columnNames: ['name'],
        name: 'foobar',
      });
      pointLayerDatasetModel.createDataset('crs', info);

      expect(global.idevio.map.LocationDataset.create).toHaveBeenCalledWith(
        'i:///pointgeom/default',
        'SERVICE',
        expect.objectContaining({ name: 'foobar' })
      );
      expect(layer.setDataset).toHaveBeenCalledTimes(1);
      expect(pointLayerDatasetModel.loading).toBeInstanceOf(Promise);
    });

    it('should set MemoryDataset', () => {
      const info = {
        isGeoname: false,
        columns: ['name'],
      };
      global.idevio.map.MemoryDataset = webmapMock.idevio.map.MemoryDataset;
      pointLayerDatasetModel.createDataset('crs', info);

      expect(pointLayerDatasetModel.dataset).toBeInstanceOf(webmapMock.idevio.map.MemoryDataset);
      expect(layer.setDataset).toHaveBeenCalledTimes(1);
    });
  });
});
