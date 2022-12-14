import React from 'react';
import { createRoot } from 'react-dom/client';
import { useEffect, useState } from '@nebula.js/stardust';
import Map from '../components/map';

type UseRenderProps = {
  core: {
    element: HTMLElement;
    webmap: {
      isLoading: boolean;
      error: string;
    };
  };
  setWebMapRef: Function;
  models: any;
};

const UseRender = ({ core, setWebMapRef, models }: UseRenderProps) => {
  const [root, setRoot] = useState();

  useEffect(() => {
    if (core?.element) {
      setRoot(createRoot(core.element!));
    }
  }, [core?.element]);

  useEffect(() => {
    if (root) {
      root.render(<Map setWebMapRef={setWebMapRef} models={models} />);
    }
  }, [core?.webmap, models]);
};

export default UseRender;
