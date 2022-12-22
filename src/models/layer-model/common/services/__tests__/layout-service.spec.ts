import LayoutService from '../layout-service';
import layoutMock from '../../../../../mocks/layout';
import { layoutService as createLayoutService } from 'qlik-chart-modules';

jest.mock('qlik-chart-modules');

describe('LayoutService', () => {
  let layout: PointLayerLayout;

  beforeEach(() => {
    layout = JSON.parse(JSON.stringify(layoutMock.layer.point));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call necessary functions on create', () => {
    LayoutService.create(layout);
    expect(createLayoutService).toHaveBeenCalled();
  });
});
