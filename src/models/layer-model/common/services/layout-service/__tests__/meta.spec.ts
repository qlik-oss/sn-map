import Meta from '../meta';
import layoutMock from '../../../../../../mocks/layout';
import mockLayout, { createDumpAttrExpr, createDumpAttrDim } from '../../../../../../mocks/layout';

describe('Layout service meta', () => {
  let layout: PointLayerLayout;

  beforeEach(() => {
    layout = JSON.parse(JSON.stringify(layoutMock.layer.point));
    layout.qHyperCube.qDataPages = [];
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getLocationMeta', () => {
    it('should return location meta with no expressions', () => {
      layout.locationType = 'Country';
      layout.isLatLong = false;
      layout.locationNamesAuto = false;
      const meta = Meta.getLocationMeta(layout);
      expect(meta.expressions).not.toBeDefined();
      expect(meta.hasLocation).toBe(false);
      expect(meta.isAuto).toBe(false);
      expect(meta.isLatLong).toBe(false);
      expect(meta.locationType).toBe('Country');
    });

    it('should return location meta with expressions', () => {
      layout.locationType = 'Country';
      layout.isLatLong = false;
      layout.locationNamesAuto = false;
      layout.locationOrLatitude = { key: 'foobar', type: '' };
      layout.qHyperCube.qDimensionInfo[0].qAttrExprInfo.push({ id: 'locationOrLatitude' } as any);
      const meta = Meta.getLocationMeta(layout);
      expect(meta.expressions).toBeDefined();
      expect(meta.hasLocation).toBe(true);
      expect(meta.isAuto).toBe(false);
      expect(meta.isLatLong).toBe(false);
      expect(meta.locationType).toBe('Country');
    });
  });

  describe('getLocationExpression', () => {
    it('should get locationOrLatitude expressions', () => {
      layout.isLatLong = false;
      layout.locationNamesAuto = true;
      layout.qHyperCube.qDimensionInfo[0].qAttrExprInfo.push({ id: 'locationOrLatitude' } as any);
      const meta = Meta.getLocationExpression(layout);
      expect(meta.length).toBe(1);
      expect(meta[0].id).toBe('locationOrLatitude');
    });

    it('should get locationOrLatitude and longitude expressions', () => {
      layout.isLatLong = true;
      layout.locationNamesAuto = true;
      layout.qHyperCube.qDimensionInfo[0].qAttrExprInfo.push({ id: 'longitude' } as any);
      layout.qHyperCube.qDimensionInfo[0].qAttrExprInfo.push({ id: 'locationOrLatitude' } as any);
      const meta = Meta.getLocationExpression(layout);
      expect(meta.length).toBe(2);
      expect(meta[0].id).toBe('locationOrLatitude');
      expect(meta[1].id).toBe('longitude');
    });

    it('should get locationOrLatitude and name expressions', () => {
      layout.isLatLong = false;
      layout.locationNamesAuto = false;
      layout.qHyperCube.qDimensionInfo[0].qAttrExprInfo.push({ id: 'locationOrLatitude' } as any);
      layout.qHyperCube.qDimensionInfo[0].qAttrExprInfo.push({ id: 'locationCountry' } as any);
      layout.qHyperCube.qDimensionInfo[0].qAttrExprInfo.push({ id: 'locationAdmin1' } as any);
      layout.qHyperCube.qDimensionInfo[0].qAttrExprInfo.push({ id: 'locationAdmin2' } as any);
      const meta = Meta.getLocationExpression(layout);
      expect(meta.length).toBe(4);
      expect(meta[0].id).toBe('locationOrLatitude');
      expect(meta[1].id).toBe('locationCountry');
      expect(meta[2].id).toBe('locationAdmin1');
      expect(meta[3].id).toBe('locationAdmin2');
    });
  });

  describe('getExpressionMeta', () => {
    it('should get attribute expression meta from layout', () => {
      layout.qHyperCube.qDimensionInfo[0].qAttrExprInfo.push({ id: 'foobar' } as any);
      const meta = Meta.getExpressionMeta('foobar', layout);
      expect(meta[0].id).toBe('foobar');
      expect(meta[0].index).toBe(0);
      expect(meta[0].dimIndex).toBe(0);
      expect(meta[0].isDimension).toBe(false);
    });

    it('should get dimension expression meta from layout', () => {
      layout.qHyperCube.qDimensionInfo.push({ qAttrExprInfo: [], qAttrDimInfo: [] } as any);
      layout.qHyperCube.qDimensionInfo[1].qAttrDimInfo.push({ id: 'dummy' } as any);
      layout.qHyperCube.qDimensionInfo[1].qAttrDimInfo.push({ id: 'dummy' } as any);
      layout.qHyperCube.qDimensionInfo[1].qAttrDimInfo.push({ id: 'foobar' } as any);
      const meta = Meta.getExpressionMeta('foobar', layout);
      expect(meta[0].id).toBe('foobar');
      expect(meta[0].index).toBe(2);
      expect(meta[0].dimIndex).toBe(1);
      expect(meta[0].isDimension).toBe(true);
    });

    it('should get empty array when no expression', () => {
      layout.qHyperCube.qDimensionInfo[0].qAttrExprInfo.push({ id: 'dummy' } as any);
      const meta = Meta.getExpressionMeta('foobar', layout);
      expect(meta.length).toBe(0);
    });
  });

  describe('getMinMax', () => {
    describe('getMinMax', () => {
      let layout: LayerLayout;
      const attrExpsId1 = 'attrExpsId_1';
      const attrExpsId2 = 'attrExpsId_2';

      beforeEach(() => {
        layout = JSON.parse(JSON.stringify(mockLayout.layer.base));
      });

      it('should not return a minMax when the attribute is a measure', () => {
        const attrExps1 = createDumpAttrExpr(attrExpsId1);
        const attrExps2 = createDumpAttrExpr(attrExpsId2);
        layout.qHyperCube.qDimensionInfo.push({
          qFallbackTitle: '',
          qAttrExprInfo: [attrExps1, attrExps2],
          qAttrDimInfo: [],
        });
        const [dimExpsInfo] = Meta.getExpressionMeta(attrExpsId2, layout);
        const minMax = Meta.getMinMax(layout, dimExpsInfo);
        expect(minMax?.min).toEqual(0);
        expect(minMax?.max).toEqual(10);
      });

      it('should not return a minMax when the attribute is not a measure', () => {
        const attrExps1 = createDumpAttrDim(attrExpsId1);
        const attrExps2 = createDumpAttrDim(attrExpsId2);
        layout.qHyperCube.qDimensionInfo.push({
          qFallbackTitle: '',
          qAttrExprInfo: [],
          qAttrDimInfo: [attrExps1, attrExps2],
        });
        const [dimExpsInfo] = Meta.getExpressionMeta(attrExpsId2, layout);
        const minMax = Meta.getMinMax(layout, dimExpsInfo);
        expect(minMax).toBeUndefined();
      });
    });
  });
});
