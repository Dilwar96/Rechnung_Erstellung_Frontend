import React from 'react';
import { CompanySettings } from '../components/CompanySettings';
import { ToastContainer } from '../components/Toast';

export const SettingsPage: React.FC<{onBack: () => void}> = ({ onBack }) => {
  return (
    <>
      <CompanySettings onBack={onBack} />
      <ToastContainer />
    </>
  );
};

export default SettingsPage;
