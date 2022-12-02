class WebMap {
  static getLoadedBaseMaps = jest.fn();
  static getAvailableBaseMaps = jest.fn();

  getBaseMap = jest.fn();
  setBaseMap = jest.fn();

  getCenter = jest.fn();
  setCenter = jest.fn();

  getAttribution = jest.fn();
  setAttribution = jest.fn();

  getHighlighted = jest.fn();
  setHighlighted = jest.fn();

  getResolution = jest.fn();
  setResolution = jest.fn();

  getScale = jest.fn();
  setScale = jest.fn();

  getDiv = jest.fn();

  getNearestZoomLevel = jest.fn();

  getLayerCount = jest.fn();
  getLayer = jest.fn();
  getLayers = jest.fn();

  setZoomLevel = jest.fn();
  getZoomLevelResolution = jest.fn();
  setMinLevel = jest.fn();
  setMaxLevel = jest.fn();
  getMinLevel = jest.fn();
  getMaxLevel = jest.fn();
  setMinResolution = jest.fn();
  setMaxResolution = jest.fn();
  getMinResolution = jest.fn();
  getMaxResolution = jest.fn();

  getWrapLongitude = jest.fn();

  addListener = jest.fn();
  removeListener = jest.fn();

  setInteracting = jest.fn();

  getGeoBounds = jest.fn();
  viewGeoBounds = jest.fn();
  getViewBounds = jest.fn();
  setViewBounds = jest.fn();
  geoToDisplay = jest.fn();
  displayToGeo = jest.fn();

  setStyle = jest.fn();

  zoom = jest.fn();
  zoomTo = jest.fn();

  zoomInOneLevel = jest.fn();
  zoomOutOneLevel = jest.fn();

  pan = jest.fn();
  moveTo = jest.fn();
  setPixelDensity = jest.fn();

  getFeatureAt = jest.fn();
  getFeaturesAt = jest.fn();
  getFeaturesWithin = jest.fn();
  getDistanceInMeters = jest.fn();

  repaint = jest.fn();
  destroy = jest.fn();

  print = jest.fn();
  printTree = jest.fn();
}

class Dataset {
  getCrs = jest.fn();
  getName = jest.fn();
  addListener = jest.fn();
  removeListener = jest.fn();
  getAll = jest.fn();
  getInRect = jest.fn();
  getBounds = jest.fn();
  getAlternateBounds = jest.fn();
  removeAll = jest.fn();
}

class MemoryDataset extends Dataset {
  static installFormat = jest.fn();

  load = jest.fn();
  save = jest.fn();
  getAll = jest.fn();
  getInRect = jest.fn();
  remove = jest.fn();
  sort = jest.fn();
}

class LocationDataset extends MemoryDataset {
  static create = jest.fn();

  addData = jest.fn();
  setData = jest.fn();
}

class IconFactory {
  static cross = jest.fn();
  static circle = jest.fn();
  static polygon = jest.fn();
}

class Layer {
  getName = jest.fn();
  setName = jest.fn();
  getMeta = jest.fn();
  setMeta = jest.fn();
  getDataset = jest.fn();
  isVisible = jest.fn();
  setVisible = jest.fn();
  isPickable = jest.fn();
  setPickable = jest.fn();
  getMinRes = jest.fn();
  setMinRes = jest.fn();
  getMaxRes = jest.fn();
  setMaxRes = jest.fn();
  getDrawOrder = jest.fn();
  setDrawOrder = jest.fn();
  /** Returns true if layer is part of the base map. */
  isBaseLayer = jest.fn();
}

class FeatureLayer extends Layer {
  getDataset = jest.fn();
  setDataset = jest.fn();
  getStyles = jest.fn();
  setStyles = jest.fn();
  remove = jest.fn();
}

class Feature {
  getDataset = jest.fn();
  getAttribute = jest.fn();
  getAttributes = jest.fn();
  setAttribute = jest.fn();
  getCenter = jest.fn();
  getBounds = jest.fn();
  remove = jest.fn();
  getCoordinates = jest.fn();
  setCoordinates = jest.fn();
}

class WebMapInfoLayer extends Layer {
  setVisible = jest.fn();
}

class ImageLayer extends Layer {
  getAlpha = jest.fn();
  setAlpha = jest.fn();
}

class TiledImageLayer extends ImageLayer {
  getDataset = jest.fn();
  remove = jest.fn();
}
class TiledImageDataset extends Dataset {}

class WmsLayer extends ImageLayer {
  getDataset = jest.fn();
  remove = jest.fn();
}
class WmsDataset extends Dataset {}

class StaticImageLayer extends ImageLayer {
  getDataset = jest.fn();
  remove = jest.fn();
}
class StaticImageDataset extends Dataset {}

const webmap = {
  idevio: {
    Connection: {
      delayedInit: [jest.fn()],
      status: 'LOADING',
      version: '',
    } as idevio.Connection,
    map: {
      WebMap,
      FeatureLayer,
      Dataset,
      MemoryDataset,
      LocationDataset,
      Feature,
      PointFeature: jest.fn(),
      Icon: jest.fn(),
      IconFactory,
      Tool: jest.fn(),
      PanTool: jest.fn(),
      ZoomTool: jest.fn(),
      WebMapInfoLayer,
      Layer,
      ImageLayer,
      TiledImageLayer,
      TiledImageDataset,
      StaticImageLayer,
      StaticImageDataset,
      WmsLayer,
      WmsDataset,
    },
  },
};

export default webmap;
