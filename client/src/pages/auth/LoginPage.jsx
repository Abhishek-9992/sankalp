import React from 'react';
import LoginForm from '../../components/auth/LoginForm';

const LoginPage = ({
  onBackToLanding,
  onNavigateToRegister,
  onNavigateToForgotPassword
}) => {
  return (
    <LoginForm
      onBackToLanding={onBackToLanding}
      onNavigateToRegister={onNavigateToRegister}
      onNavigateToForgotPassword={onNavigateToForgotPassword}
    />
  );
};

export default LoginPage;