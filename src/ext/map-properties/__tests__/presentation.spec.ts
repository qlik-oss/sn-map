import getPresentation from '../presentation';

describe('presentation', () => {
  it('should return valid presentation', () => {
    const presentation = getPresentation();
    expect(presentation.uses).toEqual('settings');
    expect(presentation.items).toHaveProperty('general');
    expect(presentation.items).toHaveProperty('tools');
  });
});
