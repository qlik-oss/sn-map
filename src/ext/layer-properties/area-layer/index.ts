import getInitialProperties from './initial-properties';
import getDefinition from './definition';

export default function getAreaLayerDefinition({ translator }: EnvironmentType) {
  return {
    initialProperties: getInitialProperties(),
    definition: getDefinition({ translator }),
  };
}
