import getInitialProperties from '../initial-properties';

describe('getInitialProperties', () => {
  it('should return geodata-layer initial definition', () => {
    const initialProperties = getInitialProperties();
    expect(initialProperties.type).toEqual('GeodataLayer');
    expect(initialProperties).toHaveProperty('cId');
  });
});
