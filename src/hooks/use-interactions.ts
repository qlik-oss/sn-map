import { useSelections, useEffect, useState, useConstraints } from '@nebula.js/stardust';
import { SelectionModel } from '../models/selection-model';
import useSelectionToolbar from './use-selection-toolbar';

const useInteractions = (mapModel: MapModelInterFace) => {
  const selections = useSelections();
  const constraints = useConstraints();
  const selectionToolbar = useSelectionToolbar();
  const [selectedPath, setSelectedPath] = useState('');
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectionModel, setSelectionModel] = useState();
  const processSelectionCallback = (path: string, selectedValues: number[]) => {
    setSelectedPath(path);
    setSelectedValues(selectedValues);
  };

  useEffect(() => {
    if (!mapModel) {
      return;
    }
    setSelectionModel(new SelectionModel(mapModel, selections, processSelectionCallback));
  }, [mapModel]);

  useEffect(() => {
    if (selectionModel) {
      selectionModel.setSelectionToolbar(selectionToolbar);
    }
  }, [selectionModel, selectionToolbar]);

  useEffect(() => {
    if (!constraints || !selectionModel) {
      return;
    }
    selectionModel.setAllowSelections(!constraints.select && !constraints.active);
  }, [constraints, selectionModel]);

  useEffect(() => {
    if (!selectionModel) {
      return;
    }

    const onClick = (e: any) => {
      if (selectionModel.allowSelections) {
        selectionModel.handleClick(e.target);
      }
    };

    const onMove = (e: any) => {
      if (
        selectionModel.allowSelections &&
        selectionModel.pressEvent &&
        selectionModel.selectionToolbar.activeTool &&
        e.button === 0
      ) {
        e.stop();
        selectionModel.handleMove(e);
      }
    };

    mapModel.map.addListener('click', onClick);
    mapModel.map.addListener('move', onMove);
    mapModel.map.addListener('press', (e: any) => selectionModel.handleClickPressed(e));
    mapModel.map.addListener('release', () => selectionModel.handleRelease());
    return () => {
      mapModel.map.removeListener('click');
      mapModel.map.removeListener('move');
      mapModel.map.removeListener('press');
      mapModel.map.removeListener('release');
    };
  }, [selectionModel]);

  useEffect(() => {
    if (!selectionModel) {
      return;
    }
    // set style
    selectionModel.updateHighlight();
  }, [selectedValues, selectionModel]);

  useEffect(() => {
    if (selections.isActive()) {
      if (selectedValues.length) {
        selections.select({
          method: 'selectHyperCubeValues',
          params: [selectedPath, 0, selectedValues, false],
        });
      } else {
        selections.select({
          method: 'resetMadeSelections',
          params: [],
        });
      }
    } else {
      if (selectedValues.length) {
        setSelectedPath('');
        setSelectedValues([]);
        selectionModel.resetSelections();
      }
      selectionToolbar.reset?.();
    }
  }, [selections.isActive(), selectedValues]);
};

export default useInteractions;
