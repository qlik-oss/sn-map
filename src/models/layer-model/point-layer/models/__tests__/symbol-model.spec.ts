import { SymbolModel } from '../symbol-model';
import webmapMock from '../../../../../mocks/webmap';
import layoutMock from '../../../../../mocks/layout';
import LayoutService from '../../services/layout-service';

describe('Symbol model', () => {
  let layout: PointLayerLayout;
  let symbolModel: SymbolModel;
  let data: PointData[];
  let layoutService: LayoutService;
  global.idevio = webmapMock.idevio;

  beforeEach(() => {
    layout = JSON.parse(JSON.stringify(layoutMock.layer.point));
    layout.color.paletteColor.color = 'red';
    layoutService = LayoutService.create(layout);
    symbolModel = new SymbolModel();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addSymbol', () => {
    it('should not add symbols', () => {
      data = [];
      symbolModel.addSymbol(data, layoutService);

      expect(Object.keys(symbolModel.symbols).length).toBe(0);
      expect('8_red' in symbolModel.symbols).toBeFalsy();
    });

    it('should add symbols', () => {
      data = [{ id: 0 }];
      symbolModel.addSymbol(data, layoutService);

      expect(Object.keys(symbolModel.symbols).length).toBe(1);
      expect('8_red' in symbolModel.symbols).toBeTruthy();
    });

    it('should only cache one symbol', () => {
      data = [{ id: 0 }, { id: 0 }];
      symbolModel.addSymbol(data, layoutService);

      expect(Object.keys(symbolModel.symbols).length).toBe(1);
      expect('8_red' in symbolModel.symbols).toBeTruthy();
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

  describe('calculateRadiusFromSliderProperties', () => {
    it('should return correct radius when size is an expression', () => {
      layout.size.rangeValues = [8, 22];
      layoutService = LayoutService.create(layout);
      const { radiusMin, radiusMax } = symbolModel.calculateRadiusFromSliderProperties(
        layoutService.getLayoutValue('size')
      );
      expect(radiusMin).toEqual(4);
      expect(radiusMax).toEqual(12);
    });
    it('should return correct radius when size is not an expression', () => {
      layout.size.expression = undefined;
      layout.size.value = 10;
      layoutService = LayoutService.create(layout);
      let radius = symbolModel.calculateRadiusFromSliderProperties(layoutService.getLayoutValue('size'));
      expect(radius.radiusMin).toEqual(2);
      expect(radius.radiusMax).toEqual(8);

      layout.size.value = 65;
      layoutService = LayoutService.create(layout);
      radius = symbolModel.calculateRadiusFromSliderProperties(layoutService.getLayoutValue('size'));
      expect(radius.radiusMin).toEqual(45);
      expect(radius.radiusMax).toEqual(135);
    });
  });

  describe('getSize', () => {
    it('should return correct symbol size when size is an expression', () => {
      layout.size.rangeValues = [8, 22];
      const attrExprInfo = {
        id: 'size',
        qMin: 0,
        qMax: 10,
        qContinuousAxes: true,
        qIsCyclic: false,
        qIsAutoFormat: false,
        label: '',
        qFallbackTitle: '',
      };
      layout.qHyperCube.qDimensionInfo[0].qAttrExprInfo = [attrExprInfo];
      layoutService = LayoutService.create(layout);
      const symbolSize = symbolModel.getSize(
        { id: 0, size: { value: 8, expressionMeta: { index: 0, dimIndex: 0, id: 'size', isDimension: false } } },
        layoutService
      );
      expect(symbolSize).toEqual(10);
    });

    it('should return correct symbol size when size is not an expression', () => {
      layout.size.expression = undefined;
      layout.size.value = 10;
      layoutService = LayoutService.create(layout);
      const symbolSize = symbolModel.getSize({ id: 0 }, layoutService);
      expect(symbolSize).toEqual(5);
    });
  });

  it('should get styles', () => {
    data = [{ id: 0 }];
    symbolModel.addSymbol(data, layoutService);
    const style = symbolModel.getStyles()[0];
    const expected = {
      type: 'symbol',
      icons: {
        red: undefined,
      },
      iconKey: 'key',
    };

    expect(style).toEqual(expected);
  });
});
