/**
 * @namespace properties
 * @entry
 */
const objectDefinition = () => {
  /**
   * @lends properties
   */
  const definition = {
    /**
     * Current version of this generic object definition
     * @type {string}
     * @default
     */
    version: process.env.PACKAGE_VERSION,
    /**
     * Map layers
     * @type {gaLayers[]}
     */
    gaLayers: [],
    /**
     * Map settings
     * @type {object}
     */
    mapSettings: {
      /**
       * Set to true if you want to show the scalebar on the map.
       * @type {boolean=}
       * @default
       */
      showScaleBar: false,
      /**
       * Set to true if you want to show debug information on the map.
       * @type {boolean=}
       * @default
       */
      showDebugInfo: false,
      /**
       * Set to true if you want the scale bar to use the imperial metric system.
       * Only applicable if `'showScaleBar': true`.
       * @type {boolean=}
       * @default
       */
      useImperialUnits: false,
      /**
       * Set the base map provided by the map server.
       * Base map options are provided bt the map server. It will default to an empty base map if no server is provided by the nebula configuration.
       * @type {string=}
       * @default
       */
      baseMap: 'default',
      /**
       * Sets the basemap coordinate reference system.
       * Projection options are provided by the maps server.
       * @type {string=}
       * @default
       */
      projection: 'default',
      /**
       * Sets the basemap language. Will default to showing local languages if other options than `'auto'` or `'english'` are provided.
       * @type {('auto'|'english')=}
       * @default
       */
      mapLanguage: 'auto',
      /**
       * Set to true if you want to auto zoom when making selections.
       * @type {boolean=}
       * @default
       */
      autoZoomOnSelection: true,
    },
    /**
     * Show title for the visualization.
     * @type {boolean=}
     * @default
     */
    showTitles: true,
    /**
     * Visualization subtitle.
     * @type {(string|StringExpression)=}
     * @default
     */
    subtitle: '',
    /**
     * Visualization title.
     * @type {(string|StringExpression)=}
     * @default
     */
    title: '',
  };

  return definition;
};

export default objectDefinition;

/**
 * Map layers
 * @typedef {AreaLayer|PointLayer|GeodataLayer} gaLayers
 */

/**
 * AreaLayer presents areas on a map, such as countries or states with polygons. In the hyperCube you can set qAttributeExpressions and qAttributeDimensions with a corresponding id to add expressions to the layer.
 * @typedef {object} AreaLayer
 * @property {'AreaLayer'} type Defines the layer type
 * @property {string} cId ID that must be unique within the current chart.
 * @property {qHyperCubeDef} qHyperCubeDef
 * @property {color} color Set to use automatic coloring.
 * @property {string=} locationType Type that restricts names in locationOrLatitude to a certain type, coded in internal coding used by the location service.
 */

/**
 * PointLayer overlays individual locations on a map, representing them with shapes. In the hyperCube you can set qAttributeExpressions and qAttributeDimensions with a corresponding id to add expressions to the layer.
 * @typedef {object} PointLayer
 * @property {'PointLayer'} type Defines the layer type
 * @property {string} cId ID that must be unique within the current chart.
 * @property {qHyperCubeDef} qHyperCubeDef
 * @property {size} size Set to define the size of the shape.
 * @property {color} color Set to use automatic coloring.
 * @property {string=} locationType Type that restricts names in locationOrLatitude to a certain type, coded in internal coding used by the location service.
 * @property {boolean=} isLatLong If true, the location is specified as latitude and longitude fields in locationOrLatitude and longitude. Otherwise the location is a geometry or name in locationOrLatitude.
 */

/**
 * GeodataLayer layers enable you to display a custom base map for your map visualization.
 * @typedef {object} GeodataLayer
 * @property {'GeodataLayer'} type Defined the layer type
 * @property {string} cId ID that must be unique within the current chart.
 * @property {'tms'|'wms'|'image'} dataType Type of data source.
 * @property {tms} tms
 * @property {wms} wms
 * @property {image} image
 */

/**
 * Extends `HyperCubeDef`, see Engine API: `HyperCubeDef`.
 * @typedef {object} qHyperCubeDef
 * @property {DimensionProperties[]} qDimensions
 * @property {boolean} qSuppressMissing=true
 */

/**
 * Extends `NxDimension`, see Engine API: `NxDimension`.
 * @typedef {object} DimensionProperties
 * @extends NxDimension
 * @property {AttributeExpressionProperties[]} qAttributeExpressions
 * @property {AttributeDimensionProperties[]} qAttributeDimensions
 * @property {InlineDimensionDef} qDef
 */

/**
 * Extends `NxInlineDimensionDef`, see Engine API: `NxInlineDimensionDef`.
 * @typedef {object} InlineDimensionDef
 * @extends NxInlineDimensionDef
 * @property {boolean=} autoSort Set to automatically sort the dimension.
 * @property {string=} cId ID used by the Qlik Sense. Must be unique within the current chart.
 * @property {string|StringExpression} othersLabel
 */

/**
 * Use qAttributeExpressions and the id property to add expressions to the layer. Regular fields and library measures can be used. You can set the following expressions.
 * locationOrLatitude - This can be either a latitude (if isLatLong is true), a geometry or a name of a geographic feature.
 * longitude (PointLater) - Longitude field used if isLatLong is true.
 * locationCountry - Country that restricts names in locationOrLatitude to the country that the expression evaluates to. Country names, ISO alpha 2 or 3 codes are allowed.
 * locationAdmin1 - Area name or code that restricts names in locationOrLatitude to the first order administrative division that the expression evaluates to. Only used if locationCountry is specified.
 * locationAdmin2 - Area name or code that restricts names in locationOrLatitude to the second order administrative division that the expression evaluates to. Only used if locationAdmin1 is specified.
 * size (PointLayer) - Set to define the size of the shape.
 * Extends `NxAttrExprDef`, see Engine API: `NxAttrExprDef`.
 * @typedef {object} AttributeExpressionProperties
 * @extends NxAttrExprDef
 * @property {string} id Can be locationOrLatitude, longitude, locationCountry, locationAdmin1, locationAdmin2 or size.
 */

/**
 * Use qAttributeDimensions and the id property to add expressions to the layer. Only library dimensions can be used. You can set the following expressions.
 * locationOrLatitude - This can be either a latitude (if isLatLong is true), a geometry or a name of a geographic feature.
 * longitude (PointLater) - Longitude field used if isLatLong is true.
 * locationCountry - Country that restricts names in locationOrLatitude to the country that the expression evaluates to. Country names, ISO alpha 2 or 3 codes are allowed.
 * locationAdmin1 - Area name or code that restricts names in locationOrLatitude to the first order administrative division that the expression evaluates to. Only used if locationCountry is specified.
 * locationAdmin2 - Area name or code that restricts names in locationOrLatitude to the second order administrative division that the expression evaluates to. Only used if locationAdmin1 is specified.
 * Extends `NxAttrDimDef`, see Engine API: `NxAttrDimDef`.
 * @typedef {object} AttributeDimensionProperties
 * @extends NxAttrDimDef
 * @property {string} id Can be locationOrLatitude, longitude, locationCountry, locationAdmin1 or locationAdmin2.
 */

/**
 * @typedef {object} ExpressionProperty
 * @property {string} label Label for the expression
 * @property {string} key Expression or library id
 * @property {'expression'|'libraryItem'} type How to interpret the key
 */

/**
 * Set to define the size of the shapes.
 * @typedef {object} size
 * @property {array=} rangeValues Sets the minimum and maximun radius of the symbol when size expression is set.
 * @property {number=} value Sets the radius of the symbol when size expression is not set. The value of the size is not mandatory as the fields that described the size with an expression exists
 * @property {ExpressionProperty=} expression Sets the measure used to calculate the size of the symbol.
 * @property {boolean=} autoRadiusValueRange Reveals radiusValueMin and radiusValueMax that are used to define the min and max values of the symbol.
 * @property {number=} customMinRangeValue Defines the min value of the symbol.
 * @property {number=} customMaxRangeValue Defines the max value of the symbol.
 */

/**
 * Set to define the coloring of the shapes.
 * @typedef {object} color
 * @property {'primary'} mode Sets the coloring mode for the visualization when auto-coloring has been switched off (`"auto": false`).
 * @property {paletteColor} paletteColor The paletteColor object is used to define the color when you color by single color `("mode": "primary")`.
 */

/**
 * Color information structure. Holds the actual color and index in palette.
 * @typedef {object} paletteColor
 * @property {string} color - Color as hex string
 */

/**
 * @typedef {object} tms Settings to render a background layer from a Tile Map Service.
 * @property {string|StringExpression} url URL to use as source. ${X}, ${Y}, ${Z} can be used as variables. The URL is an expression that is evaluated when the selection changes.
 * @property {string} attribution Attribution to be presented at the bottom of the map. May contain anchor html tags for links.
 * @property {number} tileSize Tile size in pixels.
 * @property {number} tileWidth Width in geographic units of tiles.
 * @property {number} tileHeight Height in geographic units of tiles
 * @property {number} originLeft The origin of tiles in left-right-direction in same length unit as for Tile Height.
 * @property {number} originTop The origin of tiles in up-down-direction.
 */

/**
 * @typedef {object} wms Settings to render a background layer from a Web Map Service.
 * @property {string} url URL for a wms server to use as source.
 * @property {string} attribution Attribution to be presented at the bottom of the map. May contain anchor html tags for links.
 * @property {string=} version Which version of the WMS protocol to use. Default 1.1.0
 * @property {boolean=} hasWmsLoaded Used by Qlik Sense. Set to true if you want to use the different wms settings.
 * @property {string} selectedCrs The coordinate reference system to use. Only applicable if `'hasWmsLoaded': true`.
 * @property {string} selectedFormat Which image format to use for the generated map images. Only applicable if `'hasWmsLoaded': true`.
 * @property {capabilities} capabilities Only applicable if `'hasWmsLoaded': true`.
 */

/**
 * @typedef {object} image Settings to render an image from an url. The image will be rendered in a rectangle defined by two corners in coordinates.
 * @property {string|StringExpression} url URL to use as source. The URL is an expression that is evaluated when the selection changes.
 * @property {string} attribution Attribution to be presented at the bottom of the map. May contain anchor html tags for links.
 * @property {number} minX Min X of rectangle.
 * @property {number} minY Min Y of rectangle.
 * @property {number} maxX Max X of rectangle.
 * @property {number} maxY Max Y of rectangle.
 */

/**
 * @typedef {object} capabilities
 * @property {layers[]} layers A list of map layers that the WMS server supports.
 * @property {boolean=} transparent Option to set the transparency if the WMS supports it.
 */

/**
 * @typedef {object} layers Layers from a Web Map Service that can be displayed on the map.
 * @property {string} name Layer name used when building up the URL syntax.
 * @property {boolean=} selected Set to true if the layer should be displayed.
 */
