import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserService } from '../services/database';
import { MockAuthService } from '../services/mockAuth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [useMockAuth] = useState(true); // Always use mock auth

  useEffect(() => {
    // Always use mock authentication for demo mode
    console.log('Using mock authentication for demo mode');
    setLoading(false);
  }, []);

  // Register new user
  const register = async (email, password, userData) => {
    setLoading(true);
    try {
      const result = await MockAuthService.registerWithEmail(email, password, userData);

      if (result.success) {
        // For mock auth, set user data directly
        setCurrentUser(result.user);
        setUserData(result.userData || userData);
        setUserRole(userData.userType);
      }

      return result;
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign in user
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      // Try API login first
      try {
        const result = await UserService.getUserByEmail(email);
        if (result && result.user) {
          setCurrentUser(result.user);
          setUserData(result.user);
          setUserRole(result.user?.role);
          return { success: true, user: result.user };
        }
      } catch (apiError) {
        console.log('API login failed, falling back to mock auth');
      }

      // Fallback to mock auth
      const result = await MockAuthService.signInWithEmail(email, password);
      if (result.success) {
        setCurrentUser(result.user);
        setUserData(result.userData);
        setUserRole(result.userData?.userType);
      }
      return result;
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Sign out user
  const signOut = async () => {
    setLoading(true);
    try {
      const result = await MockAuthService.signOut();

      if (result.success) {
        setCurrentUser(null);
        setUserData(null);
        setUserRole(null);
      }

      return result;
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    return await MockAuthService.resetPassword(email);
  };

  // Send OTP
  const sendOTP = async (phoneNumber, recaptchaVerifier) => {
    return await MockAuthService.sendOTP(phoneNumber, recaptchaVerifier);
  };

  // Verify OTP
  const verifyOTP = async (verificationId, otp) => {
    return await MockAuthService.verifyOTP(verificationId, otp);
  };

  // Update user profile
  const updateUserProfile = async (profileData) => {
    if (userData) {
      try {
        await UserService.updateUserProfile(userData.id, profileData);
        // Refresh user data
        const updatedUserData = await UserService.getUserByEmail(currentUser.email);
        setUserData(updatedUserData);
        return { success: true };
      } catch (error) {
        console.error('Profile update error:', error);
        return { success: false, error: error.message };
      }
    }
    return { success: false, error: 'No user data available' };
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return userRole === role;
  };

  // Check if user is verified
  const isVerified = () => {
    return userData?.isVerified || false;
  };

  const value = {
    currentUser,
    userData,
    userRole,
    loading,
    register,
    signIn,
    signOut,
    resetPassword,
    sendOTP,
    verifyOTP,
    updateUserProfile,
    hasRole,
    isVerified
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};