import getImageDefinition from '../definition';
import mockProperties from '../../../../../../mocks/properties';

describe('getImageDefinition', () => {
  let layerProps: GeodataLayerProperties;
  let formatsDef: any;

  beforeEach(() => {
    formatsDef = getImageDefinition();
    layerProps = JSON.parse(JSON.stringify(mockProperties.layer.geodata));
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should return format initial definition', () => {
    const formatsDef = getImageDefinition();
    expect(formatsDef.image.items).toHaveProperty('url');
  });

  describe('definition.url', () => {
    it('should set the title as the url domain', () => {
      layerProps.image.url = 'https://foo.bar/path/';
      formatsDef.image.items.url.change(layerProps);
      expect(layerProps.title).toBe('foo.bar');
    });
    it('should not change the title when it is already set', () => {
      layerProps.image.url = 'https://foo.bar/';
      layerProps.title = 'title';
      formatsDef.image.items.url.change(layerProps);
      expect(layerProps.title).toBe('title');
    });
    it('should not automatically set the title if invalid url', () => {
      layerProps.image.url = 'foobar';
      formatsDef.image.items.url.change(layerProps);
      expect(layerProps.title).toBe('');
    });
  });

  describe('definition image', () => {
    it('should show image options', () => {
      layerProps.dataType = 'image';
      const showImage = formatsDef.image.show(layerProps);
      expect(showImage).toBe(true);
    });
    it('should not show image options', () => {
      layerProps.dataType = 'unknown';
      const showImage = formatsDef.image.show(layerProps);
      expect(showImage).toBe(false);
    });
  });
});
