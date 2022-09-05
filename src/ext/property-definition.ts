import layerSettings from './layer-properties/layer-settings';
import mapSettings from './map-properties/map-settings';
import presentation from './map-properties/presentation';

export default function propertyDefinition(env: EnvironmentType) {
  return {
    type: 'items',
    component: 'accordion',
    items: {
      layerSettings: layerSettings(env),
      mapSettings: mapSettings(env),
      presentation: presentation(),
    },
  };
}
