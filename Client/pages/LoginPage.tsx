import React from 'react';
import AuthForms from '../components/AuthForms';

const LoginPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AuthForms initialView="LOGIN" />
    </div>
  );
};

export default LoginPage;


