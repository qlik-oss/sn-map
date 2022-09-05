import getInitialProperties from '../initial-properties';

describe('getInitialProperties', () => {
  it('should return point-layer initial definition', () => {
    const initialProperties = getInitialProperties();
    expect(initialProperties.type).toEqual('PointLayer');
    expect(initialProperties).toHaveProperty('cId');
    expect(initialProperties).toHaveProperty('qHyperCubeDef');
    expect(initialProperties).toHaveProperty('color');
    expect(initialProperties).toHaveProperty('size');
  });
});
