import getWMSDefinition from '../definition';
import mockProperties from '../../../../../../mocks/properties';

jest.mock('../wms-capabilities');

describe('getWMSDefinition', () => {
  let layerProps: GeodataLayerProperties;
  let formatsDef: any;

  beforeEach(() => {
    formatsDef = getWMSDefinition();
    layerProps = JSON.parse(JSON.stringify(mockProperties.layer.geodata));
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should return format initial definition', () => {
    expect(formatsDef.wms.items).toHaveProperty('url');
    expect(formatsDef.wms.items).toHaveProperty('wmsHint');
    expect(formatsDef.wms.items).toHaveProperty('attribution');
  });

  describe('definition wmsSetup', () => {
    it('should return wms capabilities', () => {
      const result = formatsDef.wms.items.wmsSetup.getCapabilities();
      expect(result).toBeDefined();
    });
  });

  describe('definition wms', () => {
    it('should show wms options', () => {
      layerProps.dataType = 'wms';
      const showWms = formatsDef.wms.show(layerProps);
      expect(showWms).toBe(true);
    });
    it('should not show wms options', () => {
      layerProps.dataType = 'unknown';
      const showWms = formatsDef.wms.show(layerProps);
      expect(showWms).toBe(false);
    });
  });
});
