import { getValue } from 'qlik-chart-modules';

export default function getImageDefinition() {
  return {
    image: {
      component: 'items',
      grouped: true,
      items: {
        url: {
          ref: 'image.url',
          translation: 'Common.URL',
          minlength: 1,
          expression: 'optional',
          type: 'string',
          defaultValue: '',
          change: function (props: GeodataLayerProperties) {
            const imageUrl = getValue(props, 'image.url', false);
            if (!props.title && imageUrl) {
              try {
                const url = new URL(imageUrl);
                props.title = url.hostname;
              } catch {}
            }
          },
        },
        positionSection: {
          component: 'items',
          items: {
            imagePostion: {
              ref: 'image.position',
              translation: 'geo.properties.image.position',
              component: 'text',
              style: 'header',
            },
            settingsHint: {
              ref: 'image.settingshint',
              translation: 'geo.properties.image.hint',
              component: 'text',
              style: 'hint',
            },
            topLeftLabel: {
              ref: 'image.topLeftCorner',
              translation: 'geo.properties.image.topLeftCorner',
              component: 'text',
              style: 'sHeader',
            },
            maxX: {
              ref: 'image.maxX',
              translation: 'geo.properties.image.top',
              expression: 'optional',
              type: 'number',
              defaultValue: 5,
            },
            minY: {
              ref: 'image.minY',
              translation: 'geo.properties.image.left',
              expression: 'optional',
              type: 'number',
              defaultValue: 0,
            },
            bottomRightLabel: {
              ref: 'image.bottomRightCorner',
              translation: 'geo.properties.image.bottomRightCorner',
              component: 'text',
              style: 'sHeader',
            },
            minX: {
              ref: 'image.minX',
              translation: 'geo.properties.image.bottom',
              expression: 'optional',
              type: 'number',
              defaultValue: 0,
            },
            maxY: {
              ref: 'image.maxY',
              translation: 'geo.properties.image.right',
              expression: 'optional',
              type: 'number',
              defaultValue: 5,
            },
          },
        },
        attribution: {
          ref: 'image.attribution',
          type: 'string',
          translation: 'properties.attribution',
          component: 'textarea',
          maxlength: 1024,
        },
      },
      show: function (props: GeodataLayerProperties) {
        return props.dataType === 'image';
      },
    },
  };
}
