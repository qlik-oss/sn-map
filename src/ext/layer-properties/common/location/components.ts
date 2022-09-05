import ExpressionFields from '../../../utils/expression-fields';
import LocationUtils from './utils';
import { getValue } from 'qlik-chart-modules';

export default function getLocationComponents(translator: TranslatorType) {
  const location = (ref: string) => {
    return {
      ref: `${ref}locationOrLatitude`,
      type: 'object',
      component: 'color-by-dropdown',
      schemaIgnore: true,
      defaultValue: {},
      libraryItemType: 'dimension',
      label: function (props: LayerProperties) {
        if (getValue(props, `${ref}isLatLong`)) {
          return translator.get('geo.properties.latitude');
        } else {
          return translator.get('geo.properties.locationField');
        }
      },
      change: function (props: LayerProperties) {
        // Do not remove, component throws if not available
        const expr = getValue(props, `${ref}locationOrLatitude`);
        ExpressionFields.setLibraryDimensionWorkaround(props, expr);
        LocationUtils.setLocationAttributeExpression(props);
      },
    };
  };

  const longitude = (ref: string) => {
    return {
      ref: `${ref}longitude`,
      label: translator.get('geo.properties.longitude'),
      schemaIgnore: true,
      type: 'object',
      defaultValue: {},
      component: 'color-by-dropdown',
      libraryItemType: 'dimension',
      show: function (props: LayerProperties) {
        return getValue(props, `${ref}isLatLong`);
      },
      change: function (props: LayerProperties) {
        // Do not remove, component throws if not available
        const expr = getValue(props, `${ref}longitude`);
        ExpressionFields.setLibraryDimensionWorkaround(props, expr);
        LocationUtils.updateLocationAttributeExpressions(props);
      },
    };
  };

  const country = (ref: string) => {
    return {
      ref: `${ref}locationCountry`,
      label: translator.get('geo.properties.countryForNames'),
      type: 'object',
      component: 'color-by-dropdown',
      schemaIgnore: true,
      defaultValue: {},
      libraryItemType: 'dimension',
      show: function (props: LayerProperties) {
        return !getValue(props, `${ref}isLatLong`) && !getValue(props, `${ref}locationNamesAuto`);
      },
      change: function (props: LayerProperties) {
        // Do not remove, component throws if not available
        const expr = getValue(props, `${ref}locationCountry`);
        ExpressionFields.setLibraryDimensionWorkaround(props, expr);
        LocationUtils.updateLocationAttributeExpressions(props);
      },
    };
  };

  const admin1 = (ref: string) => {
    return {
      ref: `${ref}locationAdmin1`,
      label: translator.get('geo.properties.stateAdmin1ForNames'),
      type: 'object',
      component: 'color-by-dropdown',
      schemaIgnore: true,
      defaultValue: {},
      libraryItemType: 'dimension',
      show: function (props: LayerProperties) {
        return (
          !getValue(props, `${ref}isLatLong`) &&
          !getValue(props, `${ref}locationNamesAuto`) &&
          getValue(props, `${ref}locationCountry.key`, '').trim().length > 0
        );
      },
      change: function (props: LayerProperties) {
        // Do not remove, component throws if not available
        const expr = getValue(props, `${ref}locationAdmin1`);
        ExpressionFields.setLibraryDimensionWorkaround(props, expr);
        LocationUtils.updateLocationAttributeExpressions(props);
      },
    };
  };

  const admin2 = (ref: string) => {
    return {
      ref: `${ref}locationAdmin2`,
      label: translator.get('geo.properties.admin2ForNames'),
      type: 'object',
      component: 'color-by-dropdown',
      schemaIgnore: true,
      defaultValue: {},
      libraryItemType: 'dimension',
      show: function (props: LayerProperties) {
        return (
          !getValue(props, `${ref}isLatLong`) &&
          !getValue(props, `${ref}locationNamesAuto`) &&
          getValue(props, `${ref}locationCountry.key`, '').trim().length > 0 &&
          getValue(props, `${ref}locationAdmin1.key`, '').trim().length > 0
        );
      },
      change: function (props: LayerProperties) {
        // Do not remove, component throws if not available
        const expr = getValue(props, `${ref}locationAdmin2`);
        ExpressionFields.setLibraryDimensionWorkaround(props, expr);
        LocationUtils.updateLocationAttributeExpressions(props);
      },
    };
  };

  const useLatLongCheckbox = (ref: string) => {
    return {
      ref: `${ref}isLatLong`,
      translation: 'geo.properties.isLatLong',
      type: 'boolean',
      defaultValue: false,
      change: function (props: LayerProperties) {
        LocationUtils.updateLocationAttributeExpressions(props);
      },
    };
  };

  const useLocationNamesSwitch = (ref: string) => {
    return {
      ref: `${ref}locationNamesAuto`,
      translation: 'geo.properties.location.details',
      type: 'boolean',
      component: 'switch',
      defaultValue: true,
      options: [
        { value: true, translation: 'Common.Auto' },
        { value: false, translation: 'Common.Custom' },
      ],
      show: function (props: LayerProperties) {
        return !getValue(props, `${ref}isLatLong`);
      },
      change: function (props: LayerProperties) {
        LocationUtils.updateLocationAttributeExpressions(props);
      },
    };
  };

  const locationType = (ref: string) => {
    return {
      ref: ref + 'locationType',
      translation: 'geo.properties.locationType',
      type: 'string',
      component: 'dropdown',
      options: [
        { value: '', translation: 'Common.Auto' },
        { value: 'LCONT', translation: 'geo.properties.location.continent' },
        { value: 'APCL*', translation: 'geo.properties.location.country' },
        { value: 'XCISO2', translation: 'geo.properties.location.countryISO2' },
        { value: 'XCISO3', translation: 'geo.properties.location.countryISO3' },
        { value: 'AADM1', translation: 'geo.properties.location.admin1' },
        { value: 'AADM2', translation: 'geo.properties.location.admin2' },
        { value: 'AADM3', translation: 'geo.properties.location.admin3' },
        { value: 'AADM4', translation: 'geo.properties.location.admin4' },
        { value: 'XPC', translation: 'geo.properties.location.postalCode' },
        { value: 'P*', translation: 'geo.properties.location.city' },
        { value: 'XIATA', translation: 'geo.properties.location.airportIATA' },
        { value: 'XICAO', translation: 'geo.properties.location.airportICAO' },
      ],
      defaultValue: '',
      show: function (props: LayerProperties) {
        return !getValue(props, `${ref}isLatLong`) && !getValue(props, `${ref}locationNamesAuto`);
      },
    };
  };

  const locationText = (ref: string) => {
    return {
      component: 'text',
      translation: 'geo.properties.location.hint',
      style: 'hint',
      show: function (props: LayerProperties) {
        return !getValue(props, `${ref}isLatLong`);
      },
    };
  };

  const latLongText = (ref: string) => {
    return {
      component: 'text',
      translation: 'geo.properties.latlong.hint',
      style: 'hint',
      show: function (props: LayerProperties) {
        return getValue(props, `${ref}isLatLong`);
      },
    };
  };

  const locationNameCountryInstruction = (ref: string) => {
    return {
      component: 'text',
      translation: 'geo.properties.location.country.hint',
      style: 'hint',
      show: function (props: LayerProperties) {
        return !getValue(props, `${ref}isLatLong`) && !getValue(props, `${ref}locationNamesAuto`);
      },
    };
  };

  const locationNameAdmin1Instruction = (ref: string) => {
    return {
      component: 'text',
      translation: 'geo.properties.location.admin1.hint',
      style: 'hint',
      show: function (props: LayerProperties) {
        return (
          !getValue(props, `${ref}isLatLong`) &&
          !getValue(props, `${ref}locationNamesAuto`) &&
          getValue(props, `${ref}locationCountry.key`, '').trim().length > 0
        );
      },
    };
  };

  const locationComponents = {
    location,
    longitude,
    country,
    admin1,
    admin2,
    useLatLongCheckbox,
    useLocationNamesSwitch,
    locationType,
    locationText,
    latLongText,
    locationNameCountryInstruction,
    locationNameAdmin1Instruction,
  };

  return locationComponents;
}
