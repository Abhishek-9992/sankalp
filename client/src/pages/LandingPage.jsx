import React, { useState } from 'react';
import Header from '../components/landing/Header';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import UserTypes from '../components/landing/UserTypes';
import GovernmentSchemes from '../components/landing/GovernmentSchemes';
import Footer from '../components/landing/Footer';

const LandingPage = ({ onNavigateToLogin, onNavigateToRegister }) => {
  const [selectedUserType, setSelectedUserType] = useState(null);

  const handleGetStarted = () => {
    // Scroll to user types section
    document.getElementById('user-types')?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  const handleRegisterClick = (userType = null) => {
    setSelectedUserType(userType);
    onNavigateToRegister(userType);
  };

  const handleLoginClick = () => {
    onNavigateToLogin();
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        onLoginClick={handleLoginClick}
        onRegisterClick={() => handleRegisterClick()}
      />

      <main>
        <Hero onGetStartedClick={handleGetStarted} />
        <Features />
        <UserTypes onRegisterClick={handleRegisterClick} />
        <GovernmentSchemes />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;