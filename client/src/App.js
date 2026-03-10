import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import PublicDashboard from './pages/dashboard/PublicDashboard';

// Demo mode banner component
const DemoModeBanner = () => {
  const isDemoMode = process.env.REACT_APP_FIREBASE_API_KEY === 'demo_api_key';

  if (!isDemoMode) return null;

  return (
    <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2 text-center">
      <p className="text-sm text-yellow-800">
        🚀 <strong>Demo Mode</strong> - Use credentials from CREDENTIALS.md to test login functionality
      </p>
    </div>
  );
};

// Main app content component
const AppContent = () => {
  const { currentUser, userData, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedUserType, setSelectedUserType] = useState(null);

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show dashboard
  if (currentUser && userData) {
    switch (userData.userType) {
      case 'public':
        return <PublicDashboard />;
      case 'government':
        // TODO: Implement GovernmentDashboard
        return <div className="p-8 text-center">Government Dashboard - Coming Soon!</div>;
      case 'school':
        // TODO: Implement SchoolDashboard
        return <div className="p-8 text-center">School Dashboard - Coming Soon!</div>;
      case 'ngo':
        // TODO: Implement NGODashboard
        return <div className="p-8 text-center">NGO Dashboard - Coming Soon!</div>;
      default:
        return <PublicDashboard />;
    }
  }

  const handleNavigateToLogin = () => {
    setCurrentPage('login');
  };

  const handleNavigateToRegister = (userType = null) => {
    setSelectedUserType(userType);
    setCurrentPage('register');
  };

  const handleNavigateToLanding = () => {
    setCurrentPage('landing');
    setSelectedUserType(null);
  };

  const handleNavigateToForgotPassword = () => {
    // TODO: Implement forgot password page
    console.log('Navigate to forgot password');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <LoginPage
            onBackToLanding={handleNavigateToLanding}
            onNavigateToRegister={() => handleNavigateToRegister()}
            onNavigateToForgotPassword={handleNavigateToForgotPassword}
          />
        );
      case 'register':
        return (
          <RegisterPage
            initialUserType={selectedUserType}
            onBackToLanding={handleNavigateToLanding}
            onNavigateToLogin={handleNavigateToLogin}
          />
        );
      default:
        return (
          <LandingPage
            onNavigateToLogin={handleNavigateToLogin}
            onNavigateToRegister={handleNavigateToRegister}
          />
        );
    }
  };

  return (
    <div className="App">
      <DemoModeBanner />
      {renderCurrentPage()}
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
