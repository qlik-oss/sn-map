import LayoutService from '../layout-service';
import layoutMock from '../../../../mocks/layout';
import { layoutService as createLayoutService } from 'qlik-chart-modules';

jest.mock('qlik-chart-modules');

describe('LayoutService', () => {
  let layout: MapLayout;

  beforeEach(() => {
    layout = JSON.parse(JSON.stringify(layoutMock.map));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call necessary functions on create', () => {
    LayoutService.create(layout);
    expect(createLayoutService).toHaveBeenCalled();
  });
});
