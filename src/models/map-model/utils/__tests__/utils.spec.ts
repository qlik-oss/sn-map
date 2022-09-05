import webmapMock from '../../../../mocks/webmap';
import GeneralUtils from '../../../../utils/general';
import Utils from '../utils';

jest.mock('../../../../utils/general');

describe('MapModelUtils', () => {
  let map: idevio.map.WebMap;
  beforeEach(() => {
    map = new webmapMock.idevio.map.WebMap();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('waitForEvent', () => {
    it('should add Listener', async () => {
      map.addListener = jest.fn().mockImplementation();
      const promise = Utils.waitForEvent(map, 'idle');
      await promise;
      expect(map.addListener).toHaveBeenCalledTimes(1);
      expect(GeneralUtils.createPromise).toHaveBeenCalledTimes(1);
    });
  });
});
