import getInitialProperties from '../initial-properties';

describe('color initial-properties', () => {
  it('should return initial definition for undefined type', () => {
    const type: any = undefined;
    const initialProperties = getInitialProperties(type);
    expect(initialProperties.color.auto).toEqual(true);
    expect(initialProperties.color.mode).toEqual('primary');
  });
  it('should return initial definition for PointLayer type', () => {
    const type: LayerTypeName = 'PointLayer';
    const initialProperties = getInitialProperties(type);
    expect(initialProperties.color.auto).toEqual(false);
    expect(initialProperties.color.mode).toEqual('primary');
  });

  it('should return initial definition for AreaLayer type', () => {
    const type: LayerTypeName = 'AreaLayer';
    const initialProperties = getInitialProperties(type);
    expect(initialProperties.color.auto).toEqual(false);
    expect(initialProperties.color.mode).toEqual('primary');
  });
});
