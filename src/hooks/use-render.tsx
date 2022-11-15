import React from 'react';
import { createRoot } from 'react-dom/client';
import { useEffect } from '@nebula.js/stardust';
import Map from '../components/map';

type UseRenderProps = {
  core: {
    element: HTMLElement;
    setWebMapRef: Function;
  };
  setWebMapRef: Function;
};

const UseRender = ({ core, setWebMapRef }: UseRenderProps) => {
  useEffect(() => {
    if (core?.element) {
      const root = createRoot(core.element);
      root.render(<Map setWebMapRef={setWebMapRef} />);
    }
  }, [core]);
};

export default UseRender;
