import Utils from '../utils';

describe('Dataset utils', () => {
  describe('sortColumns', () => {
    it('should put geoname first in the array', () => {
      const columns = Utils.sortColumns(['id', 'geoname', 'size']);
      expect(columns[0]).toBe('geoname');
    });
  });
});
