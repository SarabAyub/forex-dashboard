import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLazyConnectQuery } from '../features/apiSlice';
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    user: '62333850',
    password: 'tecimil4',
    host: '78.140.180.198',
    port: '443',
  });

  const [connect, { data, isError, isFetching }] = useLazyConnectQuery();

const handleLogin = async () => {
  const result = await connect(credentials).unwrap();

  if (result) {
    localStorage.setItem('sessionId', result);
    console.log('Connected session ID:', result);
    navigate('/chart');
  } else {
    alert('Login failed!');
  }
};

// const handleLogin = async () => {
//     try {
//         const response = await axios.get('http://212.117.171.68:5000/Connect', {
//             params: {
//                 user: credentials.user,
//                 password: credentials.password,
//                 host: credentials.host,
//                 port: credentials.port,
//             },
//         });

//         const data = response.data;
//         if (data) {
//             localStorage.setItem('sessionId', data);
//             console.log('Connected session ID:', data);
//             // navigate('/chart');
//         } else {
//             alert('Login failed!');
//         }
//     } catch (error) {
//         console.error('Error connecting:', error);
//         alert('Login failed!');
//     }
// };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Connect</button>
      {isError && <p>Failed to connect. Please try again.</p>}
    </div>
  );
};

export default LoginPage;


