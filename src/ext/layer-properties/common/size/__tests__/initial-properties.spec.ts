import getSizeProperties from '../initial-properties';

describe('size initial-properties', () => {
  it('should return valid size values for PointLayer type', () => {
    const initialValues = getSizeProperties('PointLayer');
    expect(initialValues).toHaveProperty('size');
    expect(initialValues.size).toHaveProperty('sliderSingleValue');
    expect(initialValues.size.sliderRangeValues.length).toEqual(2);
    expect(initialValues.size).toHaveProperty('customMinRangeValue');
    expect(initialValues.size).toHaveProperty('customMaxRangeValue');
    expect(initialValues.size).toHaveProperty('expression');
    expect(initialValues.size).toHaveProperty('autoRadiusValueRange');
    expect(initialValues.size).toHaveProperty('shape');
    expect(initialValues.size).toHaveProperty('label');
    expect(initialValues.size.formatting).toHaveProperty('qNumFormat');
  });
});
