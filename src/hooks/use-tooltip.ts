import { useEffect, useState, useConstraints } from '@nebula.js/stardust';

const useTooltip = (mapModel: MapModelInterFace) => {
  const constraints = useConstraints();
  const [openTooltip, setOpenTooltip] = useState(false);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!mapModel) {
      return;
    }

    const onHover = (event: idevio.map.PositionEvent) => {
      if (event.target) {
        const features = mapModel.map.getFeaturesAt(event.clientX, event.clientY);
        if (features.length === 0) {
          return;
        }
        setOpenTooltip(true);
        console.log('open', features);
        setContent(features[0].getAttribute('geoname'));
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
  }, [mapModel]);

  useEffect(() => {}, [openTooltip]);

  return {
    openTooltip,
    content,
  };
};

export default useTooltip;
