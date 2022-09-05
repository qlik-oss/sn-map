import LayerType from '../../../../utils/const/layer-type';

export default function getOptionsDefinition(layerType: LayerTypeName) {
  const optionsSection = {
    type: 'items',
    component: 'expandable-items',
    translation: 'geo.properties.options',
    items: {},
  };

  if (layerType === LayerType.GEODATA) {
    (optionsSection.items as any).appearance = {
      type: 'items',
      translation: 'properties.presentation',
      items: {
        opacity: {
          ref: 'opacity',
          translation: 'properties.opacity',
          type: 'number',
          defaultValue: 1.0,
          min: 0.0,
          max: 1.0,
          step: 0.05,
          component: 'slider',
        },
      },
    };
  }

  return optionsSection;
}
