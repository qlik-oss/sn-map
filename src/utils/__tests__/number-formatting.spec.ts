import NumberFormatting from '../../../src/utils/number-formatting';

describe('Number formatting', () => {
  describe('#getPattern', () => {
    let localeInfo: any;
    beforeAll(() => {
      localeInfo = {
        qThousandSep: ',',
        qDecimalSep: '.',
        qDateFmt: 'm/d/yyyy',
        qTimeFmt: 'hh:mm:ss',
        qTimestampFmt: 'm/d/yyyy h:mm:ss',
      };
    });

    describe('when type is invalid', () => {
      it('should return empty string', () => {
        expect(NumberFormatting._getPattern('booo')).toEqual('');
      });
    });

    describe('when type is U', () => {
      it('should return empty string', () => {
        expect(NumberFormatting._getPattern('U')).toEqual('');
      });
    });

    describe('when type is I', () => {
      it("should return '#-##0' when thousand separator is '-'", () => {
        expect(NumberFormatting._getPattern('I', 0, 0, '-', localeInfo)).toEqual('#-##0');
      });
    });

    describe('when type is D', () => {
      it('should return same value as specified in locale.qDateFmt', () => {
        expect(NumberFormatting._getPattern('D', 0, 0, '-', localeInfo)).toEqual('m/d/yyyy');
      });
    });

    describe('when type is T', () => {
      it('should return same value as specified in locale.qTimeFmt', () => {
        expect(NumberFormatting._getPattern('T', 0, 0, '-', localeInfo)).toEqual('hh:mm:ss');
      });
    });

    describe('when type is TS', () => {
      it('should return same value as specified in locale.qTimestampFmt', () => {
        expect(NumberFormatting._getPattern('TS', 0, 0, '-', localeInfo)).toEqual('m/d/yyyy h:mm:ss');
      });
    });

    describe('when type is IV', () => {
      it('should return h:mm:ss', () => {
        expect(NumberFormatting._getPattern('IV', 0, 0, '-', localeInfo)).toEqual('h:mm:ss');
      });
    });

    describe('when type is R or F', () => {
      it('should call #getNDecPattern', () => {
        const spy = jest.spyOn(NumberFormatting, 'getNDecPattern');

        NumberFormatting._getPattern('R', 3, ',', ' ', localeInfo);
        expect(spy).toHaveBeenCalledWith('F', 3, ',', ' ', localeInfo);
      });
    });

    describe('when type is M', () => {
      it('should return pattern specified in locale.qMoneyFmt', () => {
        expect(NumberFormatting._getPattern('M', 0, ',', ' ', { qMoneyFmt: '$# ##0.00' })).toEqual('$# ##0.00');
      });
      it("should replace decimal separator in pattern with '-'", () => {
        expect(
          NumberFormatting._getPattern('M', 0, '-', ',', {
            qMoneyFmt: '$# ##0.00',
            qMoneyDecimalSep: '.',
          })
        ).toEqual('$# ##0-00');
      });
      it("should replace thousand separator in pattern with '~'", () => {
        expect(
          NumberFormatting._getPattern('M', 0, ',', '~', {
            qMoneyFmt: '$# ##0.00',
            qMoneyThousandSep: ' ',
          })
        ).toEqual('$#~##0.00');
      });

      it("should replace decimal sep with 'x' and thousand sep with 'y'", () => {
        expect(
          NumberFormatting._getPattern('M', 0, 'x', 'y', {
            qMoneyFmt: '$# ##0.00',
            qMoneyThousandSep: ' ',
            qMoneyDecimalSep: '.',
          })
        ).toEqual('$#y##0x00');
      });
    });
  });

  describe('#getNDecPattern', () => {
    describe('when type is F', () => {
      it("should return '#,##0' when nDec = 0", () => {
        expect(NumberFormatting.getNDecPattern('F', 0, '.', ',')).toEqual('#,##0');
      });

      it("should return '#,##0.' plus '0' nDec times", () => {
        expect(NumberFormatting.getNDecPattern('F', 1, '.', ',')).toEqual('#,##0.0');
        expect(NumberFormatting.getNDecPattern('F', 4, '.', ',')).toEqual('#,##0.0000');
        expect(NumberFormatting.getNDecPattern('F', 7, '.', ',')).toEqual('#,##0.0000000');
      });

      it('should use decimal from locale when decimal is not specified as parameter', () => {
        expect(NumberFormatting.getNDecPattern('F', 1, undefined, ',', { qDecimalSep: '-' })).toEqual('#,##0-0');
      });
    });

    describe('when type is not F', () => {
      it('should return empty string when nDec = 0', () => {
        expect(NumberFormatting.getNDecPattern('whatever', 0, '.', ',')).toEqual('');
      });
      it("should return '#' nDec times when nDec <= 3", () => {
        expect(NumberFormatting.getNDecPattern('x', 1, '.', ',')).toEqual('#');
        expect(NumberFormatting.getNDecPattern('x', 2, '.', ',')).toEqual('##');
        expect(NumberFormatting.getNDecPattern('x', 3, '.', ',')).toEqual('###');
      });

      it("should return '#' nDec-3 times followed by '###' when nDec > 3", () => {
        expect(NumberFormatting.getNDecPattern('x', 4, '.', ',')).toEqual('#,###');
        expect(NumberFormatting.getNDecPattern('x', 5, '.', ',')).toEqual('##,###');
        expect(NumberFormatting.getNDecPattern('x', 8, '.', ',')).toEqual('#####,###');
      });

      it("should use thousand sep from locale when it's not specified as parameter", () => {
        expect(NumberFormatting.getNDecPattern('x', 4, '.', undefined, { qThousandSep: '-' })).toEqual('#-###');
      });
    });
  });

  describe('#getSeparators', () => {
    describe('when ref is qType', () => {
      it('should return locale separators', () => {
        expect(
          NumberFormatting._getSeparators('qType', false, 'x', 'y', {
            qThousandSep: ' ',
            qDecimalSep: ',',
          })
        ).toEqual({ decimal: ',', thousand: ' ' });
      });

      it('thousand sep should default to empty string when not in locale', () => {
        expect(
          NumberFormatting._getSeparators('qType', false, 'x', 'y', {
            qDecimalSep: ',',
          })
        ).toEqual({ decimal: ',', thousand: '' });
      });

      it("decimal sep should default to '.' when not in locale", () => {
        expect(NumberFormatting._getSeparators('qType', false, 'x', 'y', {})).toEqual({
          decimal: '.',
          thousand: '',
        });
      });

      // Money
      it('should return locale money separators', () => {
        expect(
          NumberFormatting._getSeparators('qType', true, 'x', 'y', {
            qMoneyThousandSep: ' ',
            qMoneyDecimalSep: ',',
            qThousandSep: 'a',
            qDecimalSep: 'b',
          })
        ).toEqual({ decimal: ',', thousand: ' ' });
      });
    });

    describe('when ref is qThou and thousand sep is undefined, thousand sep', () => {
      it("should default to '' when not in locale", () => {
        expect(NumberFormatting._getSeparators('qThou', false, 'x', undefined, {})).toEqual({
          decimal: 'x',
          thousand: '',
        });
      });

      it('should be same as locale and decimal sep should be undefined', () => {
        expect(
          NumberFormatting._getSeparators('qThou', false, 'x', undefined, {
            qThousandSep: ' ',
            qDecimalSep: ',',
          })
        ).toEqual({ decimal: 'x', thousand: ' ' });

        expect(
          NumberFormatting._getSeparators('qThou', true, 'x', undefined, {
            qThousandSep: ' ',
            qMoneyThousandSep: '-',
            qDecimalSep: ',',
          })
        ).toEqual({ decimal: 'x', thousand: '-' });
      });
    });

    describe('when ref is qDec and decimal sep is undefined or empty string, decimal sep', () => {
      it("should default to '.' when not in locale", () => {
        expect(NumberFormatting._getSeparators('qDec', false, undefined, 'y', {})).toEqual({
          decimal: '.',
          thousand: 'y',
        });

        expect(NumberFormatting._getSeparators('qDec', false, '', 'y', {})).toEqual({
          decimal: '.',
          thousand: 'y',
        });
      });

      it('should be same as locale and thousand sep should be undefined', () => {
        expect(
          NumberFormatting._getSeparators('qDec', false, undefined, 'y', {
            qThousandSep: ' ',
            qDecimalSep: ',',
          })
        ).toEqual({ decimal: ',', thousand: 'y' });

        expect(
          NumberFormatting._getSeparators('qDec', true, undefined, 'y', {
            qThousandSep: ' ',
            qMoneyDecimalSep: '-',
            qDecimalSep: ',',
          })
        ).toEqual({ decimal: '-', thousand: 'y' });

        expect(
          NumberFormatting._getSeparators('qDec', false, '', 'y', {
            qThousandSep: ' ',
            qDecimalSep: ',',
          })
        ).toEqual({ decimal: ',', thousand: 'y' });

        expect(
          NumberFormatting._getSeparators('qDec', true, '', 'y', {
            qThousandSep: ' ',
            qMoneyDecimalSep: '-',
            qDecimalSep: ',',
          })
        ).toEqual({ decimal: '-', thousand: 'y' });
      });
    });
  });

  describe('#setNumFmtPattern', () => {
    let fmt: any;
    let localeInfo: any;
    beforeAll(() => {
      localeInfo = {
        qMoneyDecimalSep: 'md',
        qMoneyThousandSep: 'mt',
        qMoneyFmt: '$#mt##0md00',
        qThousandSep: 't',
        qDecimalSep: 'd',
        qDateFmt: 'm/d/yyyy',
        qTimeFmt: 'hh:mm:ss',
        qTimestampFmt: 'm/d/yyyy h:mm:ss',
      };
    });
    beforeEach(() => {
      fmt = {
        qType: 'U',
        qFmt: '',
        qnDec: 2,
        qDec: '.',
        qThou: ',',
      };
    });

    describe('ref: qType', () => {
      it('should always reset separators to locale defaults', () => {
        const resultingFmt = NumberFormatting.getNumFmtPattern('qType', fmt, localeInfo);
        expect(resultingFmt.qDec).toEqual('d');
        expect(resultingFmt.qThou).toEqual('t');
      });

      it('should always reset separators to money locale defaults', () => {
        fmt.qType = 'M';
        const resultingFmt = NumberFormatting.getNumFmtPattern('qType', fmt, localeInfo);
        expect(resultingFmt.qDec).toEqual('md');
        expect(resultingFmt.qThou).toEqual('mt');
      });

      it('should remove separators when type is D', () => {
        fmt.qType = 'D';
        const resultingFmt = NumberFormatting.getNumFmtPattern('qType', fmt, localeInfo);
        expect(resultingFmt.qDec).toEqual('');
        expect(resultingFmt.qThou).toEqual('');
      });
      it('should remove separators when type is T', () => {
        fmt.qType = 'T';
        const resultingFmt = NumberFormatting.getNumFmtPattern('qType', fmt, localeInfo);
        expect(resultingFmt.qDec).toEqual('');
        expect(resultingFmt.qThou).toEqual('');
      });
      it('should remove separators when type is TS', () => {
        fmt.qType = 'TS';
        const resultingFmt = NumberFormatting.getNumFmtPattern('qType', fmt, localeInfo);
        expect(resultingFmt.qDec).toEqual('');
        expect(resultingFmt.qThou).toEqual('');
      });
      it('should remove separators when type is IV', () => {
        fmt.qType = 'IV';
        const resultingFmt = NumberFormatting.getNumFmtPattern('qType', fmt, localeInfo);
        expect(resultingFmt.qDec).toEqual('');
        expect(resultingFmt.qThou).toEqual('');
      });
    });
  });
});
