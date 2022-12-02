declare interface MapSettings {
  /** Internal name of base map. */
  baseMap: string;
  /** Language for labels on base map. */
  mapLanguage?: string;
  /** Name of baseMap and projection to use. A base map can be available in multiple projections, this field contains the internal name it is available under. */
  projection: string;
  /** Show debug information like resolution, scale and center coordinate on top of the map. */
  showDebugInfo?: boolean;
  /** Show scale bar on top of map. */
  showScaleBar?: boolean;
  /** Use feet, yard, mile instead of meter, kilometer. */
  useImperialUnits?: boolean;
  /** Default selection tool used while shift key is pressed. */
  selectionType?: boolean;
  /** Trigger autoZoom when layers are modified */
  autoZoomOnSelection?: boolean;
  /** For communicating info in Property Panel at layer creation. */
  _layerType: string;
}
