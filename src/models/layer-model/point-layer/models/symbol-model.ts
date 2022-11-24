import dataUtils from '../../common/utils/data-utils';
import MathUtils from '../../../../utils/math-utils';

interface Style {
  color: string | undefined;
  size: number;
}

export class SymbolModel {
  symbols: { [key: string]: idevio.map.Icon } = {};

  addSymbol(data: PointData[], layoutService: LayoutService) {
    return data.map((pointData: PointData) => {
      const style = this.collectStyle(pointData, layoutService);
      const key = this.makeKey(style);

      if (!this.symbols[key]) {
        this.symbols[key] = this.makeSymbol(style);
      }
      return { ...pointData, key };
    });
  }

  private collectStyle(pointData: PointData, layoutService: LayoutService) {
    const size = this.getSize(pointData, layoutService) as number;
    const color = this.getColor(layoutService) as string;
    return {
      size,
      color,
    };
  }

  // Should only be used for max/min width/radius of bubble layer and line layer.
  private getSizeFromSliderValue = (value: number) => {
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

  private calculateRadiusFromSliderProperties = (sizeProps: SizeProperties) => {
    if (sizeProps.expression && sizeProps.expression.key?.length > 0) {
      // handle slider with two values
      return {
        radiusMin: this.getSizeFromSliderValue(sizeProps.sliderRangeValues[0]),
        radiusMax: this.getSizeFromSliderValue(sizeProps.sliderRangeValues[1]),
      };
    } else {
      // handle single slider
      const val = this.getSizeFromSliderValue(sizeProps.sliderSingleValue);
      const d = Math.ceil(val / 2);
      return { radiusMin: val - d, radiusMax: val + d };
    }
  };

  private getSize(pointData: PointData, layoutService: LayoutService) {
    const { radiusMin, radiusMax } = this.calculateRadiusFromSliderProperties(layoutService.getLayoutValue('size'));
    const autoRadiusValueRange = layoutService.getLayoutValue('size.autoRadiusValueRange');
    const customMinRangeValue = layoutService.getLayoutValue('size.customMinRangeValue');
    const customMaxRangeValue = layoutService.getLayoutValue('size.customMaxRangeValue');
    const qHyperCube = layoutService.getLayoutValue('qHyperCube');
    const dimensionExpressionInfo = dataUtils.getDimensionExpressionInfo('size', qHyperCube);
    const attrExprMinMax = dataUtils.getMinMax(qHyperCube, dimensionExpressionInfo); // null if not attribute dependent size

    const sizeMinMax = // Describes the size set either by the input fields or by the min and max values of the radius
      autoRadiusValueRange === false
        ? { min: customMinRangeValue, max: customMaxRangeValue }
        : attrExprMinMax || { min: 0, max: 0 };

    const sizeFromSingleSlider = Math.round((radiusMin + radiusMax) / 2);
    let sizeFromExpression;
    if (dimensionExpressionInfo?.dimensionIndex === 0) {
      sizeFromExpression = pointData.qAttrExps?.qValues[dimensionExpressionInfo.index]?.qNum;
    }
    const size = (sizeFromExpression ?? sizeFromSingleSlider) as number;
    const quantifyTo = Math.max(1, Math.min(sizeMinMax.max - sizeMinMax.min, 50)); // not necessary to do more than one symbol per pixel
    return MathUtils.calculateSize(size, [radiusMin, radiusMax], [sizeMinMax.min, sizeMinMax.max], quantifyTo).size; // calculate symbol size
  }

  private getColor(layoutService: LayoutService) {
    const colorMode = layoutService.getLayoutValue('color.mode');
    if (colorMode === 'primary') {
      return layoutService.getLayoutValue('color.paletteColor.color');
    }
  }

  private makeKey(style: Style) {
    return `${style.size}_${style.color}`;
  }

  private makeSymbol(style: Style) {
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
