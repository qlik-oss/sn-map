import getTMSDefinition from './tms/definition';
import getWMSDefinition from './wms/definition';
import getImageDefinition from './image/definition';

export default function getFormatsDefinition() {
  return {
    component: 'items',
    translation: 'geo.properties.geodata',
    items: {
      common: {
        type: 'items',
        items: {
          title: {
            ref: 'title',
            type: 'string',
            translation: 'Common.Label',
          },
          dataType: {
            ref: 'dataType',
            translation: 'geo.properties.dataType',
            component: 'dropdown',
            type: 'string',
            options: function () {
              return [
                { value: 'tms', translation: 'geo.properties.tms' },
                { value: 'wms', translation: 'geo.properties.wms' },
                { value: 'image', translation: 'geo.properties.image' },
              ];
            },
            defaultValue: 'tms',
          },
        },
      },
      ...getTMSDefinition(),
      ...getWMSDefinition(),
      ...getImageDefinition(),
    },
  };
}
