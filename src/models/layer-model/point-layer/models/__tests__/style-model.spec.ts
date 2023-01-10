import { StyleModel } from '../style-model';
import webmapMock from '../../../../../mocks/webmap';
import layoutMock, { createDumpAttrExpr } from '../../../../../mocks/layout';
import LayoutService from '../../../common/services/layout-service';
import MathUtils from '../../../../../utils/math-utils';

describe('Symbol model', () => {
  let layout: PointLayerLayout;
  let styleModel: StyleModel;
  let data: any;
  let layoutService: LayoutService;
  global.idevio = webmapMock.idevio;

  beforeEach(() => {
    MathUtils.calculateSize = jest.fn().mockReturnValue({ relSize: 5, size: 10 });
    layout = JSON.parse(JSON.stringify(layoutMock.layer.point));
    layout.color.paletteColor.color = 'red';
    layoutService = LayoutService.create(layout);
    styleModel = new StyleModel();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getStyleKey', () => {
    it('should add a symbol and return the key', () => {
      layoutService.meta.attributes = { size: { minValue: 0, maxValue: 0 } } as any;
      data = { size: 0 };
      const key = styleModel.getStyleKey(data, layoutService);

      expect(Object.keys(styleModel.symbols).length).toBe(1);
      expect(styleModel.symbols).toHaveProperty('10_red');
      expect(key).toBe('10_red');
    });

    it('should only cache one symbol', () => {
      data = { id: 0 };
      styleModel.getStyleKey(data, layoutService);
      data = { id: 1 };
      styleModel.getStyleKey(data, layoutService);

      expect(Object.keys(styleModel.symbols).length).toBe(1);
      expect(styleModel.symbols).toHaveProperty('10_red');
    });
  });

  describe('calculateRadiusFromSliderProperties', () => {
    it('should return correct radius when size is an expression', () => {
      layout.size.rangeValues = [8, 22];
      const { radiusMin, radiusMax } = styleModel.calculateRadiusFromSliderProperties(layout.size);
      expect(radiusMin).toEqual(4);
      expect(radiusMax).toEqual(12);
    });
    it('should return correct radius when size is not an expression', () => {
      layout.size.expression = undefined;
      layout.size.value = 10;
      let radius = styleModel.calculateRadiusFromSliderProperties(layout.size);
      expect(radius.radiusMin).toEqual(2);
      expect(radius.radiusMax).toEqual(8);

      layout.size.value = 65;
      radius = styleModel.calculateRadiusFromSliderProperties(layout.size);
      expect(radius.radiusMin).toEqual(45);
      expect(radius.radiusMax).toEqual(135);
    });
  });

  describe('getRadius', () => {
    describe('when size is an expression', () => {
      it('should use correct symbol size', () => {
        layout.size.rangeValues = [8, 22];
        const attrExprInfo = createDumpAttrExpr('size');
        layout.qHyperCube.qDimensionInfo[0].qAttrExprInfo = [attrExprInfo];
        layoutService = LayoutService.create(layout);
        styleModel.getRadius(99, layoutService);
        const size = 99;
        const radiusMinMax = [4, 12];
        const sizeMinMax = [0, 10];
        const quantifyTo = 10;
        expect(MathUtils.calculateSize).toHaveBeenCalledWith(size, radiusMinMax, sizeMinMax, quantifyTo);
      });

      it('should use correct sizeMinMax and quantify when using custom range values', () => {
        layout.size.autoRadiusValueRange = false;
        layout.size.customMinRangeValue = 5;
        layout.size.customMaxRangeValue = 25;
        const attrExprInfo = createDumpAttrExpr('size');
        layout.qHyperCube.qDimensionInfo[0].qAttrExprInfo = [attrExprInfo];
        layoutService = LayoutService.create(layout);
        styleModel.getRadius(88, layoutService);
        const size = 88;
        const radiusMinMax = [4, 12];
        const sizeMinMax = [5, 25];
        const quantifyTo = 20;
        expect(MathUtils.calculateSize).toHaveBeenCalledWith(size, radiusMinMax, sizeMinMax, quantifyTo);
      });
    });
    describe('when size is not an expression', () => {
      it('should use correct sizeMinMax and quantify', () => {
        layout.size.value = 10;
        layoutService = LayoutService.create(layout);
        styleModel.getRadius(undefined, layoutService);
        const size = 8;
        const radiusMinMax = [4, 12];
        const sizeMinMax = [0, 0];
        const quantifyTo = 1;
        expect(MathUtils.calculateSize).toHaveBeenCalledWith(size, radiusMinMax, sizeMinMax, quantifyTo);
      });
    });
  });

  describe('getSizeFromSliderValue', () => {
    it('should return correct slider size when value < 20', () => {
      expect(styleModel.getSizeFromSliderValue(12)).toEqual(6);
      expect(styleModel.getSizeFromSliderValue(4)).toEqual(2);
      expect(styleModel.getSizeFromSliderValue(5)).toEqual(3);
    });
    it('should return correct slider size when value < 40', () => {
      expect(styleModel.getSizeFromSliderValue(20)).toEqual(10);
      expect(styleModel.getSizeFromSliderValue(25)).toEqual(15);
      expect(styleModel.getSizeFromSliderValue(30)).toEqual(20);
    });
    it('should return correct slider size when value < 60', () => {
      expect(styleModel.getSizeFromSliderValue(40)).toEqual(30);
      expect(styleModel.getSizeFromSliderValue(50)).toEqual(50);
      expect(styleModel.getSizeFromSliderValue(55)).toEqual(60);
    });
    it('should return correct slider size when value >= 60', () => {
      expect(styleModel.getSizeFromSliderValue(60)).toEqual(70);
      expect(styleModel.getSizeFromSliderValue(65)).toEqual(90);
      expect(styleModel.getSizeFromSliderValue(80)).toEqual(150);
    });
  });

  describe('getColor', () => {
    it('should return color if mode is primary', () => {
      layout.color.mode = 'primary';
      layout.color.paletteColor.color = 'red';
      layoutService = LayoutService.create(layout);
      const color = styleModel.getColor(layoutService);
      expect(color).toEqual('red');
    });

    it('should return undefined if mode is not primary', () => {
      layout.color.mode = 'foobar';
      layout.color.paletteColor.color = 'red';
      layoutService = LayoutService.create(layout);
      const color = styleModel.getColor(layoutService);
      expect(color).toBeUndefined();
    });
  });

  describe('makeKey', () => {
    it('should makeKey', () => {
      const style = {
        radius: 10,
        color: 'red',
      };
      const symbolKey = styleModel.makeKey(style);
      expect(symbolKey).toEqual('10_red');
    });
  });

  describe('makeSymbol', () => {
    it('should makeSymbol', () => {
      const style = {
        radius: 10,
        color: 'red',
      };
      styleModel.makeSymbol(style);
      expect(webmapMock.idevio.map.IconFactory.circle).toBeCalledTimes(1);
    });
  });

  describe('getStyles', () => {
    it('should return styles', () => {
      const style = styleModel.getStyles()[0];
      const expected = {
        type: 'symbol',
        icons: styleModel.symbols,
        iconKey: 'styleKey',
      };

      expect(style).toEqual(expected);
    });
  });
});
