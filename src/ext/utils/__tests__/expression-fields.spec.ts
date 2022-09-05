import expressionFields from '../expression-fields';
import mockProperties from '../../../mocks/properties';

describe('Expression fields', () => {
  let hyperCube: NxHyperCubeDef;
  let expression: ExpressionProp;

  beforeEach(() => {
    hyperCube = {
      qDimensions: JSON.parse(JSON.stringify(mockProperties.layer.point.qHyperCubeDef.qDimensions)),
    };
    expression = {
      key: 'foobar',
      type: 'expression',
      qNumFormat: 'exist',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addExpression', () => {
    const expectedExpressionResult = {
      id: 'id',
      qExpression: 'foobar',
      qNumFormat: 'exist',
    };

    const expectedDimensionResult = {
      id: 'id',
      qLibraryId: 'foobar',
      qNumFormat: 'exist',
    };

    it('should not add expression if no dimensions', () => {
      expression.key = '';
      hyperCube.qDimensions = [];
      const result = expressionFields.addExpression('id', expression, hyperCube);
      expect(result).toBeUndefined();
    });

    it('should not add expression if invalid expression', () => {
      expression.key = '';
      expressionFields.addExpression('id', expression, hyperCube);
      expect(hyperCube.qDimensions[0].qAttributeDimensions.length).toBe(0);
      expect(hyperCube.qDimensions[0].qAttributeExpressions.length).toBe(0);
    });

    it('should not add expression if undefined expression', () => {
      expressionFields.addExpression('id', undefined, hyperCube);
      expect(hyperCube.qDimensions[0].qAttributeDimensions.length).toBe(0);
      expect(hyperCube.qDimensions[0].qAttributeExpressions.length).toBe(0);
    });

    it('should add attribute expression if valid expression', () => {
      expressionFields.addExpression('id', expression, hyperCube);
      expect(hyperCube.qDimensions[0].qAttributeDimensions.length).toBe(0);
      expect(hyperCube.qDimensions[0].qAttributeExpressions.length).toBe(1);
      expect(hyperCube.qDimensions[0].qAttributeExpressions[0]).toEqual(expectedExpressionResult);
    });

    it('should add attribute expression if valid expression on second dim', () => {
      const secondDimIndex = 1;
      hyperCube.qDimensions.push({
        qLibraryId: '',
        qDef: {
          cId: 'id',
          qFieldDefs: ['dimension'],
          qSortCriterias: [],
          qLabelExpression: '',
        },
        qAttributeExpressions: [],
        qAttributeDimensions: [],
      });
      expressionFields.addExpression('id', expression, hyperCube, false, secondDimIndex);
      expect(hyperCube.qDimensions[0].qAttributeDimensions.length).toBe(0);
      expect(hyperCube.qDimensions[0].qAttributeExpressions.length).toBe(0);
      expect(hyperCube.qDimensions[1].qAttributeExpressions.length).toBe(1);
      expect(hyperCube.qDimensions[1].qAttributeExpressions[0]).toEqual(expectedExpressionResult);
    });

    it('should add attribute expression if valid measure expression', () => {
      const isMeasure = true;
      expressionFields.addExpression('id', expression, hyperCube, isMeasure);
      expect(hyperCube.qDimensions[0].qAttributeDimensions.length).toBe(0);
      expect(hyperCube.qDimensions[0].qAttributeExpressions.length).toBe(1);
      expect(hyperCube.qDimensions[0].qAttributeExpressions[0]).toEqual(expectedExpressionResult);
    });

    it('should add attribute expression if valid library measure', () => {
      const isMeasure = true;
      expression.type = 'libraryItem';
      expressionFields.addExpression('id', expression, hyperCube, isMeasure);
      expect(hyperCube.qDimensions[0].qAttributeDimensions.length).toBe(0);
      expect(hyperCube.qDimensions[0].qAttributeExpressions.length).toBe(1);
      expect(hyperCube.qDimensions[0].qAttributeExpressions[0]).toEqual(expectedDimensionResult);
    });

    it('should add attribute dimension if valid library dimension', () => {
      expression.type = 'libraryItem';
      expressionFields.addExpression('id', expression, hyperCube);
      expect(hyperCube.qDimensions[0].qAttributeDimensions.length).toBe(1);
      expect(hyperCube.qDimensions[0].qAttributeExpressions.length).toBe(0);
      expect(hyperCube.qDimensions[0].qAttributeDimensions[0]).toEqual(expectedDimensionResult);
    });
  });

  describe('removeExpression', () => {
    it('should return undefined if no dimensions', () => {
      hyperCube.qDimensions = [];
      const result = expressionFields.removeExpression('id', hyperCube);
      expect(result).toBeUndefined();
    });

    it('should remove all instances of expression', () => {
      hyperCube.qDimensions[0].qAttributeExpressions.push({ id: 'id' });
      hyperCube.qDimensions[0].qAttributeExpressions.push({ id: 'id' });
      hyperCube.qDimensions[0].qAttributeDimensions.push({ id: 'id' });
      hyperCube.qDimensions[0].qAttributeDimensions.push({ id: 'foobar' });
      expressionFields.removeExpression('id', hyperCube);
      expect(hyperCube.qDimensions[0].qAttributeExpressions.length).toBe(0);
      expect(hyperCube.qDimensions[0].qAttributeDimensions.length).toBe(1);
      expect(hyperCube.qDimensions[0].qAttributeDimensions[0].id).toBe('foobar');
    });
  });

  describe('expressionAndFieldEquals', () => {
    describe('should return true', () => {
      it('when expression equals field', () => {
        const expression = 'foobar';
        const field = 'foobar';
        const result = expressionFields.expressionAndFieldEquals(expression, field);
        expect(result).toBeTruthy();
      });

      it('when expression with = equals field', () => {
        const expression = '=foobar';
        const field = 'foobar';
        const result = expressionFields.expressionAndFieldEquals(expression, field);
        expect(result).toBeTruthy();
      });

      it('when expression with [] equals field', () => {
        const expression = '[foobar]';
        const field = 'foobar';
        const result = expressionFields.expressionAndFieldEquals(expression, field);
        expect(result).toBeTruthy();
      });
    });

    describe('should return false', () => {
      it('when expression does not equal field', () => {
        const expression = 'foo';
        const field = 'bar';
        const result = expressionFields.expressionAndFieldEquals(expression, field);
        expect(result).toBeFalsy();
      });
    });
  });

  describe('setLibraryDimensionWorkaround', () => {
    let layerProperties: LayerProperties;
    beforeEach(() => {
      layerProperties = JSON.parse(JSON.stringify(mockProperties.layer.point));
    });

    it('should set library id on expression when having activeDimensionIndex', () => {
      layerProperties.qHyperCubeDef.qDimensions[0].qLibraryId = 'libraryId';
      expression.activeDimensionIndex = 0;
      expressionFields.setLibraryDimensionWorkaround(layerProperties, expression);
      expect(expression.key).toEqual('libraryId');
      expect(expression.activeDimensionIndex).toBeUndefined();
    });

    it('should bracket expression when having activeDimensionIndex', () => {
      layerProperties.qHyperCubeDef.qDimensions[0].qLibraryId = '';
      expression.activeDimensionIndex = 0;
      expressionFields.setLibraryDimensionWorkaround(layerProperties, expression);
      expect(expression.key).toEqual('[foobar]');
    });

    it('should not change expression when invalid activeDimensionIndex', () => {
      layerProperties.qHyperCubeDef.qDimensions[0].qLibraryId = '';
      expression.activeDimensionIndex = undefined;
      expressionFields.setLibraryDimensionWorkaround(layerProperties, expression);
      expect(expression.key).toEqual('foobar');
    });
  });
});
