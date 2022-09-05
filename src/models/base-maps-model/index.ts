export class CoreBaseMapsModel {
  availableMaps: string[];
  constructor() {
    this.availableMaps = [];
  }

  setAvailableMaps(baseMaps: string[]) {
    this.availableMaps = baseMaps;
  }

  getAvailableMaps(): string[] {
    this.updateAvailableMaps();
    return this.availableMaps;
  }

  updateAvailableMaps() {
    if (this.availableMaps.length !== 0) return;
    const baseMaps = this.getServerBaseMaps();
    if (baseMaps) this.setAvailableMaps(baseMaps);
  }

  getServerBaseMaps() {
    if (!idevio.map?.WebMap) return;

    let availableMaps = idevio.map.WebMap.getLoadedBaseMaps();
    idevio.map.WebMap.getAvailableBaseMaps((maps) => {
      if (Array.isArray(maps) && maps.length > 0) {
        maps = maps.slice(); // slice to get rid of GWT crap in the returned array (currently returns a GWT Java array)
        availableMaps = ['empty', 'emptymeters', 'emptydegreemercator'].concat(maps);
      }
    });

    return availableMaps.slice();
  }
}
