import React from 'react';
import CoreButton from '../core/button/button';
import useLogout from '../../hooks/useLogout';

const LogoutButton = ({closeSocket}) => {
  const logout = useLogout(closeSocket);

  return (
    <CoreButton variant="contained" color="secondary" onClick={logout}>
      Logout
    </CoreButton>
  );
};

export default LogoutButton;
