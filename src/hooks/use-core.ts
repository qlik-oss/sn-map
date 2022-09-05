import { useElement, useState, useEffect, useOptions } from '@nebula.js/stardust';
import useViewState from './use-view-state';
import useWebmap from './use-webmap';

const useCore = () => {
  const element = useElement();
  const viewState = useViewState();
  const options = useOptions();

  const webmap = useWebmap(options);

  const [core, setCore] = useState();
  useEffect(() => {
    if (!viewState || !element) return undefined;
    setCore({
      element,
      webmap,
    });
  }, [viewState, webmap, element]);

  return core;
};

export default useCore;
