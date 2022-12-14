import React, { useRef, useCallback } from 'react';

import TooltipRoot from './tooltip/tooltip-portal';

type mapProps = {
  setWebMapRef: Function;
  models: any;
};

export default function Map({ setWebMapRef, models }: mapProps) {
  const mapStyle = {
    height: '100%',
    width: '100%',
  };

  const useHookWithRefCallback = () => {
    const ref = useRef(null);
    const setRef = useCallback((node: any) => {
      // Save the node to the referrence
      ref.current = node;
      setWebMapRef(ref);
    }, []);

    return [setRef];
  };

  const [webMapRef] = useHookWithRefCallback();

  return (
    <div className="map-root" style={mapStyle}>
      <div className="map-content" style={mapStyle}>
        <div className="map-webmap" style={mapStyle} data-testid="qv-object-map" ref={webMapRef}></div>
        <div className="map-error-div">
          <div className="map-error-icon-div lui-fade-button lui-icon lui-icon--info"></div>
          <div className="map-error-content-div"></div>
        </div>
      </div>
      <div className="sidebar"></div>
      <TooltipRoot model={models} />
    </div>
  );
}
