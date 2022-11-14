import Tool from '../common/tool';

class Tooltip extends Tool {
  map: idevio.map.WebMap;

  constructor(map: idevio.map.WebMap) {
    super(map);
    this.map = map;
    this.connectTo(map);
  }

  click(event: idevio.map.PositionEvent) {
    console.log('click', event);
  }

  open(event: idevio.map.PositionEvent) {
    const features = this.map.getFeaturesAt(event.clientX, event.clientY);
    if (features.length === 0) {
      return;
    }
    console.log('open', features);
  }

  close(event: idevio.map.PositionEvent) {
    console.log('close', event);
  }

  update(event: idevio.map.PositionEvent) {
    console.log('upate', event);
  }

  _connecting(): void {
    this._addListener('move', this.open);
    this._addListener('draw', this.update);
    this._addListener('out', this.close);
    this._addListener('basemapchanged', this.close);
  }

  _disconnecting(): void {
    this.close;
  }
}

export default Tooltip;
