interface Style {
  color: string | undefined;
  size: number;
}

export class SymbolModel {
  symbols: { [key: string]: idevio.map.Icon } = {};

  addSymbol(data: PointData[], layoutService: LayoutService) {
    return data.map((pointData: PointData) => {
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
    const singleSize = Math.round((radiusMin + radiusMax) / 2);
    return singleSize;
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
