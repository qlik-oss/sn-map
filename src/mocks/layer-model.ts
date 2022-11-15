import { PointLayerModel } from '../models/layer-model/point-layer';
import mapModelMock from './map-model';

jest.mock('../models/layer-model/point-layer');

const pointLayerMock = PointLayerModel as jest.Mocked<typeof PointLayerModel>;

const mockedLayerModels = {
  mockedPointLayerModel: new pointLayerMock(mapModelMock, 'point-layer-mock'),
};

export default mockedLayerModels;
