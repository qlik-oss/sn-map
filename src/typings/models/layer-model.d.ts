import LocationType from '../../utils/const/location-type';

declare interface LayerModelInterFace {
  mapModel: MapModelInterFace;
  index: number;
  setIndex(index: number): void;
}

declare interface CommonLayerModelInterface extends LayerModelInterFace {
  id: string;
  layer: idevio.map.FeatureLayer;
  datasetModel: DatasetModel;
  collectData(layoutService: LayoutService);
  extractData(row: NxCell[], layoutService: LayoutService, locationType: LocationType);
  setStyles(): void;
  remove(): void;
}

declare interface UnknownLayerModelInterface extends LayerModelInterFace {
  id: string;
  layer: idevio.map.Layer;
  update();
  remove(): void;
}

declare interface PointLayerModelInterface extends CommonLayerModelInterface {
  styleModel: StyleModel;
  update(layout: PointLayerLayout);
}

declare interface AreaLayerModelInterface extends CommonLayerModelInterface {
  styleModel: StyleModel;
  update(layout: AreaLayerLayout);
}

declare interface GeodataLayerModelInterface extends LayerModelInterFace {
  id: string;
  layer: idevio.map.TiledImageLayer;
  update(layout: GeodataLayerProperties);
  remove(): void;
}

declare type GaLayersModelInterface =
  | AreaLayerModelInterface
  | PointLayerModelInterface
  | GeodataLayerModelInterface
  | UnknownLayerModelInterface;
