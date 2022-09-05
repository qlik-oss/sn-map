import layoutMock from './layout';
import { MapModel } from '../models/map-model';

jest.mock('../models/map-model');

const MapModelMock = MapModel as jest.Mocked<typeof MapModel>;
const webmapElement = document.createElement('div');
const mockedMapModel = new MapModelMock(webmapElement, layoutMock.map);

export default mockedMapModel;
