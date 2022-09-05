type Map = {
  id: string;
  map: idevio.map.WebMap;
};

module MapUtils {
  /* ## STATICS ## */
  export const maps: Map[] = [];

  export function registerMap(id: string, map: idevio.map.WebMap) {
    maps.push({ id, map });
  }

  export function unregisterMap(id: string) {
    const index = maps.findIndex((map) => map.id === id);
    if (index > -1) {
      maps.splice(index, 1);
    }
  }

  /**
   * Gets the corresponding map or throws an error if not found.
   * @param id The qId of the map you want to get.
   * @returns The corresponding map if found.
   */
  export function getMap(id: string): idevio.map.WebMap {
    const map = maps.find((map) => map.id === id)?.map;
    if (map === undefined) {
      throw new TypeError(`Map with id '${id}' was not found`);
    }
    return map;
  }

  export function setLanguage(language: string | undefined, map: idevio.map.WebMap) {
    // Auto currently means layer Point is used (local), other is set to Eng
    const n = map.getLayerCount();
    for (let i = 0; i < n; i++) {
      const l = map.getLayer(i);
      if (l.isBaseLayer()) {
        const name = l.getName();
        if (name.length > 3 && name.substring(name.length - 3) === 'Eng') {
          const localLayer = map.getLayer(name.substring(0, name.length - 3));
          if (!localLayer) {
            continue; // there should always be a corresponding local layer to an Eng layer
          }
          if (language === 'english' || (language === 'auto' && name !== 'PointsEng')) {
            l.setVisible(true);
            localLayer.setVisible(false);
          } else {
            l.setVisible(false);
            localLayer.setVisible(true);
          }
        }
      }
    }
  }
}

export default MapUtils;
