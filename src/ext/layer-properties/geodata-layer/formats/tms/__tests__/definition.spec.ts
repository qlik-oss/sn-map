import getTMSDefinition from '../definition';
import mockProperties from '../../../../../../mocks/properties';

describe('getTMSDefinition', () => {
  let layerProps: GeodataLayerProperties;
  let formatsDef: any;

  beforeEach(() => {
    formatsDef = getTMSDefinition();
    layerProps = JSON.parse(JSON.stringify(mockProperties.layer.geodata));
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should return format initial definition', () => {
    expect(formatsDef.tms.items).toHaveProperty('url');
  });

  describe('definition.url', () => {
    it('should set the title as the url domain', () => {
      layerProps.tms.url = 'https://foo.bar/path/';
      formatsDef.tms.items.url.change(layerProps);
      expect(layerProps.title).toBe('foo.bar');
    });
    it('should not change the title when it is already set', () => {
      layerProps.tms.url = 'https://foo.bar/';
      layerProps.title = 'title';
      formatsDef.tms.items.url.change(layerProps);
      expect(layerProps.title).toBe('title');
    });
    it('should not automatically set the title if invalid url', () => {
      layerProps.tms.url = 'foobar';
      formatsDef.tms.items.url.change(layerProps);
      expect(layerProps.title).toBe('');
    });
  });

  describe('definition advanced options', () => {
    it('should show advanced options', () => {
      layerProps.tms.auto = false;
      const showAdvancedOptions = formatsDef.tms.items.advancedOptions.show(layerProps);
      expect(showAdvancedOptions).toBe(true);
    });
    it('should not show advanced options', () => {
      layerProps.tms.auto = true;
      const showAdvancedOptions = formatsDef.tms.items.advancedOptions.show(layerProps);
      expect(showAdvancedOptions).toBe(false);
    });
  });

  describe('definition tms', () => {
    it('should show tms options', () => {
      layerProps.dataType = 'tms';
      const showTms = formatsDef.tms.show(layerProps);
      expect(showTms).toBe(true);
    });
    it('should not show tms options', () => {
      layerProps.dataType = 'unknown';
      const showTms = formatsDef.tms.show(layerProps);
      expect(showTms).toBe(false);
    });
  });
});
