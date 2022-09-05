import Utils from '../utils';
import mockProperties from '../../../../../mocks/properties';
import { setValue } from 'qlik-chart-modules';

describe('Location utils', () => {
  let properties: LayerProperties;
  let attributeExpressions: NxAttrExprDef[];
  beforeEach(() => {
    properties = JSON.parse(JSON.stringify(mockProperties.layer.point));
  });

  const getAttributeExpressions = (props: LayerProperties) => {
    return props.qHyperCubeDef.qDimensions[0].qAttributeExpressions;
  };

  const addExpression = (valueName: string, path: string) => {
    const value = {
      label: valueName,
      key: `=${valueName}`,
      type: 'expression',
    };
    setValue(properties, path, value);
  };

  describe('update location attribute expressions', () => {
    it('should set location attribute expression', () => {
      attributeExpressions = getAttributeExpressions(properties);
      expect(attributeExpressions.length).toEqual(0);

      addExpression('location', 'locationOrLatitude');

      Utils.updateLocationAttributeExpressions(properties);
      attributeExpressions = getAttributeExpressions(properties);

      expect(attributeExpressions.length).toEqual(1);
      expect(attributeExpressions[0].id).toEqual('locationOrLatitude');
      expect(attributeExpressions[0].qExpression).toEqual('=location');
    });

    it('should only set location and longitude attribute expressions', () => {
      attributeExpressions = getAttributeExpressions(properties);
      expect(attributeExpressions.length).toEqual(0);

      properties.isLatLong = true;
      properties.locationNamesAuto = true;
      addExpression('location', 'locationOrLatitude');
      addExpression('longitude', 'longitude');
      addExpression('country', 'locationCountry');

      Utils.updateLocationAttributeExpressions(properties);
      attributeExpressions = getAttributeExpressions(properties);

      expect(attributeExpressions.length).toEqual(2);
      expect(attributeExpressions[0].id).toEqual('locationOrLatitude');
      expect(attributeExpressions[0].qExpression).toEqual('=location');
      expect(attributeExpressions[1].id).toEqual('longitude');
      expect(attributeExpressions[1].qExpression).toEqual('=longitude');
    });

    it('should only set location and country attribute expressions', () => {
      attributeExpressions = getAttributeExpressions(properties);
      expect(attributeExpressions.length).toEqual(0);

      properties.isLatLong = false;
      properties.locationNamesAuto = false;
      addExpression('location', 'locationOrLatitude');
      addExpression('country', 'locationCountry');

      Utils.updateLocationAttributeExpressions(properties);
      attributeExpressions = getAttributeExpressions(properties);

      expect(attributeExpressions.length).toEqual(2);
      expect(attributeExpressions[0].id).toEqual('locationOrLatitude');
      expect(attributeExpressions[0].qExpression).toEqual('=location');
      expect(attributeExpressions[1].id).toEqual('locationCountry');
      expect(attributeExpressions[1].qExpression).toEqual('=country');
    });
  });

  describe('update location names attribute expressions', () => {
    it('should set country, admin1 and admin2 attribute expressions', () => {
      attributeExpressions = getAttributeExpressions(properties);
      expect(attributeExpressions.length).toEqual(0);

      addExpression('country', 'locationCountry');
      addExpression('admin1', 'locationAdmin1');
      addExpression('admin2', 'locationAdmin2');

      Utils.updateNamesAttributeExpressions(properties);
      attributeExpressions = getAttributeExpressions(properties);

      expect(attributeExpressions.length).toEqual(3);
      expect(attributeExpressions[0].id).toEqual('locationCountry');
      expect(attributeExpressions[0].qExpression).toEqual('=country');
      expect(attributeExpressions[1].id).toEqual('locationAdmin1');
      expect(attributeExpressions[1].qExpression).toEqual('=admin1');
      expect(attributeExpressions[2].id).toEqual('locationAdmin2');
      expect(attributeExpressions[2].qExpression).toEqual('=admin2');
    });

    it('should not update when country attribute expression is missing', () => {
      attributeExpressions = getAttributeExpressions(properties);
      expect(attributeExpressions.length).toEqual(0);

      addExpression('admin1', 'locationAdmin1');
      addExpression('admin2', 'locationAdmin2');

      Utils.updateNamesAttributeExpressions(properties);
      attributeExpressions = getAttributeExpressions(properties);

      expect(attributeExpressions.length).toEqual(0);
    });

    it('should only set country when admin1 attribute expression is missing', () => {
      attributeExpressions = getAttributeExpressions(properties);
      expect(attributeExpressions.length).toEqual(0);

      addExpression('country', 'locationCountry');
      addExpression('admin2', 'locationAdmin2');

      Utils.updateNamesAttributeExpressions(properties);
      attributeExpressions = getAttributeExpressions(properties);

      expect(attributeExpressions.length).toEqual(1);
      expect(attributeExpressions[0].id).toEqual('locationCountry');
      expect(attributeExpressions[0].qExpression).toEqual('=country');
    });
  });

  describe('set location attribute expressions', () => {
    it('should set attribute expression', () => {
      attributeExpressions = getAttributeExpressions(properties);
      expect(attributeExpressions.length).toEqual(0);

      addExpression('location1', 'locationOrLatitude');
      Utils.setLocationAttributeExpression(properties);
      addExpression('location2', 'locationOrLatitude');
      Utils.setLocationAttributeExpression(properties);
      attributeExpressions = getAttributeExpressions(properties);

      expect(attributeExpressions.length).toEqual(1);
      expect(attributeExpressions[0].id).toEqual('locationOrLatitude');
      expect(attributeExpressions[0].qExpression).toEqual('=location2');
    });

    it('should not set locationOrLatitude attribute expression when it equal dimension field', () => {
      attributeExpressions = getAttributeExpressions(properties);
      expect(attributeExpressions.length).toEqual(0);

      addExpression('dimension', 'locationOrLatitude');

      Utils.updateLocationAttributeExpressions(properties);
      attributeExpressions = getAttributeExpressions(properties);

      expect(attributeExpressions.length).toEqual(0);
    });

    it('should not set locationOrLatitude attribute expression when it equal dimension library field', () => {
      attributeExpressions = getAttributeExpressions(properties);
      expect(attributeExpressions.length).toEqual(0);

      properties.qHyperCubeDef.qDimensions[0].qLibraryId = '=libraryId';
      addExpression('libraryId', 'locationOrLatitude');

      Utils.updateLocationAttributeExpressions(properties);
      attributeExpressions = getAttributeExpressions(properties);

      expect(attributeExpressions.length).toEqual(0);
    });
  });
});
