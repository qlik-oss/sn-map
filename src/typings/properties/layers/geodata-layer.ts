declare interface GeodataLayerProperties {
  /** Type of layer properties are for. */
  type: 'GeodataLayer';
  /** Unique layer id */
  cId: string;
  /** Title to use as name of layer. */
  title: string;
  /** Type of data source. */
  dataType: string;
  /** Layer opacity */
  opacity?: number;
  /** Tiled map server definition. */
  tms: TMSProperties;
  wms: WMSProperties;
  image: ImageProperties;
}

declare interface FormatBase {
  /** URL to use as source. */
  url: string;
  /** Attribution to be presented at the bottom of the map. May contain anchor html tags for links. */
  attribution: string;
}

declare interface TMSProperties extends FormatBase {
  /** Advanced options auto or custom */
  auto: boolean;
  /** Tile size in pixels */
  tileSize: number;
  /** Width in geographic units of tiles */
  tileWidth: number;
  /** Height in geographic units of tiles */
  tileHeight: number;
  /** The origin of tiles in left-right-direction in same length unit as for Tile Height */
  originLeft: number;
  /** The origin of tiles in up-down-direction */
  originTop: number;
  /** Signature key */
  [key: string]: any;
}

declare interface ImageProperties extends FormatBase {
  /** Min X of rectangle */
  minX: number;
  /** Min Y of rectangle */
  minY: number;
  /** Max X of rectangle */
  maxX: number;
  /** Max Y of rectangle */
  maxY: number;
  /** Signature key */
  [key: string]: any;
}

declare interface WMSProperties extends FormatBase {
  /** Which version of the WMS protocol to use.  */
  version?: string;
  /** The coordinate reference system to use. */
  selectedCrs: string;
  /** Which image format to use for the generated map images. */
  selectedFormat: string;
  /** Boolean if the WMS capabilities have been loaded and should be used */
  hasWmsLoaded?: boolean;
  /** The WMS capabilities acquired when loading the WMS URL. */
  capabilities: {
    /** A list of map layers that the WMS server supports. */
    layers: WMSLayer[];
    /** Option to set the transparency if the WMS supports it. */
    transparent?: boolean;
    /** An array of available CRS the WMS server supports */
    crs?: string[];
    /** An array of the image formats the WMS server supports */
    formats?: string[];
  };
  /** Signature key */
  [key: string]: any;
}

declare interface WMSLayer {
  /** Layer name used when building up the URL syntax. */
  name: string;
  /** Layer title */
  title: string;
  /** Boolean if the layer should be displayed */
  selected?: boolean;
}
