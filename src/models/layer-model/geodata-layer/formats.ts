import Utils from './utils';
import GeneralUtils from '../../../utils/general';
import { getValue } from 'qlik-chart-modules';

module Formats {
  const FAILED_IMAGE: HTMLImageElement = (() => {
    const img = new Image();
    img.src =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAgMAAAAhHED1AAAACVBMVEUAAAD/AAD/AADZP3bhAAAAA\
            3RSTlMAgLrqQQYHAAAAa0lEQVR42u3cMREAIAADsS44YMEVCw7wrwERnbjLC4iDNnXjVO2sDriZqZoAAAAAAAAAAAAAAAAAAAAAAAAAAAA\
            AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8DbTT/f48oO0BDHZ7DTLJsl8AAAAASUVORK5CYII=';
    return img;
  })();
  const EMPTY_IMAGE: HTMLImageElement = (() => {
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    return img;
  })();

  export function getWMSDataset(layout: GeodataLayerProperties, projection: string) {
    const wmsSettings = getValue(layout, 'wms', {});
    let url = (wmsSettings.url || '').trim();
    const version = wmsSettings.version || '1.1.0';
    const crs = wmsSettings.hasWmsLoaded ? wmsSettings.selectedCrs || getMapCrs(projection) : getMapCrs(projection);

    if (wmsSettings.hasWmsLoaded) {
      let layers = '';
      const capaLayers = wmsSettings.capabilities.layers.filter((layer: WMSLayer) => layer.selected);
      for (let i = 0; i < capaLayers.length; i++) {
        layers += capaLayers[i].name;
        if (i + 1 !== capaLayers.length) {
          layers += ',';
        }
      }
      const format = `image/${wmsSettings.selectedFormat.toLowerCase()}`;
      const transparent = `${wmsSettings.capabilities.transparent}`;
      const styles = '';

      const parameters: string[] = [];
      parameters.push('service=WMS');
      parameters.push(`transparent=${transparent}`);
      parameters.push('request=GetMap');
      parameters.push(`layers=${layers}`);
      parameters.push(`styles=${styles}`);
      parameters.push(`format=${format}`);

      url = GeneralUtils.addUrlParameters(url, parameters);
    }

    return new idevio.map.WmsDataset({
      url,
      version,
      crs,
      crossOrigin: 'auto',
    });
  }

  export function getTMSDataset(layout: GeodataLayerProperties, projection: string) {
    const tmsSettings = getValue(layout, 'tms');
    const url = (tmsSettings.url || '').trim();
    const auto = tmsSettings.auto;

    const urlFunction = (path: string, tx: number, ty: number, level: number) => {
      try {
        ty = -(ty + 1);
        return Utils.parseUrl(path, tx, ty, level, auto);
      } catch (e) {
        console.log('ERROR: invalid url');
        return null;
      }
    };

    const tileDatasetOptions: idevio.map.PartialTiledImageDatasetOptions = {
      url,
      crossOrigin: 'auto',
      noTileImage: EMPTY_IMAGE,
      failedTileImage: FAILED_IMAGE,
      urlFunction,
    };

    if (!auto) {
      tileDatasetOptions.tileSizePixels = tmsSettings.tileSize;
      tileDatasetOptions.tileWidth = tmsSettings.tileWidth;
      tileDatasetOptions.tileHeight = tmsSettings.tileHeight;
      tileDatasetOptions.originX = tmsSettings.originLeft;
      tileDatasetOptions.originY = tmsSettings.originTop;
      tileDatasetOptions.levels = 20;
      tileDatasetOptions.crs = getMapCrs(projection);
    }

    return tileDatasetOptions;
  }

  export function getImageDataset(layout: GeodataLayerProperties) {
    const imageSettings = getValue(layout, 'image');
    const url = (imageSettings.url || '').trim();
    const minX = isNaN(imageSettings.minX) ? 0 : imageSettings.minX;
    const minY = isNaN(imageSettings.minY) ? 0 : imageSettings.minY;
    const maxX = isNaN(imageSettings.maxX) ? 5 : imageSettings.maxX;
    const maxY = isNaN(imageSettings.maxY) ? 5 : imageSettings.maxY;
    const rectangle: Rectangle = {
      min: [minX, minY],
      max: [maxX, maxY],
    };
    return new idevio.map.StaticImageDataset({
      url: url,
      crossOrigin: 'auto',
      bounds: rectangle,
    });
  }

  export function getMapCrs(projection: string) {
    const nameProj = projection.split('_');
    return nameProj.length > 1 && (nameProj[1] === 'adaptive' || nameProj[0] === 'empty') ? 'EPSG:4326' : 'EPSG:3857';
  }
}

export default Formats;
