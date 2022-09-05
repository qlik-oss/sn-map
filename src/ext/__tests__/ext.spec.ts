import getExt from '../ext';
import env from '../../mocks/environment';

describe('ext', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('should retrieve ext', () => {
    it('should return the proper ext', () => {
      const ext = getExt(env);
      expect(ext).toHaveProperty('definition');
    });
  });
});
