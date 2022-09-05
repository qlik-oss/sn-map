export default function getDataProperties(maxDimension: number = 0, maxCells: number = 1000) {
  maxCells = maxCells > 10000 ? 10000 : maxCells;
  return {
    qHyperCubeDef: {
      qDimensions: [],
      qMeasures: [],
      qInitialDataFetch: [
        {
          qWidth: maxDimension,
          qHeight: maxCells,
        },
      ],
    },
  };
}
