import getTMSProperties from '../initial-properties';

describe('getTMSProperties', () => {
  it('should return tms properties', () => {
    const tmsProperties = getTMSProperties();
    expect(tmsProperties).toHaveProperty('tms');
    expect(tmsProperties.tms).toHaveProperty('url');
  });
});
