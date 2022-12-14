import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

import Tooltip from './tooltip';

export default function TooltipRoot({ model }) {
  const mount = document.body;
  const el = document.createElement('div');

  useEffect(() => {
    mount.appendChild(el);

    return () => {
      mount.removeChild(el);
    };
  }, [el, mount]);

  return createPortal(<Tooltip model={model} />, el);
}
