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
    layout = layoutMock.layer.point;
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
