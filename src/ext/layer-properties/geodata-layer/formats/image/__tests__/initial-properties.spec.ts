import getImageProperties from '../initial-properties';

describe('getImageProperties', () => {
  it('should return image properties', () => {
    const tmsProperties = getImageProperties();
    expect(tmsProperties).toHaveProperty('image');
    expect(tmsProperties.image).toHaveProperty('url');
  });
});
