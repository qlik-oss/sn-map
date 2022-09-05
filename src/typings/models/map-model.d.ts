declare interface MapModelInterFace {
  id: string;
  settings: MapSettings;
  map: idevio.map.WebMap;
  toolsModel: ToolsModel;
  baseMapModel: BaseMapModelInterface;
  attributionModel: AttributionModel;
  layers: LayersHandler;

  update(layout: MapLayout): void;
  present(): Promise;
  destroy(): void;
}
