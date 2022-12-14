## Point Layer

A point layer overlays individual locations on a map, representing them with shapes.

Point layers use circular bubbles. The size of the points are fixed and can be colored with a single color.

### Examples

### Point layer with location as latitude/longitude

![map point layer](../assets/sn-map-point-layer.png)

```js
nuked.render({
  type: 'map',
  element,
  options: {
    configuration: {
      serverUrl: ... ,
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
        id: 'tWTdanX'
      }
    ],
    mapSettings: {
      showScaleBar: true,
    },
  },
});
```

### Point layer with location names and size by expression

![map point layer with size by expression](../assets/sn-map-point-layer-size.png)

In this example we are connected to one of Qlik's cloud server to utilize the location lookup. The libraryItem for locationOrLatitude is a municipality field.

```js
nuked.render({
  type: 'map',
  element,
  options: {
    configuration: {
      serverUrl: ... ,
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
                  qExpression: 'SE',
                  id: 'locationCountry'
                },
                {
                  qExpression: 'Avg(Price)',
                  id: 'size'
                }
              ],
              qAttributeDimensions: [
                {
                  qLibraryId: 'jqZDM',
                  id: 'locationOrLatitude'
                },
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
          autoRadiusValueRange: true,
          rangeValues: [5, 25],
          expression: {
            key: 'Avg(Price)',
            type: 'expression',
          },
        },
        color: {
          mode: 'primary',
          paletteColor: {
            index: 9,
            color: '#f8981d'
          },
        },
        locationNamesAuto: false,
        locationOrLatitude: {
          key: 'jqZDM',
          type: 'libraryItem'
        },
        locationCountry: {
          key: 'SE',
          type: 'expression'
        },
        id: 'tWTdanX'
      }
    ],
    mapSettings: {},
  },
});
```
