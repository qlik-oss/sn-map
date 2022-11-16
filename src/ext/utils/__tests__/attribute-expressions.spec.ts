import { setAttributeExpression } from '../attribute-expression-utils';
import mockProperties from '../../../mocks/properties';
import { setValue } from 'qlik-chart-modules';

describe('Attribute expression utils', () => {
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

  describe('set attribute expressions', () => {
    it('should set attribute expression for dimension (used by location)', () => {
      const value = 'locationValue';
      attributeExpressions = getAttributeExpressions(properties);
      expect(attributeExpressions.length).toEqual(0);
      addExpression(value, 'locationOrLatitude');
      setAttributeExpression(properties, 'locationOrLatitude', 'locationOrLatitude', false, 0);
      attributeExpressions = getAttributeExpressions(properties);
      expect(attributeExpressions.length).toEqual(1);
      expect(attributeExpressions[0].qExpression).toEqual(`=${value}`);
    });
    it('should set attribute expression for measure (used by size)', () => {
      const value = 'sizeValue';
      attributeExpressions = getAttributeExpressions(properties);
      expect(attributeExpressions.length).toEqual(0);
      addExpression(value, 'size.expression');
      setAttributeExpression(properties, 'size.expression', 'size', true, 0);
      attributeExpressions = getAttributeExpressions(properties);
      expect(attributeExpressions.length).toEqual(1);
      expect(attributeExpressions[0].qExpression).toEqual(`=${value}`);
    });
    it('should not set attribute expression for the same dimension', () => {
      const value = 'value';
      const expressionPath = 'expressionPath';
      attributeExpressions = getAttributeExpressions(properties);
      expect(attributeExpressions.length).toEqual(0);
      addExpression(value, expressionPath);
      setAttributeExpression(properties, expressionPath, 'id', false, 0);
      attributeExpressions = getAttributeExpressions(properties);
      expect(attributeExpressions.length).toEqual(1);
      setAttributeExpression(properties, expressionPath, 'id_2', false, 0);
      attributeExpressions = getAttributeExpressions(properties);
      expect(attributeExpressions.length).toEqual(2);
      setAttributeExpression(properties, expressionPath, 'id_2', false, 0);
      attributeExpressions = getAttributeExpressions(properties);
      expect(attributeExpressions.length).toEqual(2);
    });
    it('should not set attribute expression for the same measure', () => {
      const value = 'value';
      const expressionPath = 'expressionPath';
      attributeExpressions = getAttributeExpressions(properties);
      expect(attributeExpressions.length).toEqual(0);
      addExpression(value, expressionPath);
      setAttributeExpression(properties, expressionPath, 'id', true, 0);
      attributeExpressions = getAttributeExpressions(properties);
      expect(attributeExpressions.length).toEqual(1);
      setAttributeExpression(properties, expressionPath, 'id_2', true, 0);
      attributeExpressions = getAttributeExpressions(properties);
      expect(attributeExpressions.length).toEqual(2);
      setAttributeExpression(properties, expressionPath, 'id_2', true, 0);
      attributeExpressions = getAttributeExpressions(properties);
      expect(attributeExpressions.length).toEqual(2);
    });
  });
});
