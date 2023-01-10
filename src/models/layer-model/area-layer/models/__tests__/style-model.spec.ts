import { StyleModel } from '../style-model';
import webmapMock from '../../../../../mocks/webmap';
import layoutMock from '../../../../../mocks/layout';
import LayoutService from '../../../common/services/layout-service';

describe('Symbol model', () => {
  let layout: AreaLayerLayout;
  let styleModel: StyleModel;
  let data: any;
  let layoutService: LayoutService;
  global.idevio = webmapMock.idevio;

  beforeEach(() => {
    layout = JSON.parse(JSON.stringify(layoutMock.layer.area));
    layout.color.paletteColor.color = 'red';
    layoutService = LayoutService.create(layout);
    styleModel = new StyleModel();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getStyleKey', () => {
    it('should add a symbol and return the key', () => {
      const key = styleModel.getStyleKey(layoutService);

      expect(Object.keys(styleModel.colorTable).length).toBe(1);
      expect(styleModel.colorTable).toHaveProperty('red');
      expect(key).toBe('red');
    });

    it('should only cache one symbol', () => {
      data = { id: 0 };
      styleModel.getStyleKey(layoutService);
      data = { id: 1 };
      styleModel.getStyleKey(layoutService);

      expect(Object.keys(styleModel.colorTable).length).toBe(1);
      expect(styleModel.colorTable).toHaveProperty('red');
    });
  });

  describe('getColor', () => {
    it('should return color if mode is primary', () => {
      layout.color.mode = 'primary';
      layout.color.paletteColor.color = 'green';
      layoutService = LayoutService.create(layout);
      const color = styleModel.getColor(layoutService);
      expect(color).toEqual('green');
    });

    it('should return undefined if mode is not primary', () => {
      layout.color.mode = 'foobar';
      layout.color.paletteColor.color = 'red';
      layoutService = LayoutService.create(layout);
      const color = styleModel.getColor(layoutService);
      expect(color).toBeUndefined();
    });
  });

  describe('getStyles', () => {
    it('should return styles', () => {
      const style = styleModel.getStyles()[0];
      const expected = {
        type: 'polygon',
        colorKey: 'styleKey',
        colors: styleModel.colorTable,
        outline: 'black',
      };

      expect(style).toEqual(expected);
    });
  });
});
