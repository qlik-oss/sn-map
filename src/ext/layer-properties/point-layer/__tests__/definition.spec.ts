import getPointLayerDefinition from '../definition';
import env from '../../../../mocks/environment';
import Util from '../../../utils/layers';
import mockProperties from '../../../../mocks/properties';

describe('pointLayerDefinition', () => {
  let layerProps: PointLayerProperties;

  beforeEach(() => {
    layerProps = JSON.parse(JSON.stringify(mockProperties.layer.point));
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should return point layer definition', () => {
    const definition = getPointLayerDefinition(env);
    expect(definition.component).toEqual('accordion');
    expect(definition.items.general.show).toEqual(false);
  });

  describe('definition title', () => {
    it('should return layer title', () => {
      Util.getLayerTitle = jest.fn().mockReturnValue('foobar');
      const definition = getPointLayerDefinition(env);
      const title = definition.title(layerProps, {});
      expect(title).toBe('foobar');
    });

    it('should return noName translation key', () => {
      Util.getLayerTitle = jest.fn().mockReturnValue(undefined);
      const definition = getPointLayerDefinition(env);
      const title = definition.title(layerProps, {});
      expect(title).toBe('geo.dropmenu.noName');
    });
  });
});
