import { useEffect, useState, useAction, useConstraints, useLayout, useTranslator } from '@nebula.js/stardust';
import lassoIcon from '../static/icons/lasso-icon';
import radialSelectIcon from '../static/icons/radial-select-icon';

const useSelectionToolbar = (): SelectionToolbar => {
  const constraints = useConstraints();
  const [enabled, setEnabled] = useState(false);
  const [activeTool, setActiveTool] = useState('');
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
    const activeAction = activeTool !== actionName ? actionName : '';
    setActiveTool(activeAction);
  };

  // add the lasso button to the toolbar
  useAction(
    () => ({
      key: 'lasso',
      label: translator.get(
        activeTool === 'lasso' ? 'Tooltip.ToggleOffLassoSelection' : 'Tooltip.ToggleOnLassoSelection'
      ),
      icon: lassoIcon,
      hidden: !enabled || !isInSelections || isSingleSelection,
      active: activeTool === 'lasso',
      action: () => action('lasso'),
    }),
    [isInSelections, isSingleSelection, activeTool, enabled]
  );

  // add the circle button to the toolbar
  useAction(
    () => ({
      key: 'circle',
      label: translator.get(
        activeTool === 'circle' ? 'Tooltip.ToggleOffCircleSelection' : 'Tooltip.ToggleOnCircleSelection'
      ),
      icon: radialSelectIcon,
      hidden: !enabled || !isInSelections || isSingleSelection,
      active: activeTool === 'circle',
      action: () => action('circle'),
    }),
    [isInSelections, isSingleSelection, activeTool, enabled]
  );

  return {
    enabled,
    activeTool,
  };
};

export default useSelectionToolbar;
