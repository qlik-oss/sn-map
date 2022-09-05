import getInitialProperties from '../initial-properties';

describe('data initial-properties', () => {
  it('should return correct initial properties', () => {
    const maxDimensions = 10;
    const maxCells = 10001;
    const initialProperties = getInitialProperties(maxDimensions, maxCells);
    expect(initialProperties.qHyperCubeDef.qInitialDataFetch[0].qWidth).toEqual(maxDimensions);
    expect(initialProperties.qHyperCubeDef.qInitialDataFetch[0].qHeight).toEqual(10000);
  });
});
