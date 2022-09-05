import pp from './property-definition';

export default function ext(env: EnvironmentType) {
  return {
    definition: pp(env),
  };
}
