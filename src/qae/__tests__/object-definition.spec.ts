import objectDefinition from '../object-definition';

describe('qae object-definition', () => {
  it('should return proper structure of object-definition', () => {
    const object = objectDefinition();
    const expected = {
      gaLayers: [],
      mapSettings: {
        showScaleBar: false,
        showDebugInfo: false,
        useImperialUnits: false,
        baseMap: 'default',
        projection: 'default',
        mapLanguage: 'auto',
        autoZoomOnSelection: true,
      },
      showTitles: true,
      subtitle: '',
      title: '',
    };
    expect(object).toMatchObject(expected);
  });
});
