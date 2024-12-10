import React from 'react';
import { Alert } from '@mui/material';

const ErrorDisplay = ({ message }) => (
  <Alert severity="error" sx={{ mt: 2 }}>
    {message}
  </Alert>
);

export default ErrorDisplay;
