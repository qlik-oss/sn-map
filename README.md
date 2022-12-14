# sn-map (experimental)

## A map for nebula.js.

Maps enable you to view your data geographically. Maps have many ways to present your data. You can add multiple layers to your map to display different types of information on the same map. You can set a custom scope for locations so that if two locations have the same name, you display the locations and their data correctly. You can add custom base maps to your map and use non-WGS-84 coordinates.

### Layers

- Point layer: A point layer overlays individual locations on a map, representing them with shapes.
- Geodata layer: A geodata layer enables you to display a custom base map for your map visualization.

## Requirements

Requires `@nebula.js/stardust` version `3.0.4` or later.

## Installing

If you use npm: npm install `@nebula.js/sn-map`

## Usage

```js
import { embed } from '@nebula.js/stardust';
import map from '@nebula.js/sn-map';

// 'app' is an enigma app model
const nuked = embed(app, {
  types: [
    {
      // register the map
      name: 'map',
      load: () => Promise.resolve(map),
    },
  ],
});

// Rendering a map on the fly
nuked.render({
  type: 'map',
  element,
  options: {
    configuration: { serverUrl: ...,  serverKey: ... }
  },
  properties: {
    ...
  },
});
```

## Options

These are optional settings to configure which map server you want to use. If not provided it will either try to use Qlik's cloud servers if connected to Sense (e.g. sn-map is used as an extension) or load a local script of Webmap5 to render layers.

- configuration
  - serverUrl - host url for map server.
  - serverKey - key for map server.

## Examples

### Map with a point layer

```js
nuked.render({
  type: 'map',
  element,
  options: {
    configuration: {
      serverUrl: 'https://maps.qlikcloud.com' ,
      serverKey: ... ,
    },
  },
  properties: {
    gaLayers: [
      {
        type: 'PointLayer',
        qHyperCubeDef: {
          qDimensions: [
            {
              qDef: {
                qFieldDefs: [
                  'id'
                ],
              },
              qAttributeExpressions: [
                {
                  qExpression: 'latitude',
                  id: 'locationOrLatitude'
                },
                {
                  qExpression: 'longitude',
                  id: 'longitude'
                }
              ],
            }
          ],
          qMeasures: [],
          qInitialDataFetch: [
            {
              qLeft: 0,
              qTop: 0,
              qWidth: 1,
              qHeight: 10000
            }
          ],
        },
        size: {
          value: 10,
        },
        color: {
          mode: 'primary',
          paletteColor: {
            index: 9,
            color: '#f8981d'
          },
        },
        locationOrLatitude: {
          key: 'latitude',
          type: 'expression'
        },
        isLatLong: true,
        id: 'tWTdanX'
      }
    ],
    mapSettings: {
      showScaleBar: true,
    },
  },
});
```

### Map with a wms geodata layer

```js
nuked.render({
  type: 'map',
  element,
  properties: {
    gaLayers: [
      {
        type: 'GeodataLayer',
        dataType: 'wms',
        wms: {
          url: 'https://nowcoast.noaa.gov/arcgis/services/nowcoast/analysis_meteohydro_sfc_qpe_time/MapServer/WmsServer',
          hasWmsLoaded: true,
          selectedFormat: 'PNG',
          capabilities: {
            layers: [
              {
                name: '1',
                selected: true,
              },
              {
                name: '2',
                selected: true,
              },
              {
                name: '3',
                selected: true,
              },
            ],
            transparent: true,
          },
        },
        id: 'bKgjAA',
      },
    ],
    mapSettings: {
      showScaleBar: true,
      projection: 'default',
    },
  },
});
```
