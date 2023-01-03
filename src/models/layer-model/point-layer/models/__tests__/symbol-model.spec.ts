import { SymbolModel } from '../symbol-model';
import webmapMock from '../../../../../mocks/webmap';
import layoutMock, { createDumpAttrExpr } from '../../../../../mocks/layout';
import LayoutService from '../../../common/services/layout-service';
import MathUtils from '../../../../../utils/math-utils';

describe('Symbol model', () => {
  let layout: PointLayerLayout;
  let symbolModel: SymbolModel;
  let data: any;
  let layoutService: LayoutService;
  global.idevio = webmapMock.idevio;

  beforeEach(() => {
    MathUtils.calculateSize = jest.fn().mockReturnValue({ relSize: 5, size: 10 });
    layout = JSON.parse(JSON.stringify(layoutMock.layer.point));
    layout.color.paletteColor.color = 'red';
    layoutService = LayoutService.create(layout);
    symbolModel = new SymbolModel();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSymbolKey', () => {
    it('should add a symbol and return the key', () => {
      layoutService.meta.attributes = { size: { minValue: 0, maxValue: 0 } } as any;
      data = { size: 0 };
      const key = symbolModel.getSymbolKey(data, layoutService);

      expect(Object.keys(symbolModel.symbols).length).toBe(1);
      expect('10_red' in symbolModel.symbols).toBeDefined();
      expect(key).toBe('10_red');
    });

    it('should only cache one symbol', () => {
      data = { id: 0 };
      symbolModel.getSymbolKey(data, layoutService);
      data = { id: 1 };
      symbolModel.getSymbolKey(data, layoutService);

      expect(Object.keys(symbolModel.symbols).length).toBe(1);
      expect('10_red' in symbolModel.symbols).toBeDefined();
    });
  });

  describe('calculateRadiusFromSliderProperties', () => {
    it('should return correct radius when size is an expression', () => {
      layout.size.rangeValues = [8, 22];
      const { radiusMin, radiusMax } = symbolModel.calculateRadiusFromSliderProperties(layout.size);
      expect(radiusMin).toEqual(4);
      expect(radiusMax).toEqual(12);
    });
    it('should return correct radius when size is not an expression', () => {
      layout.size.expression = undefined;
      layout.size.value = 10;
      let radius = symbolModel.calculateRadiusFromSliderProperties(layout.size);
      expect(radius.radiusMin).toEqual(2);
      expect(radius.radiusMax).toEqual(8);

      layout.size.value = 65;
      radius = symbolModel.calculateRadiusFromSliderProperties(layout.size);
      expect(radius.radiusMin).toEqual(45);
      expect(radius.radiusMax).toEqual(135);
    });
  });

  describe('getSize', () => {
    describe('when size is an expression', () => {
      it('should use correct symbol size', () => {
        layout.size.rangeValues = [8, 22];
        const attrExprInfo = createDumpAttrExpr('size');
        layout.qHyperCube.qDimensionInfo[0].qAttrExprInfo = [attrExprInfo];
        layoutService = LayoutService.create(layout);
        symbolModel.getSize(99, layoutService);
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
        symbolModel.getSize(88, layoutService);
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
        symbolModel.getSize(undefined, layoutService);
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
      expect(symbolModel.getSizeFromSliderValue(12)).toEqual(6);
      expect(symbolModel.getSizeFromSliderValue(4)).toEqual(2);
      expect(symbolModel.getSizeFromSliderValue(5)).toEqual(3);
    });
    it('should return correct slider size when value < 40', () => {
      expect(symbolModel.getSizeFromSliderValue(20)).toEqual(10);
      expect(symbolModel.getSizeFromSliderValue(25)).toEqual(15);
      expect(symbolModel.getSizeFromSliderValue(30)).toEqual(20);
    });
    it('should return correct slider size when value < 60', () => {
      expect(symbolModel.getSizeFromSliderValue(40)).toEqual(30);
      expect(symbolModel.getSizeFromSliderValue(50)).toEqual(50);
      expect(symbolModel.getSizeFromSliderValue(55)).toEqual(60);
    });
    it('should return correct slider size when value >= 60', () => {
      expect(symbolModel.getSizeFromSliderValue(60)).toEqual(70);
      expect(symbolModel.getSizeFromSliderValue(65)).toEqual(90);
      expect(symbolModel.getSizeFromSliderValue(80)).toEqual(150);
    });
  });

  describe('getColor', () => {
    it('should return color if mode is primary', () => {
      layout.color.mode = 'primary';
      layout.color.paletteColor.color = 'red';
      layoutService = LayoutService.create(layout);
      const color = symbolModel.getColor(layoutService);
      expect(color).toEqual('red');
    });

    it('should return undefined if mode is not primary', () => {
      layout.color.mode = 'foobar';
      layout.color.paletteColor.color = 'red';
      layoutService = LayoutService.create(layout);
      const color = symbolModel.getColor(layoutService);
      expect(color).toBeUndefined();
    });
  });

  describe('makeKey', () => {
    it('should makeKey', () => {
      const style = {
        size: 10,
        color: 'red',
      };
      const symbolKey = symbolModel.makeKey(style);
      expect(symbolKey).toEqual('10_red');
    });
  });

  describe('makeSymbol', () => {
    it('should makeSymbol', () => {
      const style = {
        size: 10,
        color: 'red',
      };
      symbolModel.makeSymbol(style);
      expect(webmapMock.idevio.map.IconFactory.circle).toBeCalledTimes(1);
    });
  });

  describe('getStyles', () => {
    it('should return styles', () => {
      symbolModel.symbols = 'foobar' as any;
      const style = symbolModel.getStyles()[0];
      const expected = {
        type: 'symbol',
        icons: 'foobar',
        iconKey: 'key',
      };

      expect(style).toEqual(expected);
    });
  });
});
