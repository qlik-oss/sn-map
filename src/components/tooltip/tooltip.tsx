import React from 'react';
import { Box, styled } from '@material-ui/core';
import MeasureRow from './measure-row';

const TooltipContent = styled(Box)(() => ({
  maxWidth: 368,
  padding: '8px 8px',
}));

export default function Tooltip({ model }) {
  return <>{!model?.openTooltip && <div>{model?.content}</div>}</>;
}
