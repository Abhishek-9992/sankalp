import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  PhoneAuthProvider,
  signInWithCredential,
  RecaptchaVerifier
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { UserService } from './database';
import { USER_TYPES } from '../lib/schemas';

export class AuthService {
  // Initialize reCAPTCHA verifier for phone authentication
  static initializeRecaptcha(containerId) {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: (response) => {
          console.log('reCAPTCHA solved');
        }
      });
    }
    return window.recaptchaVerifier;
  }

  // Register new user with email and password
  static async registerWithEmail(email, password, userData) {
    try {
      // Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name
      await updateProfile(user, {
        displayName: userData.fullName
      });

      // Send email verification
      await sendEmailVerification(user);

      // Create user document in Firestore
      const userId = await UserService.createUser({
        ...userData,
        email: email,
        uid: user.uid,
        isVerified: false
      });

      return {
        success: true,
        user: user,
        userId: userId,
        message: 'Registration successful. Please verify your email.'
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Sign in with email and password
  static async signInWithEmail(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user data from Firestore
      const userData = await UserService.getUserByEmail(email);

      return {
        success: true,
        user: user,
        userData: userData
      };
    } catch (error) {
      console.error('Sign in error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Sign out
  static async signOut() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Send password reset email
  static async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
        message: 'Password reset email sent successfully.'
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Send OTP to phone number
  static async sendOTP(phoneNumber, recaptchaVerifier) {
    try {
      const provider = new PhoneAuthProvider(auth);
      const verificationId = await provider.verifyPhoneNumber(phoneNumber, recaptchaVerifier);

      return {
        success: true,
        verificationId: verificationId,
        message: 'OTP sent successfully.'
      };
    } catch (error) {
      console.error('OTP send error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verify OTP
  static async verifyOTP(verificationId, otp) {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      const userCredential = await signInWithCredential(auth, credential);

      return {
        success: true,
        user: userCredential.user,
        message: 'Phone number verified successfully.'
      };
    } catch (error) {
      console.error('OTP verification error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get current user
  static getCurrentUser() {
    return auth.currentUser;
  }

  // Check if user is authenticated
  static isAuthenticated() {
    return !!auth.currentUser;
  }

  // Get user role/type
  static async getUserRole() {
    const user = auth.currentUser;
    if (user) {
      const userData = await UserService.getUserByEmail(user.email);
      return userData?.userType || null;
    }
    return null;
  }
}