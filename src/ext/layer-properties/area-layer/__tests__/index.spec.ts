import getAreaLayerDefinition from '../';
import env from '../../../../mocks/environment';

describe('getAreaLayerDefinition', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should return point-layer definition', () => {
    const properties = getAreaLayerDefinition(env);
    expect(properties).toHaveProperty('initialProperties');
    expect(properties).toHaveProperty('definition');
  });
});
