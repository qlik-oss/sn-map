export default function presentation() {
  return {
    uses: 'settings',
    items: {
      general: {
        items: {
          details: {
            show: false,
          },
        },
      },
      tools: {
        type: 'items',
        translation: 'geo.properties.presentation',
        grouped: true,
        items: {
          scaleBar: {
            type: 'items',
            items: {
              showScaleBar: {
                ref: 'mapSettings.showScaleBar',
                translation: 'geo.properties.showScaleBar',
                component: 'switch',
                options: [
                  { value: true, translation: 'properties.on' },
                  { value: false, translation: 'properties.off' },
                ],
                defaultValue: true,
              },
            },
          },
          debug: {
            type: 'items',
            items: {
              showDebugInfo: {
                ref: 'mapSettings.showDebugInfo',
                translation: 'geo.properties.showDebugInfo',
                component: 'switch',
                options: [
                  { value: true, translation: 'properties.on' },
                  { value: false, translation: 'properties.off' },
                ],
                defaultValue: false,
              },
            },
          },
        },
      },
    },
  };
}
