const color = {
  auto: false,
  mode: 'primary',
  paletteColor: {
    index: 7,
    color: 'red',
  },
};

const size: SizeProperties = {
  rangeValues: [8, 22],
  value: 16,
  autoRadiusValueRange: true,
  expression: { key: 'expression-size', type: 'expression-type' },
};

const location = {
  locationOrLatitude: { key: '', label: '', type: '' },
  locationDefault: '',
  locationNamesAuto: false,
  locationType: '',
  locationCountry: { key: '', label: '', type: '' },
  locationAdmin1: { key: '', label: '', type: '' },
  locationAdmin2: { key: '', label: '', type: '' },
};

const cell = {
  qElemNumber: 0,
  qState: 'S',
  qText: 'test-value',
  qAttrExps: {
    qValues: [
      {
        qNum: 10,
      },
    ],
  },
};

const dataPage = {
  qMatrix: [[cell]],
};

const qHyperCube = {
  qDimensionInfo: [
    {
      qFallbackTitle: '',
      qAttrExprInfo: [],
      qAttrDimInfo: [],
    },
    {
      qFallbackTitle: '',
      qAttrExprInfo: [],
      qAttrDimInfo: [],
    },
  ],
  qDataPages: [dataPage],
  qMode: 'S',
  qSize: {
    qcx: 0,
    qcy: 0,
  },
  qMeasureInfo: [],
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

const tms = {
  url: 'www.foo.bar',
  auto: true,
  tileSize: 10,
  tileWidth: 10,
  tileHeight: 20,
  originLeft: 1,
  originTop: 2,
  attribution: '',
};

const image = {
  url: 'www.image.bar',
  minX: 0,
  minY: 0,
  maxX: 5,
  maxY: 5,
  attribution: '',
};

const wms = {
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

const layout = {
  map: {
    ...basicProps,
    gaLayers: [
      {
        cId: 'layer1',
        update: () => {},
        type: 'PointLayer',
        qHyperCube,
        size,
        color,
        ...location,
      },
    ],
    mapSettings: {
      baseMap: 'default',
      projection: 'default',
      mapLanguage: 'auto',
      useImperialUnits: false,
      selectionType: 'lasso',
      showLegend: true,
      showScaleBar: true,
      showDebugInfo: true,
      autoZoomOnSelection: false,
      _layerType: '',
    },
    visualization: 'map',
  },
  layer: {
    base: {
      cId: 'layer-id',
      type: 'Layer',
      qHyperCube,
    },
    point: {
      cId: 'layer-id',
      type: 'PointLayer',
      qHyperCube,
      color,
      size,
      ...location,
    } as PointLayerLayout,
    geodata: {
      cId: 'layer-id',
      type: 'GeodataLayer',
      title: 'title',
      dataType: 'tms',
      options: 1.0,
      tms,
      image,
      wms,
    } as GeodataLayerProperties,
  },
};

export function createDumpAttrExpr(id: string, label: string = '', qFallbackTitle: string = ''): NxAttrExprInfo {
  return {
    id,
    qMin: 0,
    qMax: 10,
    qContinuousAxes: false,
    qIsCyclic: false,
    qIsAutoFormat: false,
    label,
    qFallbackTitle,
  };
}

export function createDumpAttrDim(id: string, qFallbackTitle: string = ''): NxAttrDimInfo {
  return {
    id,
    qCardinal: 0,
    qSize: undefined,
    qFallbackTitle,
    qLocked: false,
    qError: null,
  };
}

export default layout;
