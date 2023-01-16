import getInitialProperties from '../initial-properties';

describe('color initial-properties', () => {
  it('should return initial definition', () => {
    const initialProperties = getInitialProperties();
    expect(initialProperties.color.auto).toEqual(true);
    expect(initialProperties.color.mode).toEqual('primary');
  });
});
