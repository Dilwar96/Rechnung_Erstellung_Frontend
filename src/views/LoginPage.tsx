import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLogin } from '../components/AdminLogin';
import { ToastContainer } from '../components/Toast';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (token: string, username: string) => {
    localStorage.setItem('adminToken', token);
    // Trigger custom event for same-tab localStorage update
    window.dispatchEvent(new Event('localStorageChange'));
    navigate('/');
  };

  return (
    <>
      <AdminLogin onLoginSuccess={handleLoginSuccess} />
      <ToastContainer />
    </>
  );
};

export default LoginPage;
