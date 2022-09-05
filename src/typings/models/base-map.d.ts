declare interface BaseMapModelInterface {
  map: idevio.map.WebMap;
  availableMaps: string[];
  crs: string;
  update(mapSettings: MapSettings): void;
  updateBaseMap(baseMap: string);
  updateCrs(baseMap: string);
  setStyle(baseMap: string);
  getBaseMapOrEmpty(baseMap: string): string;
  getAvailableMaps(): string[];
}
declare interface BaseMapPropertiesModelInterface {
  availableMaps: string[];
  translator: TranslatorType;
  getBasemaps(current?: string): Map<string, BaseMapInfo>;
  parseMapName(baseMapName: string): ParsedMapInfo;
  getDefaultProjection(baseMapLabel: string, current: string): string;
  getAvailableBaseMapAndProjections(layout?: MapLayout);
  getAvailableMaps(): string[];
}

declare interface BaseMapInfo {
  name: string;
  projections: Map<string, string>;
}

declare interface ParsedMapInfo {
  name: string;
  projection: string;
}
