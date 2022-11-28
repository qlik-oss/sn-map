import util from './util';

let UNDEF: any;

function getnDecPattern(type: any, nDec: any, decimalSep?: any, thousandSep?: any, localeInfo?: any) {
  if (decimalSep === undefined) {
    decimalSep = localeInfo.qDecimalSep;
  }
  if (thousandSep === undefined) {
    thousandSep = localeInfo.qThousandSep;
  }

  let fmt = '';
  let start;
  let end;
  let i;
  let n;
  if (type === 'F') {
    if (nDec === 0) {
      fmt = `#${thousandSep}##0`;
    } else {
      fmt = `#${thousandSep}##0${decimalSep}`;
      for (i = 0; i < nDec; ++i) {
        fmt += '0';
      }
    }
  } else {
    for (i = 0; i < nDec; ++i) {
      fmt += '#';
    }
    if (nDec > 3) {
      n = fmt.length;
      start = fmt.substring(0, n - 3);
      end = fmt.substr(n - 3);
      fmt = start + thousandSep + end;
    }
  }
  return fmt;
}

export default {
  getNumFmtPattern(type: any, numFormat: any, localeInfo: any) {
    let nDec;
    if (type === 'qType') {
      nDec = 2;
    } else {
      if (numFormat.qType === 'R') {
        nDec = numFormat.qnDec || 10; // if changed something other than qType, make sure nDec > 0 for "Number"
      } else {
        nDec = typeof numFormat.qnDec === 'number' ? Math.max(0, numFormat.qnDec) : 2; // nDec >= 0 for "Fixed to"
      }
    }
    const attr = {
      type: numFormat.qType || 'U',
      nDec,
      thousandSep: numFormat.qThou,
      decimalSep: numFormat.qDec,
    };

    // Engine will not return a separator value if it is set to "" in the script.
    // So we make the assumption that if they are undefined the user really wanted an empty string as separator.
    // At least until engine is updated.
    const separators = this._getSeparators(
      type,
      numFormat.qType === 'M',
      attr.decimalSep,
      attr.thousandSep,
      localeInfo
    );
    if (separators.decimal !== UNDEF) {
      attr.decimalSep = separators.decimal;
    }
    if (separators.thousand !== UNDEF) {
      attr.thousandSep = separators.thousand;
    }

    numFormat.qType = attr.type;
    numFormat.qnDec = attr.nDec;
    numFormat.qDec = attr.decimalSep;
    numFormat.qThou = attr.thousandSep;

    numFormat.qFmt = this._getPattern(attr.type, attr.nDec, attr.decimalSep, attr.thousandSep, localeInfo);

    if (['D', 'T', 'TS', 'IV'].indexOf(attr.type) >= 0) {
      numFormat.qDec = '';
      numFormat.qThou = '';
    }

    return numFormat;
  },
  _getSeparators(ref: any, isMoney: any, decimalSep: any, thousandSep: any, localeInfo: any) {
    let dec = decimalSep;
    let thou = thousandSep;
    const sepType = `q${isMoney ? 'Money' : ''}`;
    if (ref === 'qType') {
      // Force separators to default values when the user changes type. Same behaviour as QV11.
      thou = localeInfo[`${sepType}ThousandSep`] || '';
      dec = localeInfo[`${sepType}DecimalSep`] || '.';
    } else if (ref === 'qThou' && thousandSep === undefined) {
      thou = localeInfo[`${sepType}ThousandSep`] || '';
      dec = decimalSep || '.';
    } else if (ref === 'qDec' && (decimalSep === undefined || decimalSep === '')) {
      // We do not accept an empty string as decimal separator since it would display wrong values to the user
      dec = localeInfo[`${sepType}DecimalSep`] || '.';
      thou = thousandSep || '';
    }
    return {
      decimal: dec || '.',
      thousand: thou || '',
    };
  },
  _getPattern(type: any, nDec?: any, decimalSep?: any, thousandSep?: any, localeInfo?: any) {
    let f;
    switch (type) {
      case 'U':
        return '';
      case 'I':
        return `#${thousandSep}##0`;
      case 'R':
      case 'F':
        return this.getNDecPattern('F', nDec, decimalSep, thousandSep, localeInfo);
      case 'M':
        f = localeInfo.qMoneyFmt;
        if (localeInfo.qMoneyDecimalSep) {
          f = f.replace(new RegExp(util.escapeRegExp(localeInfo.qMoneyDecimalSep), 'g'), decimalSep);
        }
        if (localeInfo.qMoneyThousandSep) {
          f = f.replace(new RegExp(util.escapeRegExp(localeInfo.qMoneyThousandSep), 'g'), thousandSep);
        }
        return f;
      case 'D':
        return localeInfo.qDateFmt;
      case 'T':
        return localeInfo.qTimeFmt;
      case 'TS':
        return localeInfo.qTimestampFmt;
      case 'IV':
        return 'h:mm:ss'; // localeInfo.qTimeFmt;
      default:
        return '';
    }
  },
  getDefaultNumericFormat(fmt: any, localeInfo: any) {
    return getnDecPattern('F', 2, fmt.qDec, fmt.qThou || '', localeInfo);
  },
  getNDecPattern: getnDecPattern,
  getNormalizedFormat(numFormatObject: any, pattern: any) {
    const temp = numFormatObject.qDec + numFormatObject.qThou;
    if (/\u00a0/.test(temp) && !/\u0020/.test(temp)) {
      // if ;nbsp is used and not %20 -> replace all %20 in the input field with ;nbsp
      return pattern.replace(/\u0020/g, '\u00a0');
    }
    return pattern;
  },
};
