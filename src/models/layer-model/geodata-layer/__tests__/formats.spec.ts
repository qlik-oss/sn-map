/**
 * @jest-environment jsdom
 */

import webmapMock from '../../../../mocks/webmap';
import layoutMock from '../../../../mocks/layout';
import Formats from '../formats';
import Utils from '../utils';
import GeneralUtils from '../../../../utils/general';

jest.mock('../utils');
jest.mock('../../../../utils/general');

describe('Formats', () => {
  let layout: GeodataLayerProperties;
  let projection: string;
  beforeEach(() => {
    global.idevio = webmapMock.idevio;
    layout = layoutMock.layer.geodata;
    projection = 'mercator';
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getWMSDataset', () => {
    it('should not add url parameters when hasWmsLoaded is false', () => {
      layout.wms.hasWmsLoaded = false;
      const dataset = Formats.getWMSDataset(layout, projection);
      expect(dataset).toBeInstanceOf(idevio.map.WmsDataset);
      expect(GeneralUtils.addUrlParameters).toBeCalledTimes(0);
    });

    it('should add url parameters when hasWmsLoaded is true', () => {
      layout.wms.hasWmsLoaded = true;
      layout.wms.capabilities.layers = [
        {
          selected: true,
          name: '0',
          title: 'foobar',
        },
        {
          selected: false,
          name: '1',
          title: 'foobar',
        },
        {
          selected: true,
          name: '2',
          title: 'foobar',
        },
      ];
      const expectedParams = [
        'service=WMS',
        'transparent=true',
        'request=GetMap',
        'layers=0,2',
        'styles=',
        'format=image/png',
      ];
      const dataset = Formats.getWMSDataset(layout, projection);
      expect(dataset).toBeInstanceOf(idevio.map.WmsDataset);
      expect(GeneralUtils.addUrlParameters).toBeCalledWith('www.wms.bar', expectedParams);
    });
  });

  describe('getTMSDataset', () => {
    it('should return tileDataset when auto is true', () => {
      layout.tms.auto = true;
      const dataset = Formats.getTMSDataset(layout, projection);
      expect(dataset.url).toBe('www.foo.bar');
      expect(dataset.noTileImage).toBeInstanceOf(HTMLImageElement);
      expect(dataset.failedTileImage).toBeInstanceOf(HTMLImageElement);
    });
    it('should return tileDataset when auto is false', () => {
      layout.tms.auto = false;
      const dataset = Formats.getTMSDataset(layout, projection);
      expect(dataset.url).toBe('www.foo.bar');
      expect(dataset.crs).toBe('EPSG:3857');
      expect(dataset.levels).toBe(20);
      expect(dataset.tileSizePixels).toBe(10);
      expect(dataset.originX).toBe(1);
      expect(dataset.noTileImage).toBeInstanceOf(HTMLImageElement);
      expect(dataset.failedTileImage).toBeInstanceOf(HTMLImageElement);
    });
    it('should parse url', () => {
      layout.tms.auto = true;
      const dataset = Formats.getTMSDataset(layout, projection);
      expect(dataset.urlFunction).toBeDefined();
      const result = (dataset as any).urlFunction('path', 0, 0, 10);
      expect(Utils.parseUrl).toBeCalledTimes(1);
      expect(result).not.toBe(null);
    });
    it('should return null when parse url fails', () => {
      layout.tms.auto = true;
      Utils.parseUrl = jest.fn().mockImplementation(() => {
        throw new Error();
      });
      const dataset = Formats.getTMSDataset(layout, projection);
      expect(dataset.urlFunction).toBeDefined();
      const result = (dataset as any).urlFunction('path', 0, 0, 10);
      expect(Utils.parseUrl).toBeCalledTimes(1);
      expect(result).toBe(null);
    });
  });

  describe('getImageDataset', () => {
    it('should return static image dataset', () => {
      const dataset = Formats.getImageDataset(layout);
      expect(dataset).toBeInstanceOf(idevio.map.StaticImageDataset);
    });
  });

  describe('getMapCrs', () => {
    it('should return EPSG:3857', () => {
      const mapCrs = Formats.getMapCrs('');
      expect(mapCrs).toBe('EPSG:3857');
    });

    it('should return EPSG:4326', () => {
      let mapCrs = Formats.getMapCrs('foobar_adaptive');
      expect(mapCrs).toBe('EPSG:4326');
      mapCrs = Formats.getMapCrs('empty_foobar');
      expect(mapCrs).toBe('EPSG:4326');
    });
  });
});
