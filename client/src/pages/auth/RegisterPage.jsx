import React, { useState } from 'react';
import RegisterForm from '../../components/auth/RegisterForm';
import OTPVerification from '../../components/auth/OTPVerification';

const RegisterPage = ({
  initialUserType = null,
  onBackToLanding,
  onNavigateToLogin
}) => {
  const [currentStep, setCurrentStep] = useState('register'); // 'register' | 'otp'
  const [registrationData, setRegistrationData] = useState(null);

  const handleNavigateToOTPVerification = (userData) => {
    setRegistrationData(userData);
    setCurrentStep('otp');
  };

  const handleBackToRegister = () => {
    setCurrentStep('register');
    setRegistrationData(null);
  };

  const handleVerificationSuccess = (userData) => {
    // Registration and verification complete
    console.log('Registration completed successfully:', userData);
    // This would typically redirect to dashboard or show success message
  };

  if (currentStep === 'otp' && registrationData) {
    return (
      <OTPVerification
        userData={registrationData}
        onBackToRegister={handleBackToRegister}
        onVerificationSuccess={handleVerificationSuccess}
      />
    );
  }

  return (
    <RegisterForm
      initialUserType={initialUserType}
      onBackToLanding={onBackToLanding}
      onNavigateToLogin={onNavigateToLogin}
      onNavigateToOTPVerification={handleNavigateToOTPVerification}
    />
  );
};

export default RegisterPage;