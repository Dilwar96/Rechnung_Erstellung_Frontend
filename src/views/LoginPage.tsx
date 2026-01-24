import React from 'react';
import { AdminLogin } from '../components/AdminLogin';
import { ToastContainer } from '../components/Toast';

interface LoginPageProps {
  onLoginSuccess: (token: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const handleLoginSuccess = (token: string, _username: string) => {
    onLoginSuccess(token);
  };

  return (
    <>
      <AdminLogin onLoginSuccess={handleLoginSuccess} />
      <ToastContainer />
    </>
  );
};

export default LoginPage;
