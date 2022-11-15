import React from 'react';
import { createRoot } from 'react-dom/client';
import { useEffect } from '@nebula.js/stardust';
import Map from '../components/map';

type UseRenderProps = {
  core: {
    element: HTMLElement;
    webmap: Function;
  };
  setWebMapRef: Function;
};

type ReactRoot = {
  render: Function;
};

const UseRender = ({ core, setWebMapRef }: UseRenderProps) => {
  let root: ReactRoot;

  useEffect(() => {
    if (core?.element) {
      root = createRoot(core.element!);
    }
  }, [core?.element]);

  useEffect(() => {
    if (root) {
      root.render(<Map setWebMapRef={setWebMapRef} />);
    }
  }, [core]);
};

export default UseRender;
