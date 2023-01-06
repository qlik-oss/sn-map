import getAreaLayerDefinition from './area-layer';
import getPointLayerDefinition from './point-layer';
import getGeodataLayerDefinition from './geodata-layer';
import DefaultFields from '../utils/default-fields';
import Utils from '../utils/layers';
import { getValue } from 'qlik-chart-modules';

export default function layerSettings({ translator }: EnvironmentType) {
  const REF_LAYERS: string = 'gaLayers';
  const DATA_PATH: string = 'items.data.items.data';
  const noLayersHelpHeader = translator.get('geo.properties.noLayer');
  const noLayersHelpText = translator.get('geo.properties.noLayerText');

  function getLayerDefs() {
    const layerDefinitions: { [key: string]: any } = {
      AreaLayer: getAreaLayerDefinition({ translator }),
      PointLayer: getPointLayerDefinition({ translator }),
      GeodataLayer: getGeodataLayerDefinition({ translator }),
    };

    return layerDefinitions;
  }

  return {
    translation: 'properties.layers',
    component: 'items',
    items: {
      layers: {
        // The layers component will allow adding / removing / moving and stepping into layers for editing.
        component: 'layers',
        ref: REF_LAYERS,
        dataPath: DATA_PATH,
        addTranslation: 'properties.layers.add',
        deleteBtnTranslation: 'geo.layer.delete',
        noLayersHelpHeader,
        noLayersHelpText,
        showAddButton: false,
        activePath: (item: LayerProperties) => {
          const hasDims = getValue(item, 'data.qHyperCubeDef.qDimensions', []).length > 0;
          const hasUrl = getValue(item, 'data.tms.url', '').length > 0;
          return hasDims || hasUrl ? false : 'data';
        },
        layers: getLayerDefs(),
      },
      addLayer: {
        ref: 'mapSettings._layerType',
        type: 'string',
        defaultValue: '',
        component: 'options-list',
        // -- Panel def --
        translation: 'properties.layers.add',
        change: function (properties: MapProperties) {
          const layerType = getValue(properties, 'mapSettings._layerType', '');
          if (layerType.length) {
            const layerProps = getLayerDefs()[layerType].initialProperties;
            properties.mapSettings._layerType = '';
            DefaultFields.setColor(layerProps, properties.gaLayers);
            Utils.insertLayer(layerProps, properties.gaLayers);
          }
        },
        // -- Subpanel def --
        title: 'properties.layers.add',
        optionsLabel: 'geo.properties.addOptions',
        optionsRadius: 3,
        optionsSpacing: 12,
        optionsBoldSelect: true,
        options: function () {
          const sourceMap: { [key: string]: string } = {
            AreaLayer: '../resources/extensions/qliktech/mapchart/img/layer_area.png',
            PointLayer: '../resources/extensions/qliktech/mapchart/img/layer_point.png',
            GeodataLayer: '../resources/extensions/qliktech/mapchart/img/bg_default.png',
          };
          const layerDefs = getLayerDefs();
          const options = Object.keys(layerDefs).map(function (layerType) {
            const def = layerDefs[layerType];
            def.type = layerType;
            return {
              src: sourceMap[layerType],
              translation: def.definition.translation,
              value: layerType,
            };
          });
          return options;
        },
      },
    },
  };
}
