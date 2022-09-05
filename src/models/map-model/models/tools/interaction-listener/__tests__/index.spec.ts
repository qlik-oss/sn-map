import webmapMock from '../../../../../../mocks/webmap';
import InteractionListener from '..';

describe('Interaction listener', () => {
  let map: idevio.map.WebMap;
  beforeEach(() => {
    global.idevio = webmapMock.idevio;
    map = new webmapMock.idevio.map.WebMap();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('construct', () => {
    it('should add three listeners (destroy, viewchanged, idle)', () => {
      const interactionListener = new InteractionListener(map);
      expect(interactionListener._listeners.length).toBe(3);
    });
  });
});
