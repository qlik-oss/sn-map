import Util from '../layers';
import mockProperties from '../../../mocks/properties';
import mockLayout from '../../../mocks/layout';
import webmapMock from '../../../mocks/webmap';
import LayerType from '../../../utils/const/layer-type';

describe('LayersUtil', () => {
  let layerProps: LayerProperties;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('insertLayer', () => {
    let layer: any;
    beforeEach(() => {
      layerProps = JSON.parse(JSON.stringify(mockProperties.layer.point));
      layer = new webmapMock.idevio.map.FeatureLayer();
      layer.type = LayerType.POINT;
      layer.getDataset = jest.fn().mockImplementation(() => {
        return {
          addData: jest.fn(),
        };
      });
    });

    it('should insert a new layer and return its index when it is not the lowest priority', () => {
      const layers = [layer];
      layerProps.type = LayerType.CHART;
      const layerIndex = Util.insertLayer(layerProps, layers);
      expect(layerIndex).toBe(1);
      expect(layers.length).toBe(2);
    });

    it('should insert a new layer and return its index when it is the lowest priority', () => {
      const layers = [layer];
      const layerIndex = Util.insertLayer(layerProps, layers);
      expect(layerIndex).toBe(0);
      expect(layers.length).toBe(2);
      expect(layers[1].type).toBe(LayerType.POINT);
    });
  });

  describe('getLayerTitle', () => {
    let dimensions: NxDimension[];
    let handler: any;
    beforeEach(() => {
      dimensions = JSON.parse(JSON.stringify(mockProperties.layer.point.qHyperCubeDef.qDimensions));
      handler = {
        getDimensionLayout: jest.fn().mockReturnValue({}),
      };
    });

    it('should return empty string when no dimensions', () => {
      const title = Util.getLayerTitle([], handler);
      expect(title).toBe('');
    });

    it('should return empty string when no dimension layout', () => {
      handler.getDimensionLayout = jest.fn().mockReturnValue(undefined);
      const title = Util.getLayerTitle(dimensions, handler);
      expect(title).toBe('');
    });
  });

  describe('extractTitle', () => {
    let properties: NxDimension;
    let layout: NxDimensionInfo;
    beforeEach(() => {
      properties = JSON.parse(JSON.stringify(mockProperties.layer.point.qHyperCubeDef.qDimensions[0]));
      layout = JSON.parse(JSON.stringify(mockLayout.layer.base.qHyperCube.qDimensionInfo[0]));
    });

    it('should return Error when dimension layout has qError', () => {
      layout.qError = 'foobar';
      const title = Util.extractTitle(properties, layout);
      expect(title).toBe('Error');
    });

    it('should return layout title when it is a drill down dimension', () => {
      layout.qGrouping = 'H';
      layout.title = 'foobar';
      const title = Util.extractTitle(properties, layout);
      expect(title).toBe('foobar');
    });

    it('should return empty string when it is a drill down dimension and title is missing', () => {
      layout.qGrouping = 'H';
      const title = Util.extractTitle(properties, layout);
      expect(title).toBe('');
    });

    it('should return layout title when it is a library dimension', () => {
      layout.title = 'foobar';
      properties.qLibraryId = 'id';
      const title = Util.extractTitle(properties, layout);
      expect(title).toBe('foobar');
    });

    it('should return qLabelExpression', () => {
      properties.qDef.qLabelExpression = 'foo';
      const title = Util.extractTitle(properties, layout);
      expect(title).toBe('foo');
    });

    it('should return qFallbackTitle', () => {
      properties.qDef.qLabelExpression = undefined;
      layout.qFallbackTitle = 'bar';
      const title = Util.extractTitle(properties, layout);
      expect(title).toBe('bar');
    });

    it('should return empty string when no qLabelExpression or qFallbackTitle', () => {
      properties.qDef.qLabelExpression = undefined;
      const title = Util.extractTitle(properties, layout);
      expect(title).toBe('');
    });
  });
});
