import webmapMock from '../../../../../mocks/webmap';
import { AttributionModel } from '../';

describe('AttributionModel', () => {
  let map: idevio.map.WebMap;
  let attributionModel: AttributionModel;
  beforeEach(() => {
    map = new webmapMock.idevio.map.WebMap();
    attributionModel = new AttributionModel(map);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('setAttribution', () => {
    it('should set attributions and update', () => {
      attributionModel.updateAttribution = jest.fn();
      expect(attributionModel.attributions).toEqual({});
      attributionModel.setAttribution('foobar', 'attribution');
      expect(attributionModel.attributions).toEqual({ foobar: 'attribution' });
      expect(attributionModel.updateAttribution).toHaveBeenCalledTimes(1);
      attributionModel.setAttribution('foobar', 'foobar');
      expect(attributionModel.attributions).toEqual({ foobar: 'foobar' });
      expect(attributionModel.updateAttribution).toHaveBeenCalledTimes(2);
    });
  });

  describe('updateAttribution', () => {
    it('should update with valid map attributions', () => {
      attributionModel.attributions = {
        foo: 'attributions',
        bar: undefined,
        barfoo: 'acc',
        foobar: '',
      };
      attributionModel.updateAttribution();
      expect(attributionModel.map.setAttribution).toHaveBeenCalledWith('attributions, acc');
    });
  });
});
