import React from 'react';
import { Box, styled } from '@material-ui/core';
import MeasureRow from './measure-row';

const TooltipContent = styled('div')((props) => ({
  position: 'absolute',
  maxWidth: 368,
  padding: '8px 8px',
  top: props?.position[0],
  right: props?.position[1],
  zIndex: 1000,
}));

export default function Tooltip({ model }) {
  return <>{model?.openTooltip && <TooltipContent position={model?.position}>{model?.content}</TooltipContent>}</>;
}
