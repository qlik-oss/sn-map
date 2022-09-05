import { useCore, useModels, useRender } from '../';

describe('hooks index', () => {
  it('should return the hooks', () => {
    expect(useCore).toBeDefined();
    expect(useModels).toBeDefined();
    expect(useRender).toBeDefined();
  });
});
