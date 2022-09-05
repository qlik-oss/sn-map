/**
 * @jest-environment jsdom
 */

import webmapMock from '../../../../../../mocks/webmap';
import ScaleBarTool from '..';

describe('Scale Bar Tools', () => {
  let webmapElement: HTMLElement;
  let webmapFirstChild: HTMLElement;
  let scaleBarTool: ScaleBarTool;
  let map: idevio.map.WebMap;

  beforeEach(() => {
    global.idevio = webmapMock.idevio;
    webmapElement = document.createElement('div');
    webmapFirstChild = document.createElement('canvas');
    webmapElement.appendChild(webmapFirstChild);
    const wmOptions: idevio.map.WebMapOptions = {
      div: webmapElement,
      center: [30, 0],
      zoomLevel: 3,
    };
    map = new idevio.map.WebMap(wmOptions);
    map.getDiv = () => webmapElement;
    scaleBarTool = new ScaleBarTool();
    scaleBarTool._map = map;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error when invalid scale type', () => {
    expect(() => {
      scaleBarTool = new ScaleBarTool({ type: 'foobar' } as any);
    }).toThrow(`Invalid ScaleBar argument '${'foobar'}'`);
  });

  it('should construct scaleBarTool correctly', () => {
    expect(scaleBarTool.useImperial).toEqual(false);
  });

  describe('connecting', () => {
    it('should execute all functions when connecting twice', () => {
      // connect
      map.getDistanceInMeters = jest.fn().mockReturnValue(10);
      scaleBarTool._connecting();
      expect(map.addListener).toHaveBeenCalledWith('draw', expect.any(Function));
      expect(scaleBarTool._map!.getDistanceInMeters).toHaveBeenCalledTimes(1);
      expect(scaleBarTool._map!.getDiv().firstChild?.firstChild).toBeDefined();
      expect(scaleBarTool._map!.getDiv().firstChild?.firstChild).not.toEqual(null);
      expect(scaleBarTool._map!.getDiv().querySelector('span')!.innerHTML).toEqual('10 m');

      // connect for a second time
      scaleBarTool._connecting();
      expect(scaleBarTool._map!.getDistanceInMeters).toHaveBeenCalledTimes(2);
      expect(scaleBarTool._map!.getDiv().firstChild?.firstChild).toBeDefined();
      expect(scaleBarTool._map!.getDiv().firstChild?.firstChild).not.toEqual(null);
    });

    it('should scale to 1 km when connecting with geoLength>1000 and useImperial=false', () => {
      map.getDistanceInMeters = jest.fn().mockReturnValue(1001);
      scaleBarTool._connecting();
      expect(scaleBarTool._map!.getDiv().querySelector('span')!.innerHTML).toEqual('1 km');
    });

    it('should scale to 500 m when connecting with geoLength<=1000 and useImperial=false', () => {
      map.getDistanceInMeters = jest.fn().mockReturnValue(1000);
      scaleBarTool._connecting();
      expect(scaleBarTool._map!.getDiv().querySelector('span')!.innerHTML).toEqual('500 m');
    });

    it('should scale to 1 mi when connecting with geoLength>5280 and useImperial=true', () => {
      scaleBarTool.useImperial = true;
      map.getDistanceInMeters = jest.fn().mockReturnValue(5281);
      scaleBarTool._connecting();
      expect(scaleBarTool._map!.getDiv().querySelector('span')!.innerHTML).toEqual('1 mi');
    });

    it('should scale to 5000 ft when connecting with geoLength<=5280 and useImperial=true', () => {
      scaleBarTool.useImperial = true;
      map.getDistanceInMeters = jest.fn().mockReturnValue(5280);
      scaleBarTool._connecting();
      expect(scaleBarTool._map!.getDiv().querySelector('span')!.innerHTML).toEqual('5000 ft');
    });

    it('should not connect when not map', () => {
      scaleBarTool._map = null;
      scaleBarTool._connecting();
      expect(map.getDistanceInMeters).not.toHaveBeenCalledTimes(1);
    });
  });

  describe('disconnecting', () => {
    it('should remove the div when disconnecting', () => {
      // connect
      map.getDistanceInMeters = jest.fn().mockReturnValue(10);
      scaleBarTool._connecting();
      expect(scaleBarTool._map!.getDiv().firstChild?.firstChild).toBeDefined();
      expect(scaleBarTool._map!.getDiv().firstChild?.firstChild).not.toEqual(null);

      // disconnect
      scaleBarTool._disconnecting();
      expect(scaleBarTool._map!.getDiv().firstChild?.firstChild).toEqual(null);
    });
  });
});
