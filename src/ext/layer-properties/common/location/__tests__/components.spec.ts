import getComponents from '../components';
import mockProperties from '../../../../../mocks/properties';
import LocationUtils from '../utils';

jest.mock('../utils');

describe('Location components', () => {
  let translator: TranslatorType;
  let properties: LayerProperties;
  beforeEach(() => {
    translator = {
      get: jest.fn(),
      add: jest.fn(),
    };
    properties = JSON.parse(JSON.stringify(mockProperties.layer.point));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('location component', () => {
    it('should get correct label when no longitude', () => {
      const components = getComponents(translator);
      const locationComponent = components.location('');

      locationComponent.label(properties);
      expect(locationComponent.ref).toEqual('locationOrLatitude');
      expect(translator.get).toHaveBeenCalledWith('geo.properties.locationField');
    });

    it('should get correct label when having longitude', () => {
      const components = getComponents(translator);
      const locationComponent = components.location('');

      properties.isLatLong = true;
      locationComponent.label(properties);
      expect(translator.get).toHaveBeenCalledWith('geo.properties.latitude');
    });

    it('should call setLocationAttributeExpression on change', () => {
      const components = getComponents(translator);
      const locationComponent = components.location('');

      locationComponent.change(properties);
      expect(LocationUtils.setLocationAttributeExpression).toHaveBeenCalled();
    });
  });

  describe('longitude component', () => {
    it('should not show component when isLatLong is false', () => {
      const components = getComponents(translator);
      const longitudeComponent = components.longitude('');

      properties.isLatLong = false;
      const show = longitudeComponent.show(properties);
      expect(longitudeComponent.ref).toEqual('longitude');
      expect(show).toBeFalsy();
    });

    it('should show component when isLatLong is true', () => {
      const components = getComponents(translator);
      const longitudeComponent = components.longitude('');

      properties.isLatLong = true;
      const show = longitudeComponent.show(properties);
      expect(show).toBeTruthy();
    });

    it('should call updateLocationAttributeExpressions on change', () => {
      const components = getComponents(translator);
      const longitudeComponent = components.longitude('');

      properties.longitude = {
        type: '',
        key: '',
      };
      longitudeComponent.change(properties);
      expect(LocationUtils.updateLocationAttributeExpressions).toHaveBeenCalled();
    });
  });

  describe('country component', () => {
    it('should not show component when isLatLong is true', () => {
      const components = getComponents(translator);
      const countryComponent = components.country('');

      properties.isLatLong = true;
      const show = countryComponent.show(properties);
      expect(countryComponent.ref).toEqual('locationCountry');
      expect(show).toBeFalsy();
    });

    it('should not show component when locationNamesAuto is true', () => {
      const components = getComponents(translator);
      const countryComponent = components.country('');

      properties.isLatLong = false;
      properties.locationNamesAuto = true;
      const show = countryComponent.show(properties);
      expect(countryComponent.ref).toEqual('locationCountry');
      expect(show).toBeFalsy();
    });

    it('should show component when isLatLong and locationNamesAuto is false', () => {
      const components = getComponents(translator);
      const countryComponent = components.country('');

      properties.isLatLong = false;
      properties.locationNamesAuto = false;
      const show = countryComponent.show(properties);
      expect(show).toBeTruthy();
    });

    it('should call updateLocationAttributeExpressions on change', () => {
      const components = getComponents(translator);
      const countryComponent = components.country('');

      properties.locationCountry = { key: '', type: '' };
      countryComponent.change(properties);
      expect(LocationUtils.updateLocationAttributeExpressions).toHaveBeenCalled();
    });
  });

  describe('admin1 component', () => {
    it('should not show component when isLatLong is true', () => {
      const components = getComponents(translator);
      const admin1Component = components.admin1('');

      properties.isLatLong = true;
      const show = admin1Component.show(properties);
      expect(admin1Component.ref).toEqual('locationAdmin1');
      expect(show).toBeFalsy();
    });

    it('should not show component when locationNamesAuto is true', () => {
      const components = getComponents(translator);
      const admin1Component = components.admin1('');

      properties.isLatLong = false;
      properties.locationNamesAuto = true;
      const show = admin1Component.show(properties);
      expect(admin1Component.ref).toEqual('locationAdmin1');
      expect(show).toBeFalsy();
    });

    it('should not show component when not having a country field', () => {
      const components = getComponents(translator);
      const admin1Component = components.admin1('');

      properties.isLatLong = false;
      properties.locationNamesAuto = false;
      properties.locationCountry = { key: '', type: '' };
      const show = admin1Component.show(properties);
      expect(admin1Component.ref).toEqual('locationAdmin1');
      expect(show).toBeFalsy();
    });

    it('should show component when isLatLong, locationNamesAuto and locationCountry exist', () => {
      const components = getComponents(translator);
      const admin1Component = components.admin1('');

      properties.isLatLong = false;
      properties.locationNamesAuto = false;
      properties.locationCountry = { key: 'field', type: '' };
      const show = admin1Component.show(properties);
      expect(show).toBeTruthy();
    });

    it('should call updateLocationAttributeExpressions on change', () => {
      const components = getComponents(translator);
      const admin1Component = components.admin1('');

      properties.locationAdmin1 = { key: '', type: '' };
      admin1Component.change(properties);
      expect(LocationUtils.updateLocationAttributeExpressions).toHaveBeenCalled();
    });
  });

  describe('admin2 component', () => {
    it('should not show component when isLatLong is true', () => {
      const components = getComponents(translator);
      const admin2Component = components.admin2('');

      properties.isLatLong = true;
      const show = admin2Component.show(properties);
      expect(admin2Component.ref).toEqual('locationAdmin2');
      expect(show).toBeFalsy();
    });

    it('should not show component when locationNamesAuto is true', () => {
      const components = getComponents(translator);
      const admin2Component = components.admin2('');

      properties.isLatLong = false;
      properties.locationNamesAuto = true;
      const show = admin2Component.show(properties);
      expect(admin2Component.ref).toEqual('locationAdmin2');
      expect(show).toBeFalsy();
    });

    it('should not show component when not having a country field', () => {
      const components = getComponents(translator);
      const admin2Component = components.admin2('');

      properties.isLatLong = false;
      properties.locationNamesAuto = false;
      properties.locationCountry = { key: '', type: '' };
      const show = admin2Component.show(properties);
      expect(admin2Component.ref).toEqual('locationAdmin2');
      expect(show).toBeFalsy();
    });

    it('should not show component when not having a admin1 field', () => {
      const components = getComponents(translator);
      const admin2Component = components.admin2('');

      properties.isLatLong = false;
      properties.locationNamesAuto = false;
      properties.locationCountry = { key: 'field', type: '' };
      properties.locationAdmin1 = { key: '', type: '' };
      const show = admin2Component.show(properties);
      expect(admin2Component.ref).toEqual('locationAdmin2');
      expect(show).toBeFalsy();
    });

    it('should show component when isLatLong, locationNamesAuto, locationCountry and locationAdmin1 exist', () => {
      const components = getComponents(translator);
      const admin2Component = components.admin2('');

      properties.isLatLong = false;
      properties.locationNamesAuto = false;
      properties.locationCountry = { key: 'field', type: '' };
      properties.locationAdmin1 = { key: 'field', type: '' };
      const show = admin2Component.show(properties);
      expect(show).toBeTruthy();
    });

    it('should call updateLocationAttributeExpressions on change', () => {
      const components = getComponents(translator);
      const admin2Component = components.admin2('');

      properties.locationAdmin2 = { key: '', type: '' };
      admin2Component.change(properties);
      expect(LocationUtils.updateLocationAttributeExpressions).toHaveBeenCalled();
    });
  });

  describe('useLatLongCheckbox component', () => {
    it('should call updateLocationAttributeExpressions on change', () => {
      const components = getComponents(translator);
      const latLongComponent = components.useLatLongCheckbox('');

      latLongComponent.change(properties);
      expect(LocationUtils.updateLocationAttributeExpressions).toHaveBeenCalled();
    });
  });

  describe('useLocationRestrictionSwitch component', () => {
    it('should not show component when isLatLong is true', () => {
      const components = getComponents(translator);
      const locationNamesSwitch = components.useLocationNamesSwitch('');

      properties.isLatLong = true;
      const show = locationNamesSwitch.show(properties);
      expect(locationNamesSwitch.ref).toEqual('locationNamesAuto');
      expect(show).toBeFalsy();
    });

    it('should show component when isLatLong is false', () => {
      const components = getComponents(translator);
      const locationNamesSwitch = components.useLocationNamesSwitch('');

      properties.isLatLong = false;
      const show = locationNamesSwitch.show(properties);
      expect(locationNamesSwitch.ref).toEqual('locationNamesAuto');
      expect(show).toBeTruthy();
    });

    it('should call updateLocationAttributeExpressions on change', () => {
      const components = getComponents(translator);
      const locationNamesSwitch = components.useLocationNamesSwitch('');

      locationNamesSwitch.change(properties);
      expect(LocationUtils.updateLocationAttributeExpressions).toHaveBeenCalled();
    });
  });

  describe('locationType component', () => {
    it('should not show component when isLatLong is true', () => {
      const components = getComponents(translator);
      const locationTypeComponent = components.locationType('');

      properties.isLatLong = true;
      const show = locationTypeComponent.show(properties);
      expect(locationTypeComponent.ref).toEqual('locationType');
      expect(show).toBeFalsy();
    });

    it('should not show component when locationNamesAuto is true', () => {
      const components = getComponents(translator);
      const locationTypeComponent = components.locationType('');

      properties.isLatLong = false;
      properties.locationNamesAuto = true;
      const show = locationTypeComponent.show(properties);
      expect(locationTypeComponent.ref).toEqual('locationType');
      expect(show).toBeFalsy();
    });

    it('should show component when isLatLong and locationNamesAuto is false', () => {
      const components = getComponents(translator);
      const locationTypeComponent = components.locationType('');

      properties.isLatLong = false;
      properties.locationNamesAuto = false;
      const show = locationTypeComponent.show(properties);
      expect(show).toBeTruthy();
    });
  });

  describe('locationText component', () => {
    it('should not show component when isLatLong is true', () => {
      const components = getComponents(translator);
      const locationTextComponent = components.locationText('');

      properties.isLatLong = true;
      const show = locationTextComponent.show(properties);
      expect(show).toBeFalsy();
    });

    it('should show component when isLatLong is false', () => {
      const components = getComponents(translator);
      const locationTextComponent = components.locationText('');

      properties.isLatLong = false;
      const show = locationTextComponent.show(properties);
      expect(show).toBeTruthy();
    });
  });

  describe('latLongText component', () => {
    it('should show component when isLatLong is true', () => {
      const components = getComponents(translator);
      const latLongTextComponent = components.latLongText('');

      properties.isLatLong = true;
      const show = latLongTextComponent.show(properties);
      expect(show).toBeTruthy();
    });

    it('should not show component when isLatLong is false', () => {
      const components = getComponents(translator);
      const latLongTextComponent = components.latLongText('');

      properties.isLatLong = false;
      const show = latLongTextComponent.show(properties);
      expect(show).toBeFalsy();
    });
  });

  describe('locationNameCountryInstruction component', () => {
    it('should not show component when isLatLong is true', () => {
      const components = getComponents(translator);
      const locationNameInstructionComponent = components.locationNameCountryInstruction('');

      properties.isLatLong = true;
      const show = locationNameInstructionComponent.show(properties);
      expect(show).toBeFalsy();
    });

    it('should not show component when locationNamesAuto is true', () => {
      const components = getComponents(translator);
      const locationNameInstructionComponent = components.locationNameCountryInstruction('');

      properties.isLatLong = false;
      properties.locationNamesAuto = true;
      const show = locationNameInstructionComponent.show(properties);
      expect(show).toBeFalsy();
    });

    it('should show component when isLatLong and locationNamesAuto is false', () => {
      const components = getComponents(translator);
      const locationNameInstructionComponent = components.locationNameCountryInstruction('');

      properties.isLatLong = false;
      properties.locationNamesAuto = false;
      const show = locationNameInstructionComponent.show(properties);
      expect(show).toBeTruthy();
    });
  });

  describe('admin1Instruction component', () => {
    it('should not show component when isLatLong is true', () => {
      const components = getComponents(translator);
      const admin1InstructionComponent = components.locationNameAdmin1Instruction('');

      properties.isLatLong = true;
      const show = admin1InstructionComponent.show(properties);
      expect(show).toBeFalsy();
    });

    it('should not show component when locationNamesAuto is true', () => {
      const components = getComponents(translator);
      const admin1InstructionComponent = components.locationNameAdmin1Instruction('');

      properties.isLatLong = false;
      properties.locationNamesAuto = true;
      const show = admin1InstructionComponent.show(properties);
      expect(show).toBeFalsy();
    });

    it('should not show component when not having a country field', () => {
      const components = getComponents(translator);
      const admin1InstructionComponent = components.locationNameAdmin1Instruction('');

      properties.isLatLong = false;
      properties.locationNamesAuto = false;
      properties.locationCountry = { key: '', type: '' };
      const show = admin1InstructionComponent.show(properties);
      expect(show).toBeFalsy();
    });

    it('should show component when isLatLong, locationNamesAuto and locationCountry exist', () => {
      const components = getComponents(translator);
      const admin1InstructionComponent = components.locationNameAdmin1Instruction('');

      properties.isLatLong = false;
      properties.locationNamesAuto = false;
      properties.locationCountry = { key: 'field', type: '' };
      const show = admin1InstructionComponent.show(properties);
      expect(show).toBeTruthy();
    });
  });
});
