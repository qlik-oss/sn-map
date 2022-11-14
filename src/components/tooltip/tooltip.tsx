import React, { useState, useEffect } from 'react';
import { Tooltip, Box, styled } from '@material-ui/core';
import MeasureRow from './measure-row';

const TooltipContent = styled(Box)(() => ({
  maxWidth: 368,
  padding: '8px 8px',
}));

export default function Tooltip({ nodes, constraints, children }) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [title, setTittle] = useState();

  const fontFamily = '';

  const measures = (
    <>
      {nodes.map((node) => (
        <MeasureRow rtl={false} label={node.data.measureTitle} value={node.data.formattedValue} />
      ))}
    </>
  );

  const createTooltip = () => {
    setTittle(<TooltipContent sx={{ fontFamily }}>{measures}</TooltipContent>);

    constraints.active ?? setIsTooltipOpen(true);
  };

  const onOpen = () => {
    createTooltip();
  };

  const onClose = () => {
    setIsTooltipOpen(false);
  };

  return (
    <Tooltip
      title={title}
      onOpen={onOpen}
      onClose={onClose}
      open={isTooltipOpen}
      enterNextDelay={400}
      classes={{ tooltipPlacementBottom: 'sn-kpi-tooltipBottomPosition-padding' }}
      componentsProps={{ tooltip: { sx: { maxWidth: '368px', p: 0 } } }}
      arrow
    >
      {children}
    </Tooltip>
  );
}
