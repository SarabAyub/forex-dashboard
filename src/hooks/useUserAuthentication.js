import { useState, useEffect } from 'react';

const useUserAuthentication = (credentials) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState({
    user: null,
    password: null,
    host: null,
    port: null,
  });

  useEffect(() => {
    const { user, password, host, port } = credentials;

    const validateCredentials = () => {
      const expectedUser = '62333850';
      const expectedPassword = 'tecimil4';
      const expectedHost = '78.140.180.198';
      const expectedPort = '443';

      const newError = {
        user: user === expectedUser ? null : 'Invalid username.',
        password: password === expectedPassword ? null : 'Invalid password.',
        host: host === expectedHost ? null : 'Invalid host.',
        port: port === expectedPort ? null : 'Invalid port.',
      };

      setError(newError);
      const allFieldsValid = Object.values(newError).every((fieldError) => fieldError === null);
      setIsAuthenticated(allFieldsValid);
    };

    validateCredentials();
  }, [credentials]);

  return { isAuthenticated, error };
};

export default useUserAuthentication;
