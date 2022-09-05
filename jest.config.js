module.exports = async () => {
  return {
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.{ts, tsx}'],
    coverageReporters: ['json', 'lcov'],
  };
};
