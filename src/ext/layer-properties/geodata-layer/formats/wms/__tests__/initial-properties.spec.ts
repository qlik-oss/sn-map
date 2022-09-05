import getWMSProperties from '../initial-properties';

describe('getWMSProperties', () => {
  it('should return wms properties', () => {
    const properties = getWMSProperties();
    expect(properties).toHaveProperty('wms');
    expect(properties.wms).toHaveProperty('url');
  });
});
