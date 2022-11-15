import { useEffect, useState, useApp, useStaleLayout, useRect } from '@nebula.js/stardust';
import { MapModel } from '../models/map-model';
import { FieldsModel } from '../models/fields-model';

type UseModelsProps = {
  core: {
    element: HTMLElement;
    webmap: {
      isLoading: boolean;
      error: string;
    };
  };
  webMapRef: React.RefObject<HTMLElement> | undefined;
};

const useModels = ({ core, webMapRef }: UseModelsProps) => {
  const app = useApp();
  const layout = useStaleLayout();
  const rect = useRect();

  const [mapModel, setMapModel] = useState();

  const createMapModel = () => {
    const { webmap } = core;
    if (!webmap.isLoading && !webmap.error && webMapRef?.current && !mapModel) {
      setMapModel(new MapModel(webMapRef?.current, layout));
    }
  };

  useEffect(() => {
    if (!core) {
      return;
    }
    createMapModel();
  }, [core, webMapRef]);

  useEffect(() => {
    FieldsModel.load(app);
  }, [app]);

  useEffect(() => {
    if (mapModel) {
      mapModel.map.repaint();
    }
  }, [rect]);

  useEffect(() => {
    if (mapModel) {
      mapModel.update(layout);
    }
  }, [layout, mapModel]);

  return mapModel;
};

export default useModels;
