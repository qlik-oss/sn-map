import getFormatsDefinition from '../definition';

describe('getFormatsDefinition', () => {
  it('should return formats definition', () => {
    const formatsDef = getFormatsDefinition();
    expect(formatsDef.items).toHaveProperty('common');
    expect(formatsDef.items.common.items).toHaveProperty('title');
    expect(formatsDef.items.common.items).toHaveProperty('dataType');
    expect(formatsDef.items).toHaveProperty('tms');
    expect(formatsDef.items).toHaveProperty('image');
  });

  describe('definition.dataType', () => {
    it('', () => {
      const formatsDef = getFormatsDefinition();
      const dataTypeOptions = formatsDef.items.common.items.dataType.options();
      expect(dataTypeOptions.length).toBe(3);
      expect(dataTypeOptions[0].value).toBe('tms');
      expect(dataTypeOptions[1].value).toBe('wms');
      expect(dataTypeOptions[2].value).toBe('image');
    });
  });
});
