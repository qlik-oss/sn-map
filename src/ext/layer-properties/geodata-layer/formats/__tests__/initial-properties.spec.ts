import getFormatsProperties from '../initial-properties';

describe('getFormatsProperties', () => {
  it('should return format initial properties', () => {
    const formatsProperties = getFormatsProperties();
    expect(formatsProperties).toHaveProperty('title');
    expect(formatsProperties).toHaveProperty('dataType');
    expect(formatsProperties).toHaveProperty('tms');
    expect(formatsProperties).toHaveProperty('image');
  });
});
