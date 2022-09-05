import getPropertyDefinition from '../property-definition';
import env from '../../mocks/environment';

describe('property-definition', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return valid properties', () => {
    const propertyDefinition = getPropertyDefinition(env);
    expect(propertyDefinition.component).toEqual('accordion');
    expect(propertyDefinition.items).toHaveProperty('layerSettings');
    expect(propertyDefinition.items).toHaveProperty('mapSettings');
    expect(propertyDefinition.items).toHaveProperty('layerSettings');
  });
});
