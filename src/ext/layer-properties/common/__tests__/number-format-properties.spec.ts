import NumberFormatProperties from '../number-format-properties';
import mockProperties from '../../../../mocks/properties';

describe('number-format-properties utils', () => {
  let isLink: (arg: any) => boolean;
  let props: LayerProperties;
  let numFormatProps;

  beforeEach(() => {
    isLink = () => false;
    props = JSON.parse(JSON.stringify(mockProperties.layer.point));
    props.numFormatRefQ = true;
  });
  it('determine if the number format properties should be shown', () => {
    numFormatProps = NumberFormatProperties.getNumberFormattingPropertiesWithMasterLink('test.ref', true, isLink);
    expect(numFormatProps.items.numberFormat.show(props)).toEqual(true);
    isLink = () => true;
    props.test = {
      ref: {
        quarantine: {
          qNumFormat: 'qNumFormatValue',
        },
      },
    };
    numFormatProps = NumberFormatProperties.getNumberFormattingPropertiesWithMasterLink('test.ref', true, isLink);
    expect(numFormatProps.items.numberFormat.show(props)).toEqual(false);
  });

  it('set the correct refs', () => {
    const ref = 'test.something.now';
    numFormatProps = NumberFormatProperties.getNumberFormattingPropertiesWithMasterLink(
      'test.something.now',
      true,
      isLink
    );
    const numFormat = numFormatProps.items.numberFormat;
    expect(numFormat.items.decimalSep.ref).toEqual(`${ref}.qNumFormat.qDec`);
    expect(numFormat.items.format.ref).toEqual(`${ref}.qNumFormat.qFmt`);
    expect(numFormat.items.numDecimals.ref).toEqual(`${ref}.qNumFormat.qnDec`);
    expect(numFormat.items.numPrecisionDigits.ref).toEqual(`${ref}.qNumFormat.qnDec`);
    expect(numFormat.items.numberFormattingMode.ref).toEqual(`${ref}.numFormatFromTemplate`);
    expect(numFormat.items.numberFormattingTemplates.ref).toEqual(`${ref}.qNumFormat.qFmt`);
    expect(numFormat.items.numberFormattingType.ref).toEqual(`${ref}.qNumFormat.qType`);
    expect(numFormat.items.thousandSep.ref).toEqual(`${ref}.qNumFormat.qThou`);
  });
});
