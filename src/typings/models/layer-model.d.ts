declare interface LayerModelInterFace {
  mapModel: MapModelInterFace;
  index: number;
  setIndex(index: number): void;
  update(layout: GaLayersLayout);
}

declare interface UnknownLayerModelInterface extends LayerModelInterFace {
  id: string;
  layer: idevio.map.Layer;
  update();
  remove(): void;
}

declare interface PointLayerModelInterface extends LayerModelInterFace {
  id: string;
  layer: idevio.map.FeatureLayer;
  datasetModel: DatasetModel;
  symbolModel: SymbolModel;
  update(layout: PointLayerLayout);
  setStyles(): void;
  remove(): void;
}

declare interface GeodataLayerModelInterface extends LayerModelInterFace {
  id: string;
  layer: idevio.map.TiledImageLayer;
  update(layout: GeodataLayerProperties);
  remove(): void;
}

declare type GaLayersModelInterface =
  | PointLayerModelInterface
  | GeodataLayerModelInterface
  | UnknownLayerModelInterface;
