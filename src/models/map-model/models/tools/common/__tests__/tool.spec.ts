import webmapMock from '../../../../../../mocks/webmap';
import Tool from '../tool';

describe('Tool', () => {
  let map: idevio.map.WebMap;
  let tool: Tool;
  beforeEach(() => {
    global.idevio = webmapMock.idevio;
    tool = new Tool({});
    map = new webmapMock.idevio.map.WebMap();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set _active', () => {
    tool.isActive(false);
    expect(tool._active).toBe(false);
  });

  describe('disconnect', () => {
    it('should remove listeners and reset map', () => {
      tool._map = map;
      tool._listeners = ['foo', 'bar'];
      tool.disconnect();
      expect(map.removeListener).toHaveBeenCalledTimes(2);
      expect(tool._listeners.length).toBe(0);
      expect(tool._map).toBe(null);
    });

    it('should reset listeners when no map', () => {
      tool._listeners = ['foo', 'bar'];
      tool.disconnect();
      expect(map.removeListener).not.toHaveBeenCalledTimes(2);
      expect(tool._listeners.length).toBe(0);
      expect(tool._map).toBe(null);
    });
  });

  describe('connectTo', () => {
    it('should reset map and listeners before connecting', () => {
      tool._map = map;
      tool._listeners = ['foo', 'bar'];
      tool.connectTo(map);
      expect(map.removeListener).toHaveBeenCalledTimes(2);
      expect(tool._map).toEqual(map);
      expect(map.addListener).toHaveBeenCalledTimes(1);
      expect(map.addListener).toHaveBeenCalledWith('destroy', expect.any(Function));
    });

    it('should add destroy listener before connecting', () => {
      tool._listeners = ['foo', 'bar'];
      tool.connectTo(map);
      expect(map.removeListener).not.toHaveBeenCalledTimes(2);
      expect(tool._map).toEqual(map);
      expect(map.addListener).toHaveBeenCalledTimes(1);
      expect(map.addListener).toHaveBeenCalledWith('destroy', expect.any(Function));
    });
  });

  describe('_addListener', () => {
    it('should add listener and call func when active', () => {
      const func = jest.fn();
      map.addListener = jest.fn().mockImplementation((_type: string, listener: any) => {
        listener();
      });
      tool._map = map;
      tool._active = true;
      tool._addListener('foobar', func);
      expect(tool._listeners.length).toBe(1);
      expect(map.addListener).toHaveBeenCalledTimes(1);
      expect(map.addListener).toHaveBeenCalledWith('foobar', expect.any(Function));
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should add listener and not call func when not active', () => {
      const func = jest.fn();
      tool._map = map;
      tool._active = false;
      tool._addListener('foobar', func);
      expect(tool._listeners.length).toBe(1);
      expect(map.addListener).toHaveBeenCalledTimes(1);
      expect(map.addListener).toHaveBeenCalledWith('foobar', expect.any(Function));
      expect(func).not.toHaveBeenCalledTimes(1);
    });

    it('should not add listener when no map', () => {
      const func = jest.fn();
      tool._map = null;
      tool._addListener('foobar', func);
      expect(tool._listeners.length).toBe(0);
      expect(map.addListener).not.toHaveBeenCalledTimes(1);
      expect(func).not.toHaveBeenCalledTimes(1);
    });
  });
});
