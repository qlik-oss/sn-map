import getDefinition from '../definition';
import env from '../../../../../mocks/environment';
import * as attributeExpressions from '../../../../utils/attribute-expression-utils';
import mockProperties from '../../../../../mocks/properties';

describe('size definition', () => {
  let props: any;
  let setAttributeExpressionSpy: any;

  beforeEach(() => {
    setAttributeExpressionSpy = jest.spyOn(attributeExpressions, 'setAttributeExpression');
    props = JSON.parse(JSON.stringify(mockProperties.layer.point));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return valid size definition for PointLayer type', () => {
    const definition = getDefinition('PointLayer', env);
    expect(definition.items).toHaveProperty('sizeField');
    expect(definition.items).toHaveProperty('sizeFormatting');
    expect(definition.items).toHaveProperty('sizeFieldLabel');
    expect(definition.items).toHaveProperty('sizeSlider');
    expect(definition.items).toHaveProperty('sizeSingleSlider');
    expect(definition.items).toHaveProperty('sizeRange');
    expect(definition.items).toHaveProperty('minSizeValue');
    expect(definition.items).toHaveProperty('maxSizeValue');
    expect(definition.items.sizeSingleSlider.component).toEqual('slider');
    definition.items.sizeSingleSlider.label(props);
    definition.items.sizeSlider.label(props);
    expect(env.translator.get).toHaveBeenCalledTimes(3);
  });

  it('should set the Attribute Expression when changing the value of the size field', () => {
    const definition = getDefinition('PointLayer', env);
    props.size.expression = { key: 'sizeExpressionKey', type: 'expression' };
    definition.items.sizeField.change(props);
    expect(setAttributeExpressionSpy).toHaveBeenCalled();
  });

  it('should show or hide sizeFieldLabel option according to the properties', () => {
    const definition = getDefinition('PointLayer', env);
    props.size.expression = {};
    expect(definition.items.sizeFieldLabel.show(props)).toEqual(false);
    props.size.expression = { key: 'sizeExpressionKey', type: '' };
    expect(definition.items.sizeFieldLabel.show(props)).toEqual(true);
    props.size.expression = { key: 'sizeExpressionKey', type: 'libraryItem' };
    expect(definition.items.sizeFieldLabel.show(props)).toEqual(false);
  });

  it('should show or hide sizeSlider according to the properties', () => {
    const definition = getDefinition('PointLayer', env);
    props.size.expression = {};
    expect(definition.items.sizeSlider.show(props)).toEqual(false);
    props.size.expression = { key: 'sizeExpressionKey', type: '' };
    expect(definition.items.sizeSlider.show(props)).toEqual(true);
  });

  it('should show or hide sizeRange according to the properties', () => {
    const definition = getDefinition('PointLayer', env);
    props.size.expression = {};
    expect(definition.items.sizeRange.show(props)).toEqual(false);
    props.size.expression = { key: 'sizeExpressionKey', type: '' };
    expect(definition.items.sizeRange.show(props)).toEqual(true);
  });

  it('should show or hide minSizeValue according to the properties', () => {
    const definition = getDefinition('PointLayer', env);
    props.size.expression = {};
    props.size.autoRadiusValueRange = true;
    expect(definition.items.minSizeValue.show(props)).toEqual(false);
    props.size.expression = { key: 'sizeExpressionKey', type: '' };
    expect(definition.items.minSizeValue.show(props)).toEqual(false);
    props.size.expression = {};
    props.size.autoRadiusValueRange = false;
    expect(definition.items.minSizeValue.show(props)).toEqual(false);
    props.size.expression = { key: 'sizeExpressionKey', type: '' };
    expect(definition.items.minSizeValue.show(props)).toEqual(true);
  });

  it('should show or hide maxSizeValue according to the properties', () => {
    const definition = getDefinition('PointLayer', env);
    props.size.expression = {};
    props.size.autoRadiusValueRange = true;
    expect(definition.items.maxSizeValue.show(props)).toEqual(false);
    props.size.expression = { key: 'sizeExpressionKey', type: '' };
    expect(definition.items.maxSizeValue.show(props)).toEqual(false);
    props.size.expression = {};
    props.size.autoRadiusValueRange = false;
    expect(definition.items.maxSizeValue.show(props)).toEqual(false);
    props.size.expression = { key: 'sizeExpressionKey', type: '' };
    expect(definition.items.maxSizeValue.show(props)).toEqual(true);
  });
});
