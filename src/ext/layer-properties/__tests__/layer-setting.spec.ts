import getLayerSettings from '../layer-settings';
import env from '../../../mocks/environment';

describe('layer-settings', () => {
  let layerItem: any;
  let props: any;
  let settings: any;

  beforeEach(() => {
    props = {
      mapSettings: { _layerType: 'PointLayer' },
      gaLayers: [],
    };
    layerItem = { data: { qHyperCubeDef: { qDimensions: [{ id: 'dimension_1' }] } } };
    settings = getLayerSettings(env);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return valid layer-settings', () => {
    expect(settings.translation).toEqual('properties.layers');
    expect(settings.items).toHaveProperty('layers');
    expect(settings.items).toHaveProperty('addLayer');
  });
  it('should return correct activePath', () => {
    const hasActivePath = settings.items.layers.activePath(layerItem);
    expect(hasActivePath).toEqual(false);
  });
  it('should return correct activePath', () => {
    settings.items.addLayer.change(props);
    expect(props.mapSettings._layerType).toEqual('');
  });
  it('should return correct options', () => {
    const options = settings.items.addLayer.options();
    expect(options[0].src).toEqual('../resources/extensions/qliktech/mapchart/img/layer_point.png');
  });
});
