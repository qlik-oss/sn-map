import dataUtils from '../../common/utils/data-utils';
import MathUtils from '../../../../utils/MathUtils';

interface Style {
  color: string | undefined;
  size: number;
}

export class SymbolModel {
  symbols: { [key: string]: idevio.map.Icon } = {};

  addSymbol(data: PointData[], layoutService: LayoutService) {
    return data.map((pointData: PointData) => {
      console.log('pointData===', pointData);
      const style = this.collectStyle(layoutService);
      const key = this.makeKey(style);

      if (!this.symbols[key]) {
        this.symbols[key] = this.makeSymbol(style);
      }
      return { ...pointData, key };
    });
  }

  private collectStyle(layoutService: LayoutService) {
    const size = this.getSize(layoutService) as number;
    const color = this.getColor(layoutService) as string;
    return {
      size,
      color,
    };
  }

  private getSize(layoutService: LayoutService) {
    const radiusMin = layoutService.getLayoutValue('size.radiusMin') as number;
    const radiusMax = layoutService.getLayoutValue('size.radiusMax') as number;
    const autoRadiusValueRange = layoutService.getLayoutValue('size.autoRadiusValueRange');
    const radiusValueMin = layoutService.getLayoutValue('size.radiusValueMin');
    const radiusValueMax = layoutService.getLayoutValue('size.radiusValueMax');

    const valuesMinMax = dataUtils.getMinMax('size', layoutService.getLayoutValue('qHyperCube')); // null if not attribute dependent size
    console.log('valuesMinMax===', valuesMinMax);
    const sizeMinMax = autoRadiusValueRange === false ? [radiusValueMin, radiusValueMax] : valuesMinMax || [0, 0];
    const singleSize = Math.round((radiusMin + radiusMax) / 2);

    // const sizearr = DataUtils.getNumericData('size', dataPage, layoutService.getLayoutValue('qHyperCube'));
    const sizearr = [];
    const rowIndex = 0;
    const size = (!sizearr.length ? singleSize : sizearr[rowIndex]) as number;
    console.log('size===', size);
    const result = this.calculateSymbolSize(size, sizeMinMax[0], sizeMinMax[1], radiusMin, radiusMax).size;
    console.log('result===', result);
    return result;
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

  private calculateSymbolSize(sizeValue: number, min: number, max: number, minSymbol: number, maxSymbol: number) {
    const quantifyTo = Math.max(1, Math.min(max - min, 50)); // not necessary to do more than one symbol per pixel
    return MathUtils.calculateSize(sizeValue, [minSymbol, maxSymbol], [min, max], quantifyTo);
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
