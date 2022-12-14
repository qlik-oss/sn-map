## Geodata Layer

Geodata layers enable you to display a custom base map for your map visualization.

A geodata layer could, for example, be a map of an airport that then has a point layer with WIFI hotspot locations overlaid on it. If the custom base map format supports transparency, you can overlay it on top of another map. Sn-map supports the following custom maps formats as geodata layers:

- Tile map services (TMS)
- Web Map Service (WMS)
- Image URL (Image)

### Examples

### Map with a wms geodata layer

![map geodata layer](../assets/sn-map-wms-layer.png)

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
      projection: 'EPSG:3857',
    },
  },
});
```
