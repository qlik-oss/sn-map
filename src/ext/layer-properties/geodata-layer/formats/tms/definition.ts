import { getValue } from 'qlik-chart-modules';

export default function getTMSDefinition() {
  return {
    tms: {
      component: 'items',
      items: {
        url: {
          ref: 'tms.url',
          translation: 'Common.URL',
          minlength: 1,
          expression: 'optional',
          type: 'string',
          defaultValue: '',
          change: function (props: GeodataLayerProperties) {
            const tmsUrl = getValue(props, 'tms.url', false);
            if (!props.title && tmsUrl) {
              try {
                const url = new URL(tmsUrl);
                props.title = url.hostname;
              } catch {}
            }
          },
        },
        attribution: {
          ref: 'tms.attribution',
          type: 'string',
          translation: 'properties.attribution',
          component: 'textarea',
          maxlength: 1024,
        },
        toggle: {
          ref: 'tms.auto',
          translation: 'geo.properties.advancedSettings',
          type: 'boolean',
          component: 'switch',
          defaultValue: true,
          options: [
            { value: true, translation: 'Common.Auto' },
            { value: false, translation: 'Common.Custom' },
          ],
          show: true,
        },
        advancedOptions: {
          component: 'items',
          items: {
            tileSize: {
              ref: 'tms.tileSize',
              type: 'number',
              translation: 'geo.properties.tileSize',
              defaultValue: 256,
            },
            tileWidth: {
              ref: 'tms.tileWidth',
              type: 'number',
              translation: 'geo.properties.tileWidth',
              defaultValue: 40075016,
            },
            tileHeight: {
              ref: 'tms.tileHeight',
              type: 'number',
              translation: 'geo.properties.tileHeight',
              defaultValue: 40075016,
            },
            originLeft: {
              ref: 'tms.originLeft',
              type: 'number',
              translation: 'geo.properties.originX',
              defaultValue: -20037508,
            },
            originTop: {
              ref: 'tms.originTop',
              type: 'number',
              translation: 'geo.properties.originY',
              defaultValue: 20037508,
            },
          },
          show: function (props: GeodataLayerProperties) {
            return props.tms.hasOwnProperty('auto') && !props.tms.auto;
          },
        },
      },
      show: function (props: GeodataLayerProperties) {
        return props.dataType === 'tms';
      },
    },
  };
}
