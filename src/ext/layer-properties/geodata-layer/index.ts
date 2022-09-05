import getInitialProperties from './initial-properties';
import getDefinition from './definition';

export default function getGeodataLayerDefinition({ translator }: EnvironmentType) {
  return {
    initialProperties: getInitialProperties(),
    definition: getDefinition({ translator }),
  };
}
