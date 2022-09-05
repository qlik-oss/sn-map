class Tool {
  _map: idevio.map.WebMap | null;
  _active: boolean;
  _listeners: any;

  constructor(options: any) {
    options = options || {};
    this._map = null;
    this._active = options.active !== false;
    this._listeners = [];
  }

  isActive(isActive: boolean) {
    this._active = isActive;
  }

  _disconnecting() {}
  _connecting() {}

  disconnect() {
    this._disconnecting();
    if (this._map) {
      for (let i = 0; i < this._listeners.length; i++) {
        this._map.removeListener(this._listeners[i]);
      }
    }
    this._listeners.length = 0;
    this._map = null;
  }

  connectTo(map: idevio.map.WebMap) {
    if (this._map) {
      this.disconnect();
    }

    this._map = map;
    this._addListener('destroy', this.disconnect);
    this._connecting();
  }

  _addListener(type: string, func: Function) {
    const _this = this;
    if (this._map) {
      this._listeners.push(
        this._map.addListener(type, function (event: idevio.map.Event) {
          if (_this._active) {
            func.call(_this, event);
          }
        })
      );
    }
  }
}

export default Tool;
