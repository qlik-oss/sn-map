import { getValue, setValue } from 'qlik-chart-modules';
import numberFormatting from '../../utils/number-formatting';
import util from '../../utils/util';

const getNumberFormattingProperties = (ref: string = '', show: boolean | ((data: LayerProperties) => boolean)) => {
  const baseRef = ref.length > 0 ? `${ref}.` : ''; // append "." to ref if set.
  const baseRefNoDot = ref.length > 0 ? ref : '';

  function isDefaultFormatPattern(itemData: any, options: any) {
    return (
      getValue(itemData, `${baseRef}qNumFormat.qFmt`) ===
      numberFormatting.getDefaultNumericFormat(
        getValue(itemData, `${baseRef}qNumFormat`),
        options ? options.localeInfo : ''
      )
    );
  }

  function isFormatPatternInputVisible(itemData: any) {
    const type = getValue(itemData, `${baseRef}qNumFormat.qType`);
    return (
      ['R', 'M', 'IV'].indexOf(type) > -1 ||
      (type !== 'U' && getValue(itemData, `${baseRef}numFormatFromTemplate`, true) === false)
    );
  }

  const numberFormattingType = {
    // Number formatting type
    type: 'string',
    component: 'custom-formatter-dropdown',
    ref: `${baseRef}qNumFormat.qType`, // This property is directly referred to in code
    numFormatRef: baseRefNoDot,
    translation: 'properties.numberFormatting',
    defaultValue: 'U',
    schemaIgnore: true,
    options: [
      {
        value: 'U',
        translation: 'Common.Auto',
      },
      {
        value: 'F',
        translation: 'properties.numberFormatting.types.number',
      },
      {
        value: 'M',
        translation: 'properties.numberFormatting.types.money',
      },
      {
        value: 'D',
        translation: 'properties.numberFormatting.types.date',
      },
      {
        value: 'IV',
        translation: 'properties.numberFormatting.types.duration',
      },
      {
        value: 'R',
        translation: 'Common.Custom',
      },
      {
        value: 'OFF',
        translation: 'properties.numberFormatting.types.customFormatting',
      },
    ],
    change(itemData: any, _handler: any, _properties: any, options: any) {
      const numFormat = numberFormatting.getNumFmtPattern(
        'qType',
        getValue(itemData, `${baseRef}qNumFormat`),
        options.localeInfo
      );
      setValue(itemData, `${baseRef}qNumFormat`, numFormat);
    },
  };

  const numberFormattingMode = {
    type: 'boolean',
    component: 'switch',
    ref: `${baseRef}numFormatFromTemplate`,
    translation: 'properties.numberFormatting.formatting',
    defaultValue: true,
    options: [
      {
        value: true,
        translation: 'properties.numberFormatting.simple',
      },
      {
        value: false,
        translation: 'Common.Custom',
      },
    ],
    show(data: any) {
      return ['F', 'D', 'TS', 'T'].indexOf(getValue(data, `${baseRef}qNumFormat.qType`)) > -1;
    },
  };

  const numberFormattingTemplates = {
    // Number formatting type
    type: 'string',
    component: 'number-formatter-dropdown',
    ref: `${baseRef}qNumFormat.qFmt`, // This property is directly referred to in code
    numFormatRef: baseRefNoDot,
    defaultValue: '#,##0',
    schemaIgnore: true,
    show(itemData: any) {
      const type = getValue(itemData, `${baseRef}qNumFormat.qType`);
      return (
        ['F', 'D', 'TS', 'T'].indexOf(type) > -1 && getValue(itemData, `${baseRef}numFormatFromTemplate`, true) === true
      );
    },
  };

  const numDecimals = {
    // Number of decimals
    type: 'integer',
    ref: `${baseRef}qNumFormat.qnDec`,
    translation: 'properties.numberFormatting.nDec',
    defaultValue: 2,
    schemaIgnore: true,
    min: 0,
    max: 14, // Limitation in engine
    show: false,
  };

  const numPrecisionDigits = {
    // Number of precision digits (uses the same property as number of decimals)
    type: 'integer',
    ref: `${baseRef}qNumFormat.qnDec`,
    translation: 'properties.numberFormatting.significantFigures',
    defaultValue: 10,
    schemaIgnore: true,
    min: 1,
    max: 14, // Limitation in engine
    show: false,
  };

  const decimalSep = {
    // Decimal separator
    type: 'string',
    ref: `${baseRef}qNumFormat.qDec`,
    translation: 'properties.numberFormatting.dec',
    defaultValue: '.',
    schemaIgnore: true,
    show(itemData: any) {
      const type = getValue(itemData, `${baseRef}qNumFormat.qType`);
      return type === 'R';
    },
    change(itemData: any, _handler: any, _properties: any, options: any) {
      const numFormat = numberFormatting.getNumFmtPattern(
        'qDex',
        getValue(itemData, `${baseRef}qNumFormat`),
        options.localeInfo
      );
      setValue(itemData, `${baseRef}qNumFormat`, numFormat);
    },
    invalid(itemData: any) {
      return getValue(itemData, `${baseRef}qNumFormat.qDec`) === getValue(itemData, `${baseRef}qNumFormat.qThou`);
    },
    readOnly(itemData: any, _handler: any, _properties: any, options: any) {
      return !isDefaultFormatPattern(itemData, options);
    },
  };

  const thousandSep = {
    // Thousands separator
    type: 'string',
    ref: `${baseRef}qNumFormat.qThou`,
    translation: 'properties.numberFormatting.thousandSeparator',
    defaultValue: '',
    schemaIgnore: true,
    show(itemData: any) {
      const type = getValue(itemData, `${baseRef}qNumFormat.qType`);
      return type === 'R';
    },
    change(itemData: any, _handler: any, _properties: any, options: any) {
      const numFormat = numberFormatting.getNumFmtPattern(
        'qThou',
        getValue(itemData, `${baseRef}qNumFormat`),
        options.localeInfo
      );
      setValue(itemData, `${baseRef}qNumFormat`, numFormat);
    },
    invalid(itemData: any) {
      const type = getValue(itemData, `${baseRef}qNumFormat.qType`);
      if (type === 'I') {
        return false;
      }
      return getValue(itemData, `${baseRef}qNumFormat.qDec`) === getValue(itemData, `${baseRef}qNumFormat.qThou`);
    },
    readOnly(itemData: any, _handler: any, _properties: any, options: any) {
      return !isDefaultFormatPattern(itemData, options);
    },
  };

  const format = {
    // Format pattern
    type: 'string',
    component: 'number-formatter',
    ref: `${baseRef}qNumFormat.qFmt`,
    numFormatRef: baseRefNoDot,
    resetTranslation: 'properties.numberFormatting.resetPattern',
    translation: 'properties.numberFormatting.formatPattern',
    defaultValue: '',
    schemaIgnore: true,
    show(itemData: any) {
      return isFormatPatternInputVisible(itemData);
    },
    change(itemData: any) {
      setValue(
        itemData,
        `${baseRef}qNumFormat.qFmt`,
        numberFormatting.getNormalizedFormat(
          getValue(itemData, `${baseRef}qNumFormat`),
          getValue(itemData, `${baseRef}qNumFormat.qFmt`)
        )
      );
    },
    invalid(itemData: any, _props: any, options: any) {
      if (['D', 'T', 'TS', 'IV'].indexOf(getValue(itemData, `${baseRef}qNumFormat.qType`)) > -1) {
        return false;
      }

      const decimalDelimiter =
        getValue(itemData, `${baseRef}qNumFormat.qType`) === 'R'
          ? getValue(itemData, `${baseRef}qNumFormat.qDec`)
          : options.localeInfo[`q${getValue(itemData, `${baseRef}qNumFormat.qType`) === 'M' ? 'Money' : ''}DecimalSep`];

      const r = new RegExp(`(0|#)${util.escapeRegExp(decimalDelimiter)}0*#*`);
      const fmt = (getValue(itemData, `${baseRef}qNumFormat.qFmt`) || '').split(';');
      const posMatch = fmt[0].match(r);
      const posNum = posMatch && posMatch[0] ? posMatch[0].length - 2 : 0;
      const negMatch = fmt[1] ? fmt[1].match(r) : null;
      const negNum = negMatch && negMatch[0] ? negMatch[0].length - 2 : 0;
      return posNum > 15 || negNum > 15;
    },
  };

  const numberFormattingProps = {
    type: 'items',
    show: (data: LayerProperties) => {
      return typeof show === 'function' ? show(data) : show;
    },
    items: {
      numberFormattingType,
      numberFormattingMode,
      numberFormattingTemplates,
      numDecimals,
      numPrecisionDigits,
      decimalSep,
      thousandSep,
      format,
    },
  };
  return numberFormattingProps;
};

const getNumberFormattingPropertiesWithMasterLink = (
  ref: string = '',
  show: boolean | ((data: LayerProperties) => boolean),
  isLink: (data: LayerProperties) => boolean
) => {
  const baseRef = ref.length > 0 ? `${ref}.` : '';
  const numFormatRefQ = `${baseRef}quarantine.qNumFormat`;

  return {
    type: 'items',
    show,
    items: {
      useMasterFormat: {
        type: 'boolean',
        component: 'switch',
        translation: 'properties.libraryFormatting',
        convertFunctions: {
          get(_getFn: any, _definition: any, _args: any, data: LayerProperties) {
            return !!getValue(data, numFormatRefQ, false);
          },
          set(value: boolean, _setFn: any, _definition: any, _args: any, data: LayerProperties) {
            let formatting = ref ? getValue(data, ref) : data;
            if (!formatting && ref) {
              formatting = {};
              setValue(data, ref, formatting);
            }
            if (value) {
              formatting.quarantine = {
                qNumFormat: formatting.qNumFormat || {},
                isCustomFormatted: formatting.isCustomFormatted || false,
              };
              formatting.qNumFormat = null;
              formatting.isCustomFormatted = undefined;
            } else {
              formatting.qNumFormat = formatting.quarantine?.qNumFormat || {};
              formatting.isCustomFormatted = formatting.quarantine?.isCustomFormatted || false;
              formatting.quarantine = undefined;
            }
          },
        },
        show(data: LayerProperties) {
          return isLink(data);
        },
        options: [
          { value: true, translation: 'properties.on' },
          { value: false, translation: 'properties.off' },
        ],
      },
      numberFormat: getNumberFormattingProperties(
        ref,
        (data: LayerProperties) => !isLink(data) || !getValue(data, numFormatRefQ, false)
      ),
    },
  };
};

export default { getNumberFormattingPropertiesWithMasterLink };
