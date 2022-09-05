declare interface LayerPropertiesBase extends LocationProperties {
  /** Type of layer properties are for. */
  type: string;
  /** Unique layer id */
  cId: string;
}

declare interface LayerProperties extends LayerPropertiesBase {
  /** Engine HyperCubeDef */
  qHyperCubeDef: NxHyperCubeDef;
  [key: string]: any;
}

declare interface LayerLayout extends LayerPropertiesBase {
  /** Engine HyperCube */
  qHyperCube: NxHyperCube;
}

declare interface UnknownLayerProperties extends LayerProperties {}

declare type GaLayersLayout = PointLayerLayout | GeodataLayerProperties | UnknownLayerProperties;

/** Layer type name. */
declare type LayerTypeName = 'PointLayer' | 'GeodataLayer';
