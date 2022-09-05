import React from 'react';
import ReactDOM from 'react-dom';
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
      ReactDOM.render(<Map setWebMapRef={setWebMapRef} />, core.element);
    }
  }, [core]);
};

export default UseRender;
