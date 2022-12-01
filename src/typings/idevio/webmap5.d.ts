/** Coordinate represented as an array with latitude and longitude. */
type Coordinate = [number, number];

/** A geographic rectangle */
type Rectangle = {
  /** Min corner coordinate */
  min: Coordinate;
  /** Max corner coordinate */
  max: Coordinate;
};

declare namespace idevio {
  interface Connection {
    /** The URL to the server's WebMap5 module. */
    baseUrl: string;
    /** Array of functions for WebMap5 to run after script init. */
    delayedInit: Function[any];
    status: string;
    version: string;
  }
  const Connection: Connection;
  namespace map {
    interface DebugOptions {
      logLevel?: string;
    }

    interface WebMapOptions {
      baseMap?: string;
      /** Sets a custom url to a RaveGeo Server for the map to use. */
      baseUrl?: string;
      center?: Coordinate;
      customAttribution?: string;
      /** Id of div or actual div element in which the map should be placed. */
      div: string | HTMLElement | Element;
      debug?: DebugOptions;
      gl?: boolean;
      /** The color to use for marking highlighted features. */
      highlight?: string;
      listeners?: [EventType, (event: Event) => void][];
      /** Max allowed zoom level */
      maxLevel?: number;
      maxResolution?: number;
      /** Min allowed zoom level */
      minLevel?: number;
      minResolution?: number;
      resolution?: number;
      scale?: number;
      style?: MapStyle;
      tools?: Tool[];
      viewBounds?: Rectangle;
      zoomLevel?: number;
    }

    class WebMap {
      constructor(options: WebMapOptions);

      getBaseMap(): string;
      setBaseMap(map: string, errorCallback?: (event: Event) => void): void;

      getCenter(): Coordinate;
      setCenter(coord: Coordinate): void;

      getAttribution(): string;
      setAttribution(attribution: string | null): void;

      getHighlighted(): Feature[];
      setHighlighted(features: Feature[]): void;

      getResolution(): number;
      setResolution(resolution: number): void;

      getScale(): number;
      setScale(scale: number): void;

      getDiv(): HTMLElement;

      /** Returns the zoom level closest to the current resolution. */
      getNearestZoomLevel(): number;

      getLayerCount(): number;
      getLayer(name: string | number): Layer;
      getLayers(): Layer[];

      setZoomLevel(zoomLevel: number): void;
      getZoomLevelResolution(level: number): number;
      /** Sets min level (0-20) */
      setMinLevel(level: number): void;
      /** Sets max level (0-20) */
      setMaxLevel(level: number): void;
      getMinLevel(): number;
      getMaxLevel(): number;
      setMinResolution(resolution: number): void;
      setMaxResolution(resolution: number): void;
      getMinResolution(): number;
      getMaxResolution(): number;
      /**
       * Gets the longitude for where the map wraps (i.e. the date line).
       * Returns NaN if the map does not wrap.
       */
      getWrapLongitude(): number;

      /**
       * Adds a listener to the specified type of event.
       * Returns an id that can be used to remove the listener.
       */
      addListener<T extends Event>(type: EventType, listener: (event: T) => void): string;
      removeListener(id: string): void;

      /**
       * If true all draws will be done with the interacting flag, which means the map engine will optimize map
       * drawing somewhat (e.g. not calculating label positions).
       * Useful when the user interacts with the map, like zooming or panning.
       * NOTE: Remember to restore it to false when not needed to resume normal drawing.
       */
      setInteracting(interacting: boolean): void;

      geoToDisplay(point: Coordinate): ScreenCoordinate;
      displayToGeo(point: ScreenCoordinate): Coordinate;

      getGeoBounds(): Rectangle;
      viewGeoBounds(bounds: Rectangle, noAnimation?: boolean): void;
      /** Gets the current view bounds */
      getViewBounds(): Rectangle | null;
      /** Sets map view bounds. If null or if it covers more than the whole world on a wrapping map the bounds are removed. */
      setViewBounds(bounds: Rectangle | null | undefined): void;

      setStyle(style?: MapStyle): void;

      zoom(factor: number): void;
      zoomTo(resolution: number): void;

      zoomInOneLevel(): void;
      zoomOutOneLevel(): void;

      pan(dx: number, dy: number): void;
      moveTo(coord: Coordinate, resolution: number): void;
      setPixelDensity(ppi: number): void;

      getFeatureAt(x: number, y: number): Feature;
      getFeaturesAt(x: number, y: number): Feature[];
      getFeaturesWithin(xmin: number, ymin: number, xmax: number, ymax: number): Feature[];

      getDistanceInMeters(point1: ScreenCoordinate, point2: ScreenCoordinate): number;

      /**
       * Forces a repaint of the map canvas.
       * It will also resize the canvas to fill its container if it detects that it has been resized.
       */
      repaint(): void;

      destroy(): void;
      /** Goes through the scene graph and prints debug info for each node. */
      printTree(detailed?: boolean): void;

      static getLoadedBaseMaps(): string[];
      static getAvailableBaseMaps(
        callback: (maps: string[]) => void,
        errorCallback?: (event: ErrorEvent) => void
      ): void;

      destroy(): void;
    }

    interface LayerOptions {
      name?: string;
      /** Object that can be used for storing miscellaneous information in the layer */
      meta?: object;
      /** The dataset that the layer reads the features from. If not specified as a parameter during construction an empty dataset is automatically created. */
      dataset?: Dataset | Partial<DatasetOptions>;
      visible?: boolean;
      /**
       * Set to true for layers that should be possible to pick objects from.
       *
       * Default: false
       */
      pickable?: boolean;
      /**
       * The layer will not be visible when zoomed in more than this (m).
       *
       * Default: 0
       */
      minRes?: number;
      /**
       * The layer will not be visible when zoomed out more than this (m).
       *
       * Default: 99999999
       */
      maxRes?: number;
      /**
       * Decides the draw order of layers, layers with lower numbers get drawn before layers with higher ones.
       * Base map layers use negative values.
       * A draw order of 10000 is used for some special layers (like the foreground label layer) to ensure that they stay on top.
       * If no number is specified it will automatically get one that is 1 higher than the highest (starting at 0, ignoring 10000
       * as it is used as a special value), so that it will be drawn last.
       */
      drawOrder?: number;
    }

    class Layer {
      getName(): string;
      setName(name: string): void;
      getMeta(): object;
      setMeta(meta: object): void;
      getDataset(): Dataset;
      isVisible(): boolean;
      setVisible(visible: boolean): void;
      isPickable(): void;
      setPickable(pickable: boolean): void;
      getMinRes(): number;
      setMinRes(resolution: number): void;
      getMaxRes(): number;
      setMaxRes(resolution: number): void;
      getDrawOrder(): number;
      setDrawOrder(drawOrder: number): void;
      /** Returns true if layer is part of the base map. */
      isBaseLayer(): boolean;
    }

    class ImageLayer extends Layer {
      /** Get layer alpha. Since 6.17.0. */
      getAlpha(): number;
      /** Set layer alpha. Since 6.17.0. */
      setAlpha(alpha: number): void;
    }

    interface WebMapInfoLayerOptions extends LayerOptions {
      /** Where on screen the information should be displayed (x) */
      x: number;
      /** Where on screen the information should be displayed (y) */
      y: number;
      /** Align displayed values horizontally. Default: false */
      align?: boolean;
      /** Text color. Default: 'red' */
      color?: string;
      /** Text font */
      font?: string;
      /** Show current resolution. Default: true */
      resolution?: boolean;
      /** Show current level. Default: true */
      level?: boolean;
      /** Show current center coordinate. Default: true */
      center?: boolean;
      /** Show if in interaction mode. Default: true */
      interacting?: boolean;
      /** Show if the map is loading data. Default: true */
      loading?: boolean;
      /** Show geo ratio (only useful for adaptive maps). Default: true */
      ratio?: boolean;
    }

    class WebMapInfoLayer extends Layer {
      constructor(map: WebMap, options: WebMapInfoLayerOptions);
    }

    class FeatureLayer extends Layer {
      constructor(map: WebMap, options?: FeatureLayerOptions);
      getDataset(): MemoryDataset;
      setDataset(dataset: MemoryDataset): void;
      getStyles(): Readonly<LayerStyle[]>;
      setStyles(styles: LayerStyle[]): void;
      /** Removes the layer from the map. */
      remove(): void;
    }

    class Dataset {
      getCrs(): string;
      getName(): string;
      /** Adds an EventListener to the specified type of event. Returns an id that can be used to remove the listener. */
      addListener(type: DsEventType, listener: (event: DsEvent) => void): string;
      removeListener(id: string): void;
      /** Returns all features in the dataset. Returns null if not applicable for that dataset class (dataset for raster tiles, background labels, etc.). */
      getAll(): Feature[] | null;
      /**
       * Returns all features within the specified rectangle.
       * Returns null if not applicable for that dataset class (dataset for raster tiles, background labels, etc.).
       */
      getInRect(bounds: Rectangle): Feature[] | null;
      /**
       * Returns the bounds of the dataset.
       * MemoryDataset and its subclasses return a rectangle containing all of its features' bounds, unless empty when it
       * returns a rectangle with all values set to 0. Datasets containing raster tiles return a rectangle with bounds set
       * to +/- 2147483647 (Java Integer.MAX_VALUE).
       */
      getBounds(): Rectangle;
      /**
       * Returns the bounds of the dataset which might in some cases be a rectangle on the "backside" if the earth.
       * If there is one feature at [0, -170] and one at [0, 170] then getBounds returns a rectangle [[0, -170], [0, 170]] but
       * getAlternateBounds can return a rectangle [[0, 170], [0, 190]].
       * The upper longitude is allowed to be up to 270.
       * Currently only MemoryDataset and its subclasses potentially return a rectangle crossing +-180.
       */
      getAlternateBounds(): Rectangle;
      /** Removes all features. Only allowed for some datasets. */
      removeAll(): void;
    }

    class MemoryDataset extends Dataset {
      constructor(options?: DatasetOptions);

      load(url: string, options?: FeatureLoadOptions): void;
      save(options?: FeatureSaveOptions): any;
      getAll(): Feature[];
      getInRect(bounds: Rectangle): Feature[];
      remove(feature: Feature): void;
      /** Sorts the features in the dataset according to the specified sort function. */
      sort(sortFunc: (a: Feature, b: Feature) => number): void;

      static installFormat(formatName: string, options: FormatOptions): void;
    }
    /**
     * A dataset that you add objects to that have no coordinates but a location id.
     * The LocationDataset is connected to a service where the coordinates are looked up.
     * There are different kinds of services, from a simple geodata file to server based geometry services.
     * They have slightly different features described in options.
     * A LocationDataset is created with the static create method.
     */
    class LocationDataset extends MemoryDataset {
      /**
       * Factory method for creating Location Datasets.
       * @param service URL to load geometry data from. If it starts with 'i:///' it is directed to the base URL of the webmap service.
       * @param type The type of service to connect to. The type of service decides which options are supported.
       * @param options Optional parameters that may be different for different services.
       */
      static create(service: string, type: 'SERVICE', options: FileLocationDatasetOptions): FileLocationDataset;
      /**
       * Factory method for creating Location Datasets.
       * @param service URL to load geometry data from. If it starts with 'i:///' it is directed to the base URL of the webmap service.
       * @param type The type of service to connect to. The type of service decides which options are supported.
       * @param options Optional parameters that may be different for different services.
       */
      static create(
        service: string,
        type: string,
        options: RemoteServiceLocationDatasetOptions
      ): RemoteServiceLocationDataset;

      setData(table: any[][]): void;
      addData(table: any[][]): void;
    }

    class Feature {
      getAttribute<T = any>(name: string): T;
      setAttribute<T = any>(name: string, value: T): void;
      getAttributes(): { [key: string]: any };
      getCenter(): Coordinate;
      getBounds(): Rectangle;
      getDataset(): Dataset;
      /** Removes the feature from its dataset. The feature can not be used after this. */
      remove(): void;
      /**
       * Returns the coordinate(s) of the feature.
       * A PointFeature returns a single coordinate, a LineStringFeature an array of coordinates, and a PolygonFeature an array of arrays of coordinates.
       */
      getCoordinates(): Coordinate | Coordinate[] | Coordinate[][];
      /** Sets the coordinates for the feature. The argument type depends on what kind of featue it is, see getCoordinates. */
      setCoordinates(coordinates: Coordinate | Coordinate[] | Coordinate[][]): void;
    }

    class PointFeature extends Feature {
      constructor(dataset: Dataset, options: PointFeatureOptions);
      getCoordinate(): Coordinate;
      setCoordinate(coordinate: Coordinate): void;

      getCoordinates(): Coordinate;
      setCoordinates(coordinate: Coordinate): void;
    }
    interface LineStringFeatureOptions extends FeatureOptions {
      coordinates: any; // Coordinates or arc
    }
    class LineStringFeature extends Feature {
      constructor(dataset: Dataset, options: LineStringFeatureOptions);
      getCoordinates(): Coordinate[];
      setCoordinates(coordinate: Coordinate[]): void;
    }
    interface PolygonFeatureOptions extends FeatureOptions {
      /**
       * A sequence of sequences of points that defines the rings that make up the geometry of the polygon.
       * Can also be supplied as only a sequence of points if the polygon only consists of one ring.
       * Note however that getCoordinates will always return an array of the polygon's all rings.
       */
      coordinates: Coordinate[] | Coordinate[][];
    }
    class PolygonFeature extends Feature {
      constructor(dataset: Dataset, options: PolygonFeatureOptions);
      getCoordinates(): Coordinate[][];
      setCoordinates(coordinate: Coordinate[][]): void;
    }

    interface RemoteServiceLocationDatasetOptions extends LocationDatasetOptions {
      /**
       * String that is appended to each location id. A location id may contain type specification and containing areas
       * and if common to all objects it is convenient to specify that here.
       */
      suffix?: string;
    }

    class Icon {
      constructor(style?: IconStyle);
      getUrl(): string;
    }

    interface CrossIconOptions {
      thickness: number;
      radius: number;
      /**
       * Fill color
       *
       * Default: black
       */
      color?: string;
      /** Outline color */
      outline?: string;
      /**
       * Outline width in pixels
       *
       * Default: 1
       */
      outlineWidth?: number;
      /**
       * Icon horizontal alignment
       *
       * Default: middle
       */
      alignX?: 'left' | 'middle' | 'right';
      /**
       * Icon vertical alignment
       *
       * Default: middle
       */
      alignY?: 'top' | 'middle' | 'bottom';
    }

    interface CircleIconOptions {
      radius: number;
      /**
       * Fill color
       *
       * Default: black
       */
      color?: string;
      /** Outline color */
      outline?: string;
      /**
       * Outline width in pixels
       *
       * Default: 1
       */
      outlineWidth?: number;
      /**
       * Icon horizontal alignment
       *
       * Default: middle
       */
      alignX?: 'left' | 'middle' | 'right';
      /**
       * Icon vertical alignment
       *
       * Default: middle
       */
      alignY?: 'top' | 'middle' | 'bottom';
    }

    interface PolygonIconOptions {
      /** Number of sides, can't be lower than three. */
      sides: number;
      radius: number;
      /** Clockwise rotation (degrees) of the polygon compared to its defaults. */
      rotation?: number;
      /**
       * Fill color
       *
       * Default: black
       */
      color?: string;
      /** Outline color */
      outline?: string;
      /**
       * Outline width in pixels
       *
       * Default: 1
       */
      outlineWidth?: number;
      /**
       * Icon horizontal alignment
       *
       * Default: middle
       */
      alignX?: 'left' | 'middle' | 'right';
      /**
       * Icon vertical alignment
       *
       * Default: middle
       */
      alignY?: 'top' | 'middle' | 'bottom';
    }

    class IconFactory {
      static cross(options: CrossIconOptions): Icon;
      static circle(options: CircleIconOptions): Icon;
      static polygon(options: PolygonIconOptions): Icon;
    }

    interface SymbolStyle extends LayerStyle {
      type: 'symbol';
      /**
       * The Icon to display or an to define an icon with.
       *
       * Default:<a small red cirle>
       */
      icon?: Icon | IconStyle;
      /** Defines the name of the attribute to use for attribute dependent icons */
      iconKey?: string;
      /**
       * A mapping from attribute values to icons.
       * The value of the attribute iconKey is used as a key into this object to look up a icon.
       * If no icon is defined for a value then the default icon defined in icon is used.
       */
      icons?: object;
    }

    interface Tool {
      connectTo(map: WebMap): void;
      disconnect(): void;
      getMap(): WebMap;
      isActive(): boolean;
      setActive(active: boolean): void;
    }

    interface ToolOptions {
      active?: boolean;
    }

    abstract class Tool implements Tool {
      constructor(options?: ToolOptions);
      /** Called before the tool is being disconnected from the map */
      protected _disconnecting(): void;
      /** Called after the tool has been connected to the map */
      protected _connecting(): void;
      protected _addListener(type: string, listener: (event: Event) => void): void;
      protected _map: idevio.map.WebMap;
      protected _listeners: string[];
      _active: boolean;
    }

    interface PanToolOptions extends ToolOptions {
      /**
       * Whether kinetic panning should be enabled.
       *
       * Default: true
       */
      kinetic?: boolean;
      /**
       * Mouse button to pan with.
       *
       * Default: 1
       */
      button?: number;
      /**
       * Whether panning should be abled while the Alt button is pressed.
       *
       * Default: false
       */
      allowAlt?: boolean;
      /**
       * Whether panning should be abled while the Ctrl button is pressed.
       *
       * Default: false
       */
      allowCtrl?: boolean;
      /**
       * Whether panning should be abled while the Meta button is pressed.
       *
       * Default: false
       */
      allowMeta?: boolean;
      /**
       * Whether panning should be abled while the Shift button is pressed.
       *
       * Default: false
       */
      allowShift?: boolean;
    }

    class PanTool extends Tool {
      constructor(options?: PanToolOptions);
    }

    class ZoomTool extends Tool {}

    interface EventBase {
      /**
       * The Feature targeted by the event. Is null when not applicable (e.g. ErrorEvent) or no feature is targeted.
       * TODO: check if always feature?
       */
      target: Feature | null;
      /** The object which generated the event, like a WebMap or a Dataset. */
      source: WebMap | Dataset;
      /** Whether the default action has been canceled. */
      defaultPrevented: boolean;
      /** The native event that caused the Event. Is null if the event is WebMap5 generated (e.g. Error, Draw, etc.) */
      nativeEvent: UIEvent | null;

      /** Stops the Event from propagating. For events triggered by DOM events stopPropagation is also run on the original DOM event. */
      stop(): void;
      /** Cancels the default event action for the given event. For events triggered by DOM events preventDefault is also run on the original DOM event. */
      preventDefault(): void;
    }
    interface Event extends EventBase {
      type: EventType;
    }

    interface PositionEvent extends Event {
      type: PositionEventType;
      /** Where on the map the event occurred */
      coordinate: Coordinate;
      /** Where on screen the event occurred */
      clientX: number;
      /** Where on screen the event occurred */
      clientY: number;
      /**
       * The mouse button that caused the event.
       * Can be either 0 (Left), 1 (Middle), 2 (Right), or -1 (not applicable).
       */
      button: 0 | 1 | 2 | -1;
      /** Whether the Alt key was pressed or not */
      altKey: boolean;
      /** Whether the Ctrl key was pressed or not */
      ctrlKey: boolean;
      /** Whether the Meta key was pressed or not */
      metaKey: boolean;
      /** Whether the Shift key was pressed or not */
      shiftKey: boolean;
    }

    interface ImageLayerOptions extends LayerOptions {
      /** Image transparency, 0 <= alpha <= 1. Since 6.17.0. */
      alpha?: number;
    }

    interface PartialTiledImageDatasetOptions extends Partial<TiledImageDatasetOptions> {
      url: string;
    }

    interface TiledImageLayerOptions extends ImageLayerOptions {
      dataset: TiledImageDataset | PartialTiledImageDatasetOptions;
    }

    class TiledImageLayer extends ImageLayer {
      constructor(map: WebMap, options: TiledImageLayerOptions);
      getDataset(): TiledImageDataset;
      /** Removes the layer from the map. */
      remove(): void;
    }

    interface WmsLayerOptions extends ImageLayerOptions {
      dataset: WmsDataset;
      /**
       * Size of image padding in pixels.
       *
       * Default: 30
       */
      buffer?: number;
    }
    class WmsLayer extends ImageLayer {
      constructor(map: WebMap, options: WmsLayerOptions);
      /** Removes the layer from the map. */
      remove(): void;
      getDataset(): WmsDataset;
    }

    interface DatasetOptions {
      name?: string;
      /**
       * The EPSG code for the coordinate system used for coordinates in the features belonging to the dataset.
       * Normally this is WGS 84 which has the code "EPSG:4326". These are normal latitude, longitude coordinates.
       * In the standard service the allowed values are "EPSG:4326" (WGS 84) and "EPSG:3857" (Mercator).
       * In other services other values might be allowed.
       */
      crs?: string;
      listeners?: [DsEventType, (event: DsEvent) => void][];
    }

    interface TiledImageDatasetOptions extends DatasetOptions {
      /** Base URL to load the tiles from. */
      url: string;
      /**
       * X-coordinate of origo of where to start numbering tiles.
       * Tiles west of this point will have a negative number.
       */
      originX: number;
      /**
       * Y-coordinate of origo of where to start numbering tiles.
       * Tiles south of this point will have a negative number.
       */
      originY: number;
      /**
       * Width of tiles at map level 0 (the whole world in one tile) in geographical units.
       */
      tileWidth: number;
      /**
       * Height of tiles at map level 0 (the whole world in one tile) in geographical units.
       */
      tileHeight: number;
      /**
       * Size of tile in pixels.
       *
       * Default: 256
       */
      tileSizePixels?: number;
      /**
       * Until which level the tiles are visible.
       *
       * Default: 20
       */
      levels?: number;
      /**
       * Custom image to show where no tiles are available (i.e. when urlFunction returns null).
       */
      noTileImage?: HTMLImageElement;
      /**
       * Custom image to show where a tile has failed to load.
       */
      failedTileImage?: HTMLImageElement;
      /**
       * Callback function that should return the URL to load a tile from, or null if no tile should be loaded.
       */
      urlFunction?: (baseUrl: string, tx: number, ty: number, level: number) => string | null;
      /**
       * Sets the crossorigin attribute on the requested images.
       * [More information](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-crossorigin).
       */
      crossOrigin?: string | null;

      /** The coordinate reference system that the image should be defined in. */
      crs?: string;
    }

    class TiledImageDataset extends Dataset {
      constructor(options: TiledImageDatasetOptions);
    }

    interface WmsDatasetOptions extends DatasetOptions {
      /**
       * URL to load the WMS images from.
       * Should be stripped of VERSION, BBOX, WIDTH, HEIGHT, SRS and CRS parameters as they will be added by the dataset when the request is performed.
       */
      url: string;
      /**
       * WMS version.
       *
       * Default: 1.3.0
       */
      version?: string;
      /**
       * A function that is called with an ErrorEvent (with the dataset as its source) when a WMS image has failed to load.
       */
      onerror?: (event: ErrorEvent) => void;
      /**
       * Load the images with the server as a proxy, which also sets the headers needed for CORS.
       *
       * Default: false
       */
      viaServer?: boolean;
      /**
       * Sets the crossorigin attribute on the requested images.
       * [More information](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-crossorigin).
       */
      crossOrigin?: string | null;
    }
    /**
     * A dataset that stores WMS images retreived from a URL.
     * Note: **The CRS parameter will be set to the same as the dataset has. See Dataset property list.**
     */
    class WmsDataset extends Dataset {
      constructor(options: WmsDatasetOptions);
    }

    class StaticImageLayer extends ImageLayer {
      constructor(map: WebMap, options: StaticImageLayerOptions);
      /** Removes the layer from the map. */
      remove(): void;
      getDataset(): StaticImageDataset;
    }
    interface StaticImageLayerOptions extends ImageLayerOptions {
      dataset: StaticImageDataset;
      /**
       * Size of image padding in pixels.
       *
       * Default: 30
       */
      buffer?: number;
    }

    interface StaticImageDatasetOptions extends DatasetOptions {
      /**
       * URL to load the WMS images from.
       * Should be stripped of VERSION, BBOX, WIDTH, HEIGHT, SRS and CRS parameters as they will be added by the dataset when the request is performed.
       */
      url: string;
      /**
       * A function that is called with an ErrorEvent (with the dataset as its source) when a WMS image has failed to load.
       */
      onerror?: (event: ErrorEvent) => void;
      /**
       * A rectangle specifying the position of the image.
       */
      bounds: Rectangle;
      /**
       * Load the images with the server as a proxy, which also sets the headers needed for CORS.
       *
       * Default: false
       */
      viaServer?: boolean;
      /**
       * Sets the crossorigin attribute on the requested images.
       * [More information](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-crossorigin).
       */
      crossOrigin?: string | null;
    }
    /**
     * A dataset that stores WMS images retreived from a URL.
     * Note: **The CRS parameter will be set to the same as the dataset has. See Dataset property list.**
     */
    class StaticImageDataset extends Dataset {
      constructor(options: StaticImageDatasetOptions);
    }
  }
}
