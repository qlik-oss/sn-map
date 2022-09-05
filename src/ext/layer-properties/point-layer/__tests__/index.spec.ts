import getPointLayerDefinition from '../';
import env from '../../../../mocks/environment';

describe('getPointLayerDefinition', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should return point-layer definition', () => {
    const properties = getPointLayerDefinition(env);
    expect(properties).toHaveProperty('initialProperties');
    expect(properties).toHaveProperty('definition');
  });
});
