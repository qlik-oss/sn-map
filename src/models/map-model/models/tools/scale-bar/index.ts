import Tool from '../common/tool';

interface ScaleBarOptions {
  /**
   * System of units to show.
   *
   * Default: "metric"
   */
  map?: idevio.map.WebMap;
  type?: 'metric' | 'imperial';
}

class ScaleBar extends Tool {
  private type: string;
  public useImperial: boolean;
  private lastLength: string = '1000';

  private _mapCanvas: HTMLCanvasElement | null = null;
  private _div: HTMLDivElement;
  private _span: HTMLSpanElement;

  constructor(options: ScaleBarOptions = {}) {
    super(options);
    this.type = options.type?.toLowerCase() ?? 'metric';
    if (this.type !== 'metric' && this.type !== 'imperial') {
      throw new Error(`Invalid ScaleBar argument '${this.type}'`);
    }

    const overlayColor = '#454545';
    const overlayHalo = '#FFFFFF';

    this.useImperial = this.type === 'imperial';

    this._div = document.createElement('div');
    this._span = document.createElement('span');
    this._div.style.position = 'absolute';
    this._div.style.bottom = '5px';
    this._div.style.left = '5px';
    this._div.style.height = '6px';
    this._div.style.borderStyle = 'none solid solid solid';
    this._div.style.borderWidth = '1px';
    this._div.style.textAlign = 'center';
    this._div.style.boxSizing = 'content-box';
    this._div.style.borderColor = overlayColor;
    this._div.style.filter = `drop-shadow(-1px 0px 0 ${overlayHalo}) drop-shadow(1px 0px 0 ${overlayHalo}) drop-shadow(0px -1px 0 ${overlayHalo}) drop-shadow(0px 1px 0 ${overlayHalo})`;
    this._span.style.position = 'relative';
    this._span.style.top = '-10px';
    this._span.style.font = 'bold 8pt sans-serif';
    this._span.style.pointerEvents = 'none';
    this._div.appendChild(this._span);
    this._div.className = 'scalebar';
  }

  _connecting() {
    if (this._map) {
      this._mapCanvas = this._map.getDiv().querySelector('canvas');
      this._addListener('draw', this._show);
      this._map.getDiv().firstChild!.appendChild(this._div);
      this._show();
    }
  }

  _disconnecting() {
    if (this._div?.parentNode) {
      this._div.parentNode.removeChild(this._div);
    }
  }

  _show() {
    const oneMeterInFeet = 3.28;
    const oneMileInFeet = 5280;
    if (!this._map || !this._mapCanvas) {
      return;
    }
    let maxPixelWidth = 100;
    if (this.useImperial) {
      maxPixelWidth *= oneMeterInFeet;
    }

    const height = this._mapCanvas.clientHeight;
    const width = this._mapCanvas.clientWidth;
    let geoLength = this._map!.getDistanceInMeters(
      [width / 2, (height - maxPixelWidth) / 2],
      [width / 2, (height + maxPixelWidth) / 2]
    );

    if (this.lastLength !== geoLength.toPrecision(3)) {
      this.lastLength = geoLength.toPrecision(3);

      let suffix = ' m';
      if (this.useImperial) {
        suffix = ' ft';
        if (geoLength > oneMileInFeet) {
          geoLength /= oneMileInFeet;
          suffix = ' mi';
        }
      } else if (geoLength > 1000) {
        geoLength /= 1000;
        suffix = ' km';
      }

      // get closest 10^x lower than the distance
      const pow = Math.pow(10, (Math.log(geoLength) / Math.log(10)) | 0);
      const geoLengthOld = geoLength;
      // round and check if 2 or 5 times that power fits
      geoLength = (geoLength / pow) | 0;
      geoLength = (geoLength >= 5 ? 5 : geoLength >= 2 ? 2 : geoLength) * pow;

      this._span.innerHTML = geoLength + suffix;

      let lengthPx = (geoLength / geoLengthOld) * maxPixelWidth;
      if (this.useImperial) {
        lengthPx /= oneMeterInFeet;
      }

      this._div.style.width = Math.round(lengthPx) + 'px';
    }
  }
}

export default ScaleBar;
