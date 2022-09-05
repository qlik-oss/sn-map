import WMSUtils from './utils';

export default function getWMSDefinition() {
  return {
    wms: {
      component: 'items',
      items: {
        wmsSetup: {
          ref: 'wms.setup',
          component: 'wms-setup',
          translation: 'geo.properties.wms.setup',
          getCapabilities: () => {
            return WMSUtils.getWMSCapabilities;
          },
        },
        url: {
          ref: 'wms.url',
          translation: 'Common.URL',
          minlength: 1,
          type: 'string',
          defaultValue: '',
          readOnly: true,
        },
        wmsHint: {
          component: 'items',
          grouped: true,
          items: [
            {
              component: 'text',
              translation: 'geo.properties.wms.hint',
              style: 'hint',
            },
          ],
        },
        attribution: {
          ref: 'wms.attribution',
          type: 'string',
          translation: 'properties.attribution',
          component: 'textarea',
          maxlength: 1024,
        },
      },
      show: function (props: GeodataLayerProperties) {
        return props.dataType === 'wms';
      },
    },
  };
}
