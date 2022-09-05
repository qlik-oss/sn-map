import getColorDefinition from '../definition';

describe('color definition', () => {
  let props: any;

  beforeEach(() => {
    props = {
      qHyperCubeDef: {
        qDimensions: [{ id: 'dimension1' }],
      },
      type: '',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should return color definition', () => {
    const definition = getColorDefinition();
    expect(definition.uses).toEqual('colorsAndLegend');
    const isShown = definition.show(props);
    expect(isShown).toEqual(true);
    definition.items.colors.items.colorMode.change();
    const colorModeOptions = definition.items.colors.items.colorMode.options();
    expect(colorModeOptions[0].value).toEqual('primary');
  });
});
