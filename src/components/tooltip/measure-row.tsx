import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Box } from '@material-ui/core';
import { Row } from './styled';

const MeasureRow = ({ label, value, title, rtl }) => {
  const separator = value === '' ? '' : ':';
  const leftText = !rtl ? `${label}${separator}` : value;
  const rightText = !rtl ? value : `${separator}${label}`;
  return (
    <Row
      sx={{
        justifyContent: 'space-between',
        ...(title ? { fontWeight: 'bold' } : {}),
      }}
    >
      {leftText && (
        <Box
          sx={{ flex: '1 1 auto', ...(rightText ? { marginRight: '8px', minWidth: '44px', maxWidth: '300px' } : {}) }}
        >
          <Typography display="block" variant="inherit">
            {leftText}
          </Typography>
        </Box>
      )}
      {rightText && (
        <Box
          sx={{
            flex: '1 1 auto',
            textAlign: 'left',
            ...(leftText ? { minWidth: '44px', maxWidth: '300px' } : {}),
          }}
        >
          <Typography display="block" textAlign="right" variant="inherit">
            {rightText ?? ''}
          </Typography>
        </Box>
      )}
    </Row>
  );
};

export default MeasureRow;
