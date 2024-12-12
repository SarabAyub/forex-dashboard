import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLazyConnectQuery } from '../features/apiSlice';
import { useDispatch } from 'react-redux';
import { setSessionId } from '../features/sessionSlice';
import {  Box, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import InputField from '../components/core/inputField/inputField';
import useUserAuthentication from '../hooks/useUserAuthentication';
import CoreButton from '../components/core/button/button';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [credentials, setCredentials] = useState({
    user: '',
    password: '',
    host: '',
    port: '',
  });

  const [connect, { isFetching }] = useLazyConnectQuery();
  const { isAuthenticated, error } = useUserAuthentication(credentials);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    const { user, password, host, port } = credentials;

    if (!user || !password || !host || !port) {
      toast.error('All fields are required.');
      return;
    }
    else if (error.user || error.password || error.host || error.port) {
      toast.error(error.user || error.password || error.host || error.port);
      return;
    }
    else if (!isAuthenticated) {
      toast.error('Authentication failed. Please check your credentials.');
      return;
    }

    try {
      const sessionId = await connect(credentials).unwrap();

      if (!sessionId) {
        toast.error('Connection issue: No session ID received.');
        return;
      }

      dispatch(setSessionId(sessionId));
      navigate('/chart');
    } catch (err) {
      toast.error('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <InputField
        label="User"
        name="user"
        value={credentials.user}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <InputField
        label="Password"
        name="password"
        type="password"
        value={credentials.password}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <InputField
        label="Host"
        name="host"
        value={credentials.host}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <InputField
        label="Port"
        name="port"
        value={credentials.port}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <CoreButton
        variant="contained"
        color="primary"
        onClick={handleLogin}
        fullWidth
        disabled={isFetching}
        sx={{ mt: 2 }}
      >
        {isFetching ? 'Connecting...' : 'Connect'}
      </CoreButton>
    </Box>
  );
};

export default LoginPage;
