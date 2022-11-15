import { BaseMapModel } from '../models/map-model/models/base-map';
import webmapMock from './webmap';

jest.mock('../models/map-model/models/base-map-model');

const baseMapModelMock = BaseMapModel as jest.Mocked<typeof BaseMapModel>;
const map = new webmapMock.idevio.map.WebMap();
const mockedBaseMapModel = new baseMapModelMock(map);

export default mockedBaseMapModel;
