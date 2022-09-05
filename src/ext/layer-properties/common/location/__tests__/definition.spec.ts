import getLocationDefinition from '../definition';

describe('Location definition', () => {
  let translator: TranslatorType;
  beforeEach(() => {
    translator = {
      get: jest.fn(),
      add: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get default definition', () => {
    const definition = getLocationDefinition(translator, 'foobar');
    expect(definition.translation).toEqual('geo.properties.location');
    expect(definition.items).toHaveProperty('location');
    expect(definition.items).toHaveProperty('locationText');
    expect(definition.items).toHaveProperty('useLocationNamesSwitch');
    expect(definition.items).toHaveProperty('locationType');
    expect(definition.items).toHaveProperty('country');
    expect(definition.items).toHaveProperty('locationNameCountryInstruction');
    expect(definition.items).toHaveProperty('admin1');
    expect(definition.items).toHaveProperty('locationNameAdmin1Instruction');
    expect(definition.items).toHaveProperty('admin2');

    expect(definition.items).not.toHaveProperty('useLatLongCheckbox');
    expect(definition.items).not.toHaveProperty('latLongText');
    expect(definition.items).not.toHaveProperty('longitude');
  });

  it('should get PointLayer specific definition', () => {
    const definition = getLocationDefinition(translator, 'PointLayer');
    expect(definition.items).toHaveProperty('useLatLongCheckbox');
    expect(definition.items).toHaveProperty('latLongText');
    expect(definition.items).toHaveProperty('longitude');
  });
});
