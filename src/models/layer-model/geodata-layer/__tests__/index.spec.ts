/**
 * @jest-environment jsdom
 */

import webmapMock from '../../../../mocks/webmap';
import mapModelMock from '../../../../mocks/map-model';
import layoutMock from '../../../../mocks/layout';
import { GeodataLayerModel } from '../';
import Formats from '../formats';

jest.mock('../formats');

describe('GeodataLayerModel', () => {
  let layout: GeodataLayerProperties;
  let mapModel: MapModelInterFace;
  let geodataLayerModel: GeodataLayerModel;

  beforeEach(() => {
    global.idevio = webmapMock.idevio;
    layout = JSON.parse(JSON.stringify(layoutMock.layer.geodata));
    mapModel = mapModelMock;
    mapModel.settings = { projection: '' } as any;
    geodataLayerModel = new GeodataLayerModel(mapModel, 'id');
    geodataLayerModel.mapModel.attributionModel = { setAttribution: jest.fn() };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('update', () => {
    beforeEach(() => {
      geodataLayerModel.remove = jest.fn();
      geodataLayerModel.layer = { getDataset: jest.fn(), setAlpha: jest.fn() } as any;
    });
    describe('tms', () => {
      beforeEach(() => {
        layout.dataType = 'tms';
        geodataLayerModel.createTMSLayer = jest.fn();
        geodataLayerModel.updateAttributions = jest.fn();
      });
      it('should update if props and attribution have changed', () => {
        geodataLayerModel.oldProps = {} as any;
        geodataLayerModel.update(layout);
        expect(geodataLayerModel.updateAttributions).toHaveBeenCalled();
        expect(geodataLayerModel.createTMSLayer).toHaveBeenCalled();
        expect(geodataLayerModel.remove).toHaveBeenCalled();
        expect(geodataLayerModel.layer.getDataset).toHaveBeenCalled();
        expect(geodataLayerModel.layer.setAlpha).toHaveBeenCalled();
      });
      it('should not create tms layer if props and attribution have not changed', () => {
        geodataLayerModel.oldProps = layout.tms;
        geodataLayerModel.currentAttribution = layout.tms.attribution;
        geodataLayerModel.update(layout);
        expect(geodataLayerModel.updateAttributions).toHaveBeenCalled();
        expect(geodataLayerModel.createTMSLayer).not.toHaveBeenCalled();
        expect(geodataLayerModel.remove).not.toHaveBeenCalled();
      });
    });

    describe('image', () => {
      beforeEach(() => {
        layout.dataType = 'image';
        geodataLayerModel.createImageLayer = jest.fn();
        geodataLayerModel.updateAttributions = jest.fn();
      });
      it('should update if props and attribution have changed', () => {
        geodataLayerModel.oldProps = {} as any;
        geodataLayerModel.update(layout);
        expect(geodataLayerModel.updateAttributions).toHaveBeenCalled();
        expect(geodataLayerModel.createImageLayer).toHaveBeenCalled();
        expect(geodataLayerModel.remove).toHaveBeenCalled();
        expect(geodataLayerModel.layer.getDataset).toHaveBeenCalled();
        expect(geodataLayerModel.layer.setAlpha).toHaveBeenCalled();
      });
      it('should not create image layer if props and attribution have not changed', () => {
        geodataLayerModel.oldProps = layout.image;
        geodataLayerModel.currentAttribution = layout.image.attribution;
        geodataLayerModel.update(layout);
        expect(geodataLayerModel.updateAttributions).toHaveBeenCalled();
        expect(geodataLayerModel.createImageLayer).not.toHaveBeenCalled();
        expect(geodataLayerModel.remove).not.toHaveBeenCalled();
      });
    });

    describe('wms', () => {
      beforeEach(() => {
        layout.dataType = 'wms';
        geodataLayerModel.createWMSLayer = jest.fn();
        geodataLayerModel.updateAttributions = jest.fn();
      });
      it('should update if props and attribution have changed', () => {
        geodataLayerModel.oldProps = {} as any;
        geodataLayerModel.update(layout);
        expect(geodataLayerModel.updateAttributions).toHaveBeenCalled();
        expect(geodataLayerModel.createWMSLayer).toHaveBeenCalled();
        expect(geodataLayerModel.remove).toHaveBeenCalled();
        expect(geodataLayerModel.layer.getDataset).toHaveBeenCalled();
        expect(geodataLayerModel.layer.setAlpha).toHaveBeenCalled();
      });
      it('should not create wms layer if props and attribution have not changed', () => {
        geodataLayerModel.oldProps = layout.wms;
        geodataLayerModel.currentAttribution = layout.wms.attribution;
        geodataLayerModel.update(layout);
        expect(geodataLayerModel.updateAttributions).toHaveBeenCalled();
        expect(geodataLayerModel.createWMSLayer).not.toHaveBeenCalled();
        expect(geodataLayerModel.remove).not.toHaveBeenCalled();
      });
    });
  });

  describe('updateAttributions', () => {
    it('should update if props and attribution have changed', () => {
      geodataLayerModel.currentAttribution = 'foobar';
      geodataLayerModel.updateAttributions('changed');
      expect(geodataLayerModel.mapModel.attributionModel.setAttribution).toHaveBeenCalled();
    });
    it('should not update if props and attribution have not changed', () => {
      geodataLayerModel.currentAttribution = 'foobar';
      geodataLayerModel.updateAttributions('foobar');
      expect(geodataLayerModel.mapModel.attributionModel.setAttribution).not.toHaveBeenCalled();
    });
  });

  describe('resetLayer', () => {
    beforeEach(() => {
      geodataLayerModel.remove = jest.fn();
      geodataLayerModel.layer = { getDataset: jest.fn() } as any;
    });
    it('should remove and set current/old props', () => {
      const props = { url: 'foobar' } as any;
      geodataLayerModel.resetLayer(props);
      expect(geodataLayerModel.remove).toHaveBeenCalled();
      expect(geodataLayerModel.oldProps).toEqual({ url: 'foobar' });
      expect(geodataLayerModel.currentUrl).toBe('foobar');
    });
  });

  describe('createTMSLayer', () => {
    it('should create a new TMS layer', () => {
      Formats.getTMSDataset = jest.fn().mockReturnValue({});
      geodataLayerModel.createTMSLayer(layout);
      expect(Formats.getTMSDataset).toHaveBeenCalled();
      expect(geodataLayerModel.layer).toBeInstanceOf(idevio.map.TiledImageLayer);
    });
  });

  describe('createImageLayer', () => {
    it('should create a new Image layer', () => {
      Formats.getImageDataset = jest.fn().mockReturnValue({});
      geodataLayerModel.createImageLayer(layout);
      expect(Formats.getImageDataset).toHaveBeenCalled();
      expect(geodataLayerModel.layer).toBeInstanceOf(idevio.map.StaticImageLayer);
    });
  });

  describe('createWMSLayer', () => {
    it('should create a new WMS layer', () => {
      Formats.getWMSDataset = jest.fn().mockReturnValue({});
      geodataLayerModel.createWMSLayer(layout);
      expect(Formats.getWMSDataset).toHaveBeenCalled();
      expect(geodataLayerModel.layer).toBeInstanceOf(idevio.map.WmsLayer);
    });
  });

  describe('havePropsChanged', () => {
    it('should return true if props have changed', () => {
      const newProps = {
        foo: 'bar',
        empty: '',
        num: 0,
      } as any;
      const oldProps = {
        foo: 'bar',
        empty: '',
        num: 1,
      } as any;
      const result = geodataLayerModel.havePropsChanged(newProps, oldProps);
      expect(result).toBe(true);
    });
    it('should return false if props have not changed', () => {
      const newProps = {
        foo: 'bar',
        empty: '',
        num: 0,
      } as any;
      const oldProps = {
        foo: 'bar',
        empty: '',
        num: 0,
      } as any;
      const result = geodataLayerModel.havePropsChanged(newProps, oldProps);
      expect(result).toBe(false);
    });
  });

  describe('remove', () => {
    it('should remove layer ', () => {
      geodataLayerModel.layer = {
        remove: jest.fn(),
      } as any;
      geodataLayerModel.remove();
      expect(geodataLayerModel.layer.remove).toHaveBeenCalled();
    });
  });
});
