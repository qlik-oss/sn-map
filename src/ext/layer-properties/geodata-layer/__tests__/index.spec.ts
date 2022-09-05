import getGeodataLayerDefinition from '../';
import env from '../../../../mocks/environment';

describe('geodata-layer definition', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should return geodata-layer definition', () => {
    const properties = getGeodataLayerDefinition(env);
    expect(properties).toHaveProperty('initialProperties');
    expect(properties).toHaveProperty('definition');
  });
});
