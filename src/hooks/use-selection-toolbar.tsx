import { useEffect, useState, useAction, useConstraints, useLayout, useTranslator } from '@nebula.js/stardust';
import lassoIcon from '../static/icons/lasso-icon';
import radialSelectIcon from '../static/icons/radial-select-icon';
import { SelectionToolTypes } from '../models/selection-model/utils/const/selection-tools';

const useSelectionToolbar = (): SelectionToolbar => {
  const constraints = useConstraints();
  const [enabled, setEnabled] = useState(false);
  const [activeClickedSelectionType, setActiveClickedSelectionType] = useState(undefined);
  const [shiftKeyPressed, setShiftKeyPressed] = useState(undefined);
  const layout = useLayout();
  const translator = useTranslator();
  const isInSelections = !!layout.qSelectionInfo.qInSelections;
  const defaultSelectionType = layout.mapSettings.selectionType;
  const activeSelectionType = shiftKeyPressed ? defaultSelectionType : activeClickedSelectionType;

  const onKeyDown = ({ key }: KeyboardEvent) => {
    if (key === 'Shift') {
      setShiftKeyPressed(true);
    }
  };

  const onKeyUp = ({ key }: KeyboardEvent) => {
    if (key === 'Shift') {
      setShiftKeyPressed(false);
    }
  };

  useEffect(() => {
    if (!constraints) {
      return;
    }
    setEnabled(!constraints.select && !constraints.active);
  }, [constraints]);

  const toggleClickedTool = (clickedTool: string) => {
    setActiveClickedSelectionType(activeClickedSelectionType !== clickedTool ? clickedTool : undefined);
  };

  // add the lasso button to the toolbar
  useAction(
    () => ({
      key: SelectionToolTypes.LASSO,
      label: translator.get(
        activeSelectionType === SelectionToolTypes.LASSO
          ? 'Tooltip.ToggleOffLassoSelection'
          : 'Tooltip.ToggleOnLassoSelection'
      ),
      icon: lassoIcon,
      hidden: !enabled || !isInSelections,
      active: activeSelectionType === SelectionToolTypes.LASSO,
      action: () => toggleClickedTool(SelectionToolTypes.LASSO),
    }),
    [isInSelections, activeSelectionType, activeClickedSelectionType, enabled]
  );

  // add the circle button to the toolbar
  useAction(
    () => ({
      key: SelectionToolTypes.CIRCLE,
      label: translator.get(
        activeSelectionType === SelectionToolTypes.CIRCLE
          ? 'Tooltip.ToggleOffCircleSelection'
          : 'Tooltip.ToggleOnCircleSelection'
      ),
      icon: radialSelectIcon,
      hidden: !enabled || !isInSelections,
      active: activeSelectionType === SelectionToolTypes.CIRCLE,
      action: () => toggleClickedTool(SelectionToolTypes.CIRCLE),
    }),
    [isInSelections, activeSelectionType, activeClickedSelectionType, enabled]
  );

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  return {
    getActiveSelectionType: () => activeSelectionType,
    reset: () => {
      setActiveClickedSelectionType(undefined);
      setShiftKeyPressed(false);
    },
  };
};

export default useSelectionToolbar;
