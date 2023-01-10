export class StyleModel {
  colorTable: { [key: string]: string } = {};

  // Create style if missing and returns the key
  getStyleKey(layoutService: LayoutService) {
    const color = this.getColor(layoutService);
    const key = color;

    if (!this.colorTable[key]) {
      this.colorTable[key] = color;
    }
    return key;
  }

  getColor(layoutService: LayoutService) {
    const colorMode = layoutService.getLayoutValue('color.mode');
    if (colorMode === 'primary') {
      return layoutService.getLayoutValue('color.paletteColor.color');
    }
  }

  getStyles() {
    const style: idevio.map.PolygonStyle = {
      type: 'polygon',
      colorKey: 'styleKey',
      colors: this.colorTable,
      outline: 'black',
    };

    return [style];
  }
}
