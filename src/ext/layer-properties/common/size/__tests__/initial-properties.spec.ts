import getSizeProperties from '../initial-properties';

describe('size initial-properties', () => {
  it('should return valid size values for PointLayer type', () => {
    const initialValues = getSizeProperties('PointLayer');
    expect(initialValues).toHaveProperty('size');
    expect(initialValues.size).toHaveProperty('radiusMin');
    expect(initialValues.size).toHaveProperty('radiusMax');
    expect(initialValues.size).toHaveProperty('sliderSingle');
  });
});
