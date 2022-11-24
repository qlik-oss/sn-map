import getDefinition from '../definition';
import env from '../../../../../mocks/environment';
import * as attributeExpressions from '../../../../utils/attribute-expression-utils';
import mockProperties from '../../../../../mocks/properties';

describe('size definition', () => {
  let props: any;
  let setAttributeExpressionSpy: any;
  const definition = getDefinition('PointLayer', env);

  beforeEach(() => {
    setAttributeExpressionSpy = jest.spyOn(attributeExpressions, 'setAttributeExpression');
    props = JSON.parse(JSON.stringify(mockProperties.layer.point));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return valid size definition for PointLayer type', () => {
    expect(definition.items).toHaveProperty('sizeExpression');
    expect(definition.items).toHaveProperty('sizeFormatting');
    expect(definition.items).toHaveProperty('sizeExpressionLabel');
    expect(definition.items).toHaveProperty('sizeSliderRange');
    expect(definition.items).toHaveProperty('sizeSliderSingle');
    expect(definition.items).toHaveProperty('autoRadiusValueRange');
    expect(definition.items).toHaveProperty('customMinRangeValue');
    expect(definition.items).toHaveProperty('customMaxRangeValue');
    expect(definition.items.sizeSliderSingle.component).toEqual('slider');
    definition.items.sizeSliderSingle.label(props);
    definition.items.sizeSliderRange.label(props);
    expect(env.translator.get).toHaveBeenCalledTimes(3);
  });

  describe('when size expression does not exist', () => {
    it('should show sizeSliderSingle option', () => {
      expect(definition.items.sizeSliderSingle.show(props)).toEqual(true);
    });

    it('should not show sizeFormatting, sizeExpressionLabel, sizeSliderRange, autoRadiusValueRange and customMinRangeValue options', () => {
      props.size.expression = {};
      if (typeof definition.items.sizeFormatting.show === 'function') {
        expect(definition.items.sizeFormatting.show(props)).toEqual(false);
      }
      expect(definition.items.sizeExpressionLabel.show(props)).toEqual(false);
      expect(definition.items.sizeSliderRange.show(props)).toEqual(false);
      expect(definition.items.autoRadiusValueRange.show(props)).toEqual(false);
      props.size.autoRadiusValueRange = true;
      expect(definition.items.customMinRangeValue.show(props)).toEqual(false);
      props.size.autoRadiusValueRange = false;
      expect(definition.items.customMinRangeValue.show(props)).toEqual(false);
    });
  });

  describe('when size expression exists', () => {
    beforeEach(() => {
      props.size.expression = { key: 'sizeExpressionKey', type: '' };
    });

    it('should not show sizeSliderSingle option', () => {
      expect(definition.items.sizeSliderSingle.show(props)).toEqual(false);
    });

    it('should set the Attribute Expression when changing the value of the size field', () => {
      definition.items.sizeExpression.change(props);
      expect(setAttributeExpressionSpy).toHaveBeenCalled();
    });

    it('should show sizeFormatting, sizeSliderRange and autoRadiusValueRange options', () => {
      if (typeof definition.items.sizeFormatting.show === 'function') {
        expect(definition.items.sizeFormatting.show(props)).toEqual(true);
      }
      expect(definition.items.sizeSliderRange.show(props)).toEqual(true);
      expect(definition.items.autoRadiusValueRange.show(props)).toEqual(true);
      props.size.expression = { key: 'sizeExpressionKey', type: 'libraryItem' };
      expect(definition.items.sizeSliderRange.show(props)).toEqual(true);
      expect(definition.items.autoRadiusValueRange.show(props)).toEqual(true);
    });

    it('should show sizeExpressionLabel option when size is not a libraryItem', () => {
      expect(definition.items.sizeExpressionLabel.show(props)).toEqual(true);
    });

    it('should not show sizeExpressionLabel option when size is a libraryItem', () => {
      props.size.expression = { key: 'sizeExpressionKey', type: 'libraryItem' };
      expect(definition.items.sizeExpressionLabel.show(props)).toEqual(false);
    });

    it('should not show useMasterFormat option when size is not a libraryItem', () => {
      expect(definition.items.sizeFormatting.items.useMasterFormat.show(props)).toEqual(false);
    });

    it('should show useMasterFormat option when size is a libraryItem', () => {
      props.size.expression = { key: 'sizeExpressionKey', type: 'libraryItem' };
      expect(definition.items.sizeFormatting.items.useMasterFormat.show(props)).toEqual(true);
    });

    it('should show customMinRangeValue and customMaxRangeValue when autoRadiusValueRange is true', () => {
      props.size.autoRadiusValueRange = true;
      expect(definition.items.customMinRangeValue.show(props)).toEqual(false);
      expect(definition.items.customMaxRangeValue.show(props)).toEqual(false);
    });

    it('should not show customMinRangeValue and customMaxRangeValue when autoRadiusValueRange is false', () => {
      props.size.autoRadiusValueRange = false;
      expect(definition.items.customMinRangeValue.show(props)).toEqual(true);
      expect(definition.items.customMaxRangeValue.show(props)).toEqual(true);
    });
  });
});
