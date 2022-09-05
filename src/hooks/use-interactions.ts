import { useSelections, useEffect, useState, useConstraints } from '@nebula.js/stardust';
import { SelectionModel } from '../models/selection-model';

const useInteractions = (mapModel: MapModelInterFace) => {
  const selections = useSelections();
  const constraints = useConstraints();
  const [selectedPath, setSelectedPath] = useState('');
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectionModel, setSelectionModel] = useState();

  useEffect(() => {
    if (!mapModel) {
      return;
    }
    setSelectionModel(new SelectionModel(mapModel, selections));
  }, [mapModel]);

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
      if (e.target && selectionModel.allowSelections) {
        const clickSelection = selectionModel.handleClick(e.target);
        setSelectedPath(clickSelection.path);
        setSelectedValues(clickSelection.values);
      }
    };

    mapModel.map.addListener('click', onClick);
    return () => {
      mapModel.map.removeListener('click');
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
    } else if (selectedValues.length) {
      setSelectedPath('');
      setSelectedValues([]);
      selectionModel.resetSelections();
    }
  }, [selections.isActive(), selectedValues]);
};

export default useInteractions;
