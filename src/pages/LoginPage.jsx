import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLazyConnectQuery } from '../features/apiSlice';
import { useDispatch } from 'react-redux';
import { setSessionId } from '../features/sessionSlice';
import { Button, TextField, Box, Typography } from '@mui/material';
import ErrorDisplay from '../components/core/ErrorDisplay';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [credentials, setCredentials] = useState({
    user: '62333850',
    password: 'tecimil4',
    host: '78.140.180.198',
    port: '443',
  });

  const [connect, { isError, isFetching }] = useLazyConnectQuery();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      const sessionId = await connect(credentials).unwrap();
      dispatch(setSessionId(sessionId));
      navigate('/chart');
    } catch {
      console.error('Login failed');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <TextField
        label="User"
        name="user"
        value={credentials.user}
        onChange={handleChange}
        fullWidth
        margin="normal"
        slotProps={{ input: { readOnly: true } }}
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        value={credentials.password}
        onChange={handleChange}
        fullWidth
        margin="normal"
        slotProps={{ input: { readOnly: true } }}
      />
      <TextField
        label="Host"
        name="host"
        value={credentials.host}
        onChange={handleChange}
        fullWidth
        margin="normal"
        slotProps={{ input: { readOnly: true } }}
      />
      <TextField
        label="Port"
        name="port"
        value={credentials.port}
        onChange={handleChange}
        fullWidth
        margin="normal"
        slotProps={{ input: { readOnly: true } }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleLogin}
        fullWidth
        disabled={isFetching}
        sx={{ mt: 2 }}
      >
        {isFetching ? 'Connecting...' : 'Connect'}
      </Button>
      {isError && <ErrorDisplay message="Failed to connect. Please try again." />}
    </Box>
  );
};

export default LoginPage;
