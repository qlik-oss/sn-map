import { useEffect, useState, useAction, useConstraints, useLayout, useTranslator } from '@nebula.js/stardust';
import lassoIcon from '../static/icons/lasso-icon';
import radialSelectIcon from '../static/icons/radial-select-icon';
import { SelectionToolTypes } from '../models/selection-model/utils/const/selection-tools';

const useSelectionToolbar = (): SelectionToolbar => {
  const constraints = useConstraints();
  const [enabled, setEnabled] = useState(false);
  const [activeTool, setActiveTool] = useState(undefined);
  const layout = useLayout();
  const translator = useTranslator();
  const isInSelections = !!layout.qSelectionInfo.qInSelections;
  const isSingleSelection = !!layout.qHyperCube?.qDimensionInfo?.[0]?.qIsOneAndOnlyOne;

  useEffect(() => {
    if (!constraints) {
      return;
    }
    setEnabled(!constraints.select && !constraints.active);
  }, [constraints]);

  const action = (actionName: string) => {
    const activeAction = activeTool !== actionName ? actionName : undefined;
    setActiveTool(activeAction);
  };

  // add the lasso button to the toolbar
  useAction(
    () => ({
      key: SelectionToolTypes.LASSO,
      label: translator.get(
        activeTool === SelectionToolTypes.LASSO ? 'Tooltip.ToggleOffLassoSelection' : 'Tooltip.ToggleOnLassoSelection'
      ),
      icon: lassoIcon,
      hidden: !enabled || !isInSelections || isSingleSelection,
      active: activeTool === SelectionToolTypes.LASSO,
      action: () => action(SelectionToolTypes.LASSO),
    }),
    [isInSelections, isSingleSelection, activeTool, enabled]
  );

  // add the circle button to the toolbar
  useAction(
    () => ({
      key: SelectionToolTypes.CIRCLE,
      label: translator.get(
        activeTool === SelectionToolTypes.CIRCLE
          ? 'Tooltip.ToggleOffCircleSelection'
          : 'Tooltip.ToggleOnCircleSelection'
      ),
      icon: radialSelectIcon,
      hidden: !enabled || !isInSelections || isSingleSelection,
      active: activeTool === SelectionToolTypes.CIRCLE,
      action: () => action(SelectionToolTypes.CIRCLE),
    }),
    [isInSelections, isSingleSelection, activeTool, enabled]
  );

  return {
    activeTool,
    reset: () => {
      setActiveTool();
    },
  };
};

export default useSelectionToolbar;
