import GeneralUtils from '../general';

describe('GeneralUtils', () => {
  describe('createPromise', () => {
    it('should create promise', () => {
      const promise = GeneralUtils.createPromise();
      expect(promise.resolve).toBeDefined();
      expect(promise.reject).toBeDefined();
    });
    it('should resolve promise', async () => {
      const promise1 = GeneralUtils.createPromise();
      const promise2 = GeneralUtils.createPromise();
      setTimeout(() => {
        promise1.resolve('resolve1');
      }, 10);
      setTimeout(() => {
        promise2.resolve('resolve2');
      }, 20);
      const result = await Promise.all([promise1, promise2]);
      expect(result).toEqual(['resolve1', 'resolve2']);
    });
    it('should reject promise', async () => {
      const promise = GeneralUtils.createPromise();
      try {
        setTimeout(() => {
          promise.reject('reject');
        }, 10);
        await Promise.all([promise]);
      } catch (error) {
        expect(error).toBe('reject');
      }
    });
  });

  describe('getPathToResources', () => {
    const rootPath = 'path/to/folder';
    it('should return correct path to the map chart when it is loaded as "sn-map" (sense-client third party extension)', () => {
      const path = GeneralUtils.getPathToResources('sn-map', rootPath);
      expect(path).toEqual(`${rootPath}extensions/sn-map`);
    });

    it('should return correct path to the map chart when it is loaded as "map" (sense-client native chart)', () => {
      const path = GeneralUtils.getPathToResources('map', rootPath);
      expect(path).toEqual(`${rootPath}@nebula.js/sn-map/dist`);
    });

    it('should return default path to the map chart when it cannot be determined how it is loaded', () => {
      const path = GeneralUtils.getPathToResources('unknown', rootPath);
      expect(path).toEqual(`${rootPath}extensions/sn-map`);
    });
  });

  describe('addUrlParameters', () => {
    it('should append URL parameters correctly', () => {
      expect(GeneralUtils.addUrlParameters('https://example.com', 'apa')).toEqual('https://example.com?apa');
      expect(GeneralUtils.addUrlParameters('https://example.com?', 'apa')).toEqual('https://example.com?apa');
      expect(GeneralUtils.addUrlParameters('https://example.com?bepa=1', 'apa')).toEqual(
        'https://example.com?bepa=1&apa'
      );
      expect(GeneralUtils.addUrlParameters('https://example.com?bepa=1&cepa=2', 'apa=3')).toEqual(
        'https://example.com?bepa=1&cepa=2&apa=3'
      );
      expect(GeneralUtils.addUrlParameters('https://example.com', '')).toEqual('https://example.com');

      expect(GeneralUtils.addUrlParameters('https://example.com', ['a=1', 'b=2'])).toEqual(
        'https://example.com?a=1&b=2'
      );
      expect(GeneralUtils.addUrlParameters('https://example.com?z=0', ['a=1', 'b=2'])).toEqual(
        'https://example.com?z=0&a=1&b=2'
      );
      expect(GeneralUtils.addUrlParameters('https://example.com', [])).toEqual('https://example.com');
    });
  });
});
