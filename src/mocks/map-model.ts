import layoutMock from './layout';
import { MapModel } from '../models/map-model';

jest.mock('../models/map-model');

const mapModelMock = MapModel as jest.Mocked<typeof MapModel>;
const webmapElement = document.createElement('div');
const mockedMapModel = new mapModelMock(webmapElement, layoutMock.map);

export default mockedMapModel;
