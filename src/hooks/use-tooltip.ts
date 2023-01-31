import { useEffect, useState, useConstraints, useRect } from '@nebula.js/stardust';

const useTooltip = (mapModel: MapModelInterFace) => {
  const constraints = useConstraints();
  const rect = useRect();
  const [openTooltip, setOpenTooltip] = useState(false);
  const [content, setContent] = useState('');
  const [position, setPosition] = useState([]);

  useEffect(() => {
    if (!mapModel) {
      return;
    }

    const calculatePosition = (features: idevio.map.Feature[], event: any) => {
      let position = mapModel.map.geoToDisplay(features[0].getCenter());
      const MULTI_CENTER_TOLERANCE_PX = 3;

      for (let i = 1; i < features.length; i++) {
        const center = mapModel.map.geoToDisplay(features[i].getCenter());
        const distanceToFirstCenter = Math.sqrt((position[0] - center[0]) ** 2 + (position[1] - center[1]) ** 2);
        if (distanceToFirstCenter > MULTI_CENTER_TOLERANCE_PX) {
          // if the center points of all features are too far apart, just use pointer position
          position = [event.clientX, event.clientY];
          break;
        }
      }

      position[0] = Math.max(0, Math.min(rect.width || 0, position[0]));
      position[1] = Math.max(1, Math.min(rect.height || 0, position[1]));

      return [position[0], position[1]];
    };

    const onHover = (event: idevio.map.PositionEvent) => {
      if (event.target) {
        const features = mapModel.map.getFeaturesAt(event.clientX, event.clientY);
        if (features.length === 0) {
          return;
        }
        setOpenTooltip(true);
        console.log('open', features);
        setContent(features[0].getAttribute('geoname'));
        const pos = calculatePosition(features, event);
        setPosition(pos);
      }
    };

    const onClose = (event: idevio.map.PositionEvent) => {
      console.log('close', event);
      setOpenTooltip(false);
    };

    mapModel.map.addListener('move', onHover);
    mapModel.map.addListener('out', onClose);
    return () => {
      mapModel.map.removeListener('move');
      mapModel.map.removeListener('out');
    };
  }, [mapModel, rect]);

  useEffect(() => {}, [openTooltip]);

  return {
    openTooltip,
    content,
    position,
  };
};

export default useTooltip;
