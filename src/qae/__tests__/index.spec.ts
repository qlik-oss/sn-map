import qaeDefinition from '../index';

describe('qae index', () => {
  it('should return proper structure of qae', () => {
    const qae = qaeDefinition();
    expect(qae).toHaveProperty('properties');
    expect(qae).toHaveProperty('data');
  });
});
