import MapUtils from '../../../../utils/map';
import { CoreBaseMapsModel } from '../../../base-maps-model';

export class BaseMapModel extends CoreBaseMapsModel implements BaseMapModelInterface {
  map: idevio.map.WebMap;
  crs: string;
  constructor(map: idevio.map.WebMap) {
    super();
    this.map = map;
    this.crs = 'EPSG:4326';
  }

  update(mapSettings: MapSettings) {
    const baseMap = this.getBaseMapOrEmpty(mapSettings.projection);
    if (this.map.getBaseMap() !== baseMap) {
      this.updateBaseMap(baseMap);
      this.updateCrs(baseMap);
      MapUtils.setLanguage(mapSettings.mapLanguage, this.map);
      this.map.repaint();
    }
  }

  updateBaseMap(baseMap: string) {
    const oldCenter = this.map.getCenter();
    const oldResolution = this.map.getResolution();

    this.map.setBaseMap(baseMap);
    this.setStyle(baseMap);

    this.map.setCenter(oldCenter);
    this.map.setResolution(oldResolution);
  }

  setStyle(baseMap: string) {
    if (baseMap.indexOf('empty') !== 0) return;
    this.map.setStyle({
      background: 'transparent',
    });
  }

  updateCrs(baseMap: string) {
    if (baseMap === 'emptymeters') {
      this.crs = 'UndefinedMeters';
    } else {
      this.crs = 'EPSG:4326';
    }
  }

  getBaseMapOrEmpty(baseMap: string | undefined): string {
    if (baseMap !== undefined && this.getAvailableMaps().includes(baseMap)) {
      return baseMap;
    }
    return 'empty';
  }
}
