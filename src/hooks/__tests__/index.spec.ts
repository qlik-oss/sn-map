import { useCore, useModels, useRender, useInteractions } from '../';

describe('hooks index', () => {
  it('should return the hooks', () => {
    expect(useCore).toBeDefined();
    expect(useModels).toBeDefined();
    expect(useRender).toBeDefined();
    expect(useInteractions).toBeDefined();
  });
});
