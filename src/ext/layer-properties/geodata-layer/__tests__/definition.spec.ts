import getGeodataLayerDefinition from '../definition';
import env from '../../../../mocks/environment';
import mockProperties from '../../../../mocks/properties';

describe('point-layer definition', () => {
  let layerProps: GeodataLayerProperties;

  beforeEach(() => {
    layerProps = JSON.parse(JSON.stringify(mockProperties.layer.geodata));
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should return point layer definition', () => {
    const definition = getGeodataLayerDefinition(env);
    expect(definition.component).toEqual('accordion');
    expect(definition.items.general.show).toEqual(false);
  });

  describe('definition title', () => {
    it('should return layer title', () => {
      layerProps.title = 'foobar';
      const definition = getGeodataLayerDefinition(env);
      const title = definition.title(layerProps);
      expect(title).toBe('foobar');
    });

    it('should return noName translation key', () => {
      layerProps.title = '';
      const definition = getGeodataLayerDefinition(env);
      const title = definition.title(layerProps);
      expect(title).toBe('geo.dropmenu.noName');
    });
  });
});
