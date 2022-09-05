import utils from '../util';

describe('ext util', () => {
  describe('bracketStringIfNeeded', () => {
    it('should bracket string', () => {
      const string = utils.bracketStringIfNeeded('foobar');
      expect(string).toEqual('[foobar]');
    });

    it('should not bracket string if empty string', () => {
      const string = utils.bracketStringIfNeeded('');
      expect(string).toEqual('');
    });

    it('should not bracket string if first character is =', () => {
      const string = utils.bracketStringIfNeeded('=foobar');
      expect(string).toEqual('=foobar');
    });

    it('should not bracket string if first character is [', () => {
      const string = utils.bracketStringIfNeeded('[foobar');
      expect(string).toEqual('[foobar');
    });
  });

  describe('generateId', () => {
    it('should be a string', () => {
      const id = utils.generateId();
      expect(typeof id).toBe('string');
    });

    describe('getChar', () => {
      it('should return empty string when value lower than 10', () => {
        const char = utils.getChar(9);
        expect(char).toContain('');
      });
      it('should return char', () => {
        const char = utils.getChar(10);
        expect(char).toBe('A');
      });
      it('should not return banned char', () => {
        const char = utils.getChar(24);
        expect(char).not.toBe('O');
      });
    });

    describe('base62', () => {
      it('should only return one char', () => {
        const base62 = utils.base62(10);
        expect(base62).toBe('A');
      });
      it('should return double char', () => {
        const base62 = utils.base62(1126);
        expect(base62).toBe('JA');
      });
      it('should return empty string', () => {
        const base62 = utils.base62(62);
        expect(base62).toContain('');
      });
    });
  });
});
