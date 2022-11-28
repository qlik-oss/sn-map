import NumberFormatProperties from '../number-format-properties';
import numberFormatting from '../../../../utils/number-formatting';
import mockProperties from '../../../../mocks/properties';

describe('number-format-properties utils', () => {
  let isLink: (arg: any) => boolean;
  let props: LayerProperties;
  let numFormatProps: any;
  let getNumFmtPatternSpy: any;
  let getDefaultNumericFormatSpy: any;
  let ref: string;
  const defaultNumberFormat = '#,##0.00';
  let numFormat: any;
  let convertFunctions: any;

  beforeEach(() => {
    isLink = () => false;
    props = JSON.parse(JSON.stringify(mockProperties.layer.point));
    props.numFormatRefQ = true;
    getNumFmtPatternSpy = jest.spyOn(numberFormatting, 'getNumFmtPattern');
    getDefaultNumericFormatSpy = jest
      .spyOn(numberFormatting, 'getDefaultNumericFormat')
      .mockReturnValue(defaultNumberFormat);
    ref = '';
    numFormatProps = NumberFormatProperties.getNumberFormattingPropertiesWithMasterLink(ref, true, isLink);
    numFormat = numFormatProps.items.numberFormat;
    convertFunctions = numFormatProps.items.useMasterFormat.convertFunctions;
  });

  describe('getNumberFormattingProperties', () => {
    it('set the correct refs', () => {
      ref = 'test.something.now';
      numFormatProps = NumberFormatProperties.getNumberFormattingPropertiesWithMasterLink(ref, true, isLink);
      numFormat = numFormatProps.items.numberFormat;
      expect(numFormat.items.decimalSep.ref).toEqual(`${ref}.qNumFormat.qDec`);
      expect(numFormat.items.format.ref).toEqual(`${ref}.qNumFormat.qFmt`);
      expect(numFormat.items.numDecimals.ref).toEqual(`${ref}.qNumFormat.qnDec`);
      expect(numFormat.items.numPrecisionDigits.ref).toEqual(`${ref}.qNumFormat.qnDec`);
      expect(numFormat.items.numberFormattingMode.ref).toEqual(`${ref}.numFormatFromTemplate`);
      expect(numFormat.items.numberFormattingTemplates.ref).toEqual(`${ref}.qNumFormat.qFmt`);
      expect(numFormat.items.numberFormattingType.ref).toEqual(`${ref}.qNumFormat.qType`);
      expect(numFormat.items.thousandSep.ref).toEqual(`${ref}.qNumFormat.qThou`);
    });

    describe('numberFormattingType', () => {
      it('should add number format value to properties when numberFormattingType is changing', () => {
        props.qNumFormat = { qType: 'F' };
        numFormat.items.numberFormattingType.change(props, {}, {}, { localeInfo: {} });
        expect(getNumFmtPatternSpy).toHaveBeenCalled();
      });
    });

    describe('numberFormattingMode', () => {
      it('should show numberFormattingMode if numberFormattingType belongs to [F, D, TS, T] list', () => {
        props.qNumFormat = { qType: 'F' };
        expect(numFormat.items.numberFormattingMode.show(props)).toEqual(true);
      });

      it('should not show numberFormattingMode if numberFormattingType does not belongs to [F, D, TS, T] list', () => {
        props.qNumFormat = { qType: 'OFF' };
        expect(numFormat.items.numberFormattingMode.show(props)).toEqual(false);
      });
    });

    describe('numberFormattingTemplates', () => {
      it('should show numberFormattingTemplates if numberFormattingType belongs to [F, D, TS, T] list and numberFormattingMode is true', () => {
        props.qNumFormat = { qType: 'F' };
        props.numFormatFromTemplate = true;
        expect(numFormat.items.numberFormattingTemplates.show(props)).toEqual(true);
      });

      it('should not show numberFormattingTemplates if numberFormattingType does not belongs to [F, D, TS, T] list or numberFormattingMode is false', () => {
        props.qNumFormat = { qType: 'OFF' };
        props.numFormatFromTemplate = true;
        expect(numFormat.items.numberFormattingTemplates.show(props)).toEqual(false);
        props.qNumFormat = { qType: 'F' };
        props.numFormatFromTemplate = false;
        expect(numFormat.items.numberFormattingTemplates.show(props)).toEqual(false);
      });
    });

    describe('decimalSep', () => {
      it('should show if numberFormattingType is R', () => {
        props.qNumFormat = { qType: 'R' };
        expect(numFormat.items.decimalSep.show(props)).toEqual(true);
      });

      it('should not show if numberFormattingType is not R', () => {
        props.qNumFormat = { qType: 'F' };
        expect(numFormat.items.decimalSep.show(props)).toEqual(false);
      });

      it('should add number format value to properties when changing', () => {
        props.qNumFormat = { qType: 'R' };
        numFormat.items.decimalSep.change(props, {}, {}, { localeInfo: {} });
        expect(getNumFmtPatternSpy).toHaveBeenCalled();
      });

      it('should be invalid if qNumFormat.qDec and qNumFormat.qThou are equal', () => {
        props.qNumFormat = { qType: 'F', qDec: ',', qThou: '.' };
        expect(numFormat.items.decimalSep.invalid(props)).toEqual(false);
        props.qNumFormat = { qType: 'F', qDec: ',', qThou: ',' };
        expect(numFormat.items.decimalSep.invalid(props)).toEqual(true);
      });

      it('should be readOnly when qNumFormat.qFmt is not default format pattern', () => {
        props.qNumFormat = { qType: 'F', qFmt: defaultNumberFormat };
        expect(numFormat.items.decimalSep.readOnly(props)).toEqual(false);
        props.qNumFormat = { qType: 'F', qFmt: '"#,##0.1"' };
        expect(numFormat.items.decimalSep.readOnly(props)).toEqual(true);
        expect(getDefaultNumericFormatSpy).toHaveBeenCalled();
      });
    });

    describe('thousandSep', () => {
      it('should show if numberFormattingType is R', () => {
        props.qNumFormat = { qType: 'R' };
        expect(numFormat.items.thousandSep.show(props)).toEqual(true);
      });

      it('should not show if numberFormattingType is not R', () => {
        props.qNumFormat = { qType: 'F' };
        expect(numFormat.items.thousandSep.show(props)).toEqual(false);
      });

      it('should add number format value to properties when changing', () => {
        props.qNumFormat = { qType: 'R' };
        numFormat.items.thousandSep.change(props, {}, {}, { localeInfo: {} });
        expect(getNumFmtPatternSpy).toHaveBeenCalled();
      });

      it('should be invalid if qNumFormat.qDec and qNumFormat.qThou are equal or qNumFormat.qType is I', () => {
        props.qNumFormat = { qType: 'F', qDec: ',', qThou: '.' };
        expect(numFormat.items.thousandSep.invalid(props)).toEqual(false);
        props.qNumFormat = { qType: 'F', qDec: ',', qThou: ',' };
        expect(numFormat.items.thousandSep.invalid(props)).toEqual(true);
        props.qNumFormat = { qType: 'I', qDec: ',', qThou: ',' };
        expect(numFormat.items.thousandSep.invalid(props)).toEqual(false);
      });

      it('should be readOnly when qNumFormat.qFmt is not default format pattern', () => {
        props.qNumFormat = { qType: 'F', qFmt: defaultNumberFormat };
        expect(numFormat.items.thousandSep.readOnly(props)).toEqual(false);
        props.qNumFormat = { qType: 'F', qFmt: '"#,##0.1"' };
        expect(numFormat.items.thousandSep.readOnly(props)).toEqual(true);
      });
    });

    describe('format', () => {
      it('should show when the format pattern input is visible', () => {
        props.qNumFormat = { qType: 'R' };
        expect(numFormat.items.format.show(props)).toEqual(true);
        props.qNumFormat = { qType: 'OFF' };
        props.numFormatFromTemplate = false;
        expect(numFormat.items.format.show(props)).toEqual(true);
      });
      it('should show when the format pattern input is not visible', () => {
        props.qNumFormat = { qType: 'U' };
        expect(numFormat.items.format.show(props)).toEqual(false);
        props.qNumFormat = { qType: 'OFF' };
        props.numFormatFromTemplate = true;
        expect(numFormat.items.format.show(props)).toEqual(false);
      });
    });
  });

  describe('convertFunctions', () => {
    it('should return false when get is called and there are no formats quarantined', () => {
      expect(convertFunctions.get(undefined, undefined, undefined, props)).toEqual(false);
    });
    it('should return true when get is called and there are formats quarantined', () => {
      props.quarantine = { qNumFormat: { qType: 'R' } };
      expect(convertFunctions.get(undefined, undefined, undefined, props)).toEqual(true);
    });
    it('should not set formatting when ref is invalid', () => {
      ref = 'invalidRef';
      numFormatProps = NumberFormatProperties.getNumberFormattingPropertiesWithMasterLink(ref, true, isLink);
      convertFunctions.set(true, undefined, undefined, undefined, props);
      expect(props.invalidRef).toEqual(undefined);
    });
    it('should be able to quarantine formatting when set is called', () => {
      convertFunctions.set(true, undefined, undefined, undefined, props);
      expect(props.quarantine).toHaveProperty('qNumFormat');
      expect(props.quarantine).toHaveProperty('isCustomFormatted');
      expect(props.qNumFormat).toEqual(null);
      expect(props.isCustomFormatted).toEqual(undefined);
    });
    it('should be able to unquarantine formatting when set is called', () => {
      const qNumFormat = { qType: 'R' };
      const isCustomFormatted = true;
      props.quarantine = {
        qNumFormat,
        isCustomFormatted,
      };
      convertFunctions.set(false, undefined, undefined, undefined, props);
      expect(props.quarantine).toBeUndefined();
      expect(props.qNumFormat).toEqual(qNumFormat);
      expect(props.isCustomFormatted).toEqual(isCustomFormatted);
    });
  });

  describe('getNumberFormattingPropertiesWithMasterLink', () => {
    it('determine if the number format properties should be shown', () => {
      ref = 'test.ref';
      numFormatProps = NumberFormatProperties.getNumberFormattingPropertiesWithMasterLink(ref, true, isLink);
      expect(numFormatProps.items.numberFormat.show(props)).toEqual(true);
      isLink = () => true;
      props.test = {
        ref: {
          quarantine: {
            qNumFormat: 'qNumFormatValue',
          },
        },
      };
      numFormatProps = NumberFormatProperties.getNumberFormattingPropertiesWithMasterLink(ref, true, isLink);
      expect(numFormatProps.items.numberFormat.show(props)).toEqual(false);
    });
  });
});
