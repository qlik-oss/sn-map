declare interface MapProperties extends BasicProperties {
  gaLayers: (PointLayerProperties | UnknownLayerProperties)[];
  mapSettings: MapSettings;
  visualization: string;
}

declare interface MapLayout extends BasicProperties {
  gaLayers: (PointLayerLayout | UnknownLayerProperties)[];
  mapSettings: MapSettings;
  visualization: string;
}
