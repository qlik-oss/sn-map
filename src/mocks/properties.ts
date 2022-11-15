const qDimension = {
  qLibraryId: '',
  qDef: {
    qFieldDefs: ['dimension'],
    cId: 'id',
    qSortCriterias: [],
    qLabelExpression: '',
  },
  qAttributeExpressions: [],
  qAttributeDimensions: [],
};

const qHyperCubeDef = {
  qDimensions: [qDimension],
};

const locationProperties = {
  locationOrLatitude: { key: '', label: '', type: '' },
  locationDefault: '',
  locationNamesAuto: true,
  locationType: '',
  locationCountry: { key: '', label: '', type: '' },
  locationAdmin1: { key: '', label: '', type: '' },
  locationAdmin2: { key: '', label: '', type: '' },
  longitude: { key: '', label: '', type: '' },
  isLatLong: false,
};

const colorProperties = {
  color: { auto: false },
};

const sizeProperties = {
  size: { shape: 'point' },
};

const tmsProperties = {
  url: 'wwww.foo.bar',
  auto: true,
  tileSize: 10,
  tileWidth: 10,
  tileHeight: 20,
  originLeft: 1,
  originTop: 2,
};

const imageProperties = {
  url: 'www.image.bar',
  minX: 0,
  minY: 0,
  maxX: 5,
  maxY: 5,
  attribution: '',
};

const wmsProperties = {
  url: 'www.wms.bar',
  attribution: '',
  version: '1.1.0',
  selectedCrs: 'EPSG:3857',
  selectedFormat: 'PNG',
  hasWmsLoaded: false,
  capabilities: {
    layers: [],
    transparent: true,
    crs: ['EPSG:3857'],
    formats: ['PNG'],
  },
};

const basicProps = {
  qInfo: {
    qId: 'mapId',
    qType: 'map',
  },
  footnote: 'footnote',
  showDetails: false,
  showTitles: false,
  title: 'title',
  subtitle: 'subTitle',
  qSelectionInfo: {},
};

const properties = {
  map: {
    ...basicProps,
    gaLayers: [],
    mapSettings: {
      baseMap: 'default',
      projection: 'default',
      mapLanguage: 'auto',
      useImperialUnits: false,
      showLegend: true,
      showScaleBar: true,
      showDebugInfo: true,
      autoZoomOnSelection: true,
      _layerType: '',
    },
    visualization: 'map',
  },
  layer: {
    point: {
      cId: 'layer-id',
      type: 'PointLayer',
      qHyperCubeDef,
      ...locationProperties,
      ...colorProperties,
      ...sizeProperties,
    },
    geodata: {
      cId: 'layer-id',
      type: 'GeodataLayer',
      title: '',
      dataType: 'tms',
      tms: tmsProperties,
      image: imageProperties,
      wms: wmsProperties,
    },
  },
};

export default properties;
