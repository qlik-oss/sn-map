import autoRegister from '..';
import env from '../../mocks/environment';

describe('locale', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add translations when they do not exist', () => {
    autoRegister(env.translator);
    expect(env.translator.add).toHaveBeenCalled();
  });
  it('should not add translations when they already exist', () => {
    env.translator.get = (translation: string) => `_${translation}`;
    autoRegister(env.translator);
    expect(env.translator.add).toHaveBeenCalledTimes(0);
  });
});
