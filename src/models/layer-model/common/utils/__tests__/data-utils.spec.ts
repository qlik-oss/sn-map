import DataUtils from '../data-utils';
import mockLayout from '../../../../../mocks/layout';

describe('DataUtils', () => {
  let dataPages: NxDataPage[];

  beforeEach(() => {
    dataPages = mockLayout.layer.base.qHyperCube.qDataPages;
  });

  it('should flatten data', () => {
    dataPages.push({
      qMatrix: [[{ qElemNumber: 0, qState: 'S' }], [{ qElemNumber: 1, qState: 'S' }]],
    });

    const result = DataUtils.flattenDataPages(dataPages);
    expect(result.qMatrix).toBeDefined();
    expect(result.qMatrix?.length).toBe(3);
  });
});
