import { useRender, useCore, useModels, useInteractions, useTooltip } from './hooks';
import { useState } from '@nebula.js/stardust';
import createQae from './qae';
import ext from './ext/ext';
import locale from './locale';

export default function supernova(env: EnvironmentType) {
  locale(env.translator);

  return {
    qae: createQae(),
    ext: ext(env),
    component() {
      // webMapRef contains the react reference of the map element in the DOM
      const [webMapRef, setWebMapRef] = useState();
      const core = useCore();
      const mapModel = useModels({ core, webMapRef });
      useInteractions(mapModel);
      const models = useTooltip(mapModel);
      useRender({ core, setWebMapRef, models });
    },
  };
}
