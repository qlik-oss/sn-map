import getLocationProperties from '../initial-properties';

describe('Location initial properties', () => {
  it('should get default properties', () => {
    const properties = getLocationProperties('foobar');
    expect(properties).toHaveProperty('locationOrLatitude');
    expect(properties).toHaveProperty('locationCountry');
    expect(properties).toHaveProperty('locationAdmin1');
    expect(properties).toHaveProperty('locationAdmin2');
    expect(properties).toHaveProperty('locationDefault');
    expect(properties).toHaveProperty('locationNamesAuto');
    expect(properties).toHaveProperty('locationType');

    expect(properties).not.toHaveProperty('longitude');
    expect(properties).not.toHaveProperty('isLatLong');
  });

  it('should get PointLayer specific properties', () => {
    const properties = getLocationProperties('PointLayer');
    expect(properties).toHaveProperty('longitude');
    expect(properties).toHaveProperty('isLatLong');
  });
});
