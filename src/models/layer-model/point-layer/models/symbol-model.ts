import MathUtils from '../../../../utils/math-utils';

interface Style {
  color: string | undefined;
  size: number;
}

export class SymbolModel {
  symbols: { [key: string]: idevio.map.Icon } = {};

  addSymbolToData(data: PointData[], layoutService: LayoutService) {
    return data.map((pointData: PointData) => {
      const style = this.collectStyle(pointData, layoutService);
      const key = this.makeKey(style);

      if (!this.symbols[key]) {
        this.symbols[key] = this.makeSymbol(style);
      }
      return { ...pointData, key };
    });
  }

  collectStyle(pointData: PointData, layoutService: LayoutService) {
    const size = this.getSize(pointData, layoutService) as number;
    const color = this.getColor(layoutService) as string;
    return {
      size,
      color,
    };
  }

  getSize(pointData: PointData, layoutService: LayoutService) {
    let sizeMinMax: { min: number; max: number };
    let size: number | undefined;
    const sizeProps = layoutService.getLayoutValue('size');
    const sizeIsExpression = pointData.hasOwnProperty('size');
    const { radiusMin, radiusMax } = this.calculateRadiusFromSliderProperties(sizeProps);
    if (sizeIsExpression) {
      const sizeMeta = layoutService.meta.attributes.size;
      const attrExprMinMax = { min: sizeMeta.minValue, max: sizeMeta.maxValue };
      const { autoRadiusValueRange, customMinRangeValue, customMaxRangeValue } = sizeProps;
      sizeMinMax =
        autoRadiusValueRange === false ? { min: customMinRangeValue, max: customMaxRangeValue } : attrExprMinMax;
      size = pointData.size;
    } else {
      sizeMinMax = { min: 0, max: 0 };
      size = Math.round((radiusMin + radiusMax) / 2);
    }
    const quantifyTo = Math.max(1, Math.min(sizeMinMax.max - sizeMinMax.min, 50)); // not necessary to do more than one symbol per pixel
    return MathUtils.calculateSize(size, [radiusMin, radiusMax], [sizeMinMax.min, sizeMinMax.max], quantifyTo).size;
  }

  calculateRadiusFromSliderProperties = (sizeProps: SizeProperties) => {
    if (sizeProps.expression && sizeProps.expression.key?.length > 0) {
      // handle slider with two values
      return {
        radiusMin: this.getSizeFromSliderValue(sizeProps.rangeValues[0]),
        radiusMax: this.getSizeFromSliderValue(sizeProps.rangeValues[1]),
      };
    } else {
      // handle single slider
      const val = this.getSizeFromSliderValue(sizeProps.value);
      const d = Math.ceil(val / 2);
      return { radiusMin: val - d, radiusMax: val + d };
    }
  };

  // Should only be used for max/min width/radius of point layer and line layer.
  getSizeFromSliderValue = (value: number) => {
    if (value < 20) {
      return Math.ceil(value / 2);
    } else if (value < 40) {
      return 10 + (value - 20);
    } else if (value < 60) {
      return 30 + (value - 40) * 2;
    } else {
      return 70 + (value - 60) * 4;
    }
  };

  getColor(layoutService: LayoutService) {
    const colorMode = layoutService.getLayoutValue('color.mode');
    if (colorMode === 'primary') {
      return layoutService.getLayoutValue('color.paletteColor.color');
    }
  }

  makeKey(style: Style) {
    return `${style.size}_${style.color}`;
  }

  makeSymbol(style: Style) {
    return idevio.map.IconFactory.circle({
      radius: style.size,
      color: style.color,
      outline: 'black',
    });
  }

  getStyles() {
    const style: idevio.map.SymbolStyle = {
      type: 'symbol',
      icons: this.symbols,
      iconKey: 'key',
    };

    return [style];
  }
}
