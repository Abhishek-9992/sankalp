import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatPhoneNumber } from '../../utils/helpers';
import { Shield, ArrowLeft, RefreshCw } from 'lucide-react';

const OTPVerification = ({
  userData,
  onBackToRegister,
  onVerificationSuccess
}) => {
  const { t } = useLanguage();
  const { sendOTP, verifyOTP } = useAuth();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    // Initialize reCAPTCHA and send initial OTP
    initializeOTPSending();
  }, []);

  useEffect(() => {
    // Countdown timer for resend OTP
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const initializeOTPSending = async () => {
    try {
      setIsLoading(true);

      // Initialize reCAPTCHA
      const recaptchaVerifier = window.recaptchaVerifier ||
        new window.firebase.auth.RecaptchaVerifier('recaptcha-container', {
          size: 'invisible',
          callback: () => {
            console.log('reCAPTCHA solved');
          }
        });

      const result = await sendOTP(userData.phoneNumber, recaptchaVerifier);

      if (result.success) {
        setVerificationId(result.verificationId);
      } else {
        setError(result.error || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      setError('Failed to initialize OTP verification. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Clear error when user starts typing
    if (error) setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtp(newOtp);

    // Focus the last filled input or the first empty one
    const lastFilledIndex = newOtp.findIndex(digit => !digit);
    const focusIndex = lastFilledIndex === -1 ? 5 : Math.max(0, lastFilledIndex - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await verifyOTP(verificationId, otpCode);

      if (result.success) {
        onVerificationSuccess(userData);
      } else {
        setError(result.error || 'Invalid OTP. Please try again.');
        // Clear OTP on error
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      setError('Verification failed. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setIsResending(true);
    setError('');
    setOtp(['', '', '', '', '', '']);

    try {
      const recaptchaVerifier = window.recaptchaVerifier;
      const result = await sendOTP(userData.phoneNumber, recaptchaVerifier);

      if (result.success) {
        setVerificationId(result.verificationId);
        setCountdown(30);
        setCanResend(false);
        inputRefs.current[0]?.focus();
      } else {
        setError(result.error || 'Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBackToRegister}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Registration
        </Button>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {t('auth.register.otpVerification')}
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {t('auth.register.enterOtp')}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {formatPhoneNumber(userData.phoneNumber)}
            </p>
          </CardHeader>

          <CardContent>
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-6">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* OTP Input */}
            <div className="space-y-6">
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-12 text-center text-lg font-semibold border-2 focus:border-primary"
                    disabled={isLoading}
                  />
                ))}
              </div>

              {/* Verify Button */}
              <Button
                onClick={handleVerifyOTP}
                className="w-full"
                size="lg"
                disabled={isLoading || otp.join('').length !== 6}
              >
                {isLoading ? 'Verifying...' : t('auth.register.verify')}
              </Button>

              {/* Resend OTP */}
              <div className="text-center">
                {canResend ? (
                  <Button
                    variant="ghost"
                    onClick={handleResendOTP}
                    disabled={isResending}
                    className="text-primary hover:text-primary/80"
                  >
                    {isResending ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      t('auth.register.resendOtp')
                    )}
                  </Button>
                ) : (
                  <p className="text-sm text-gray-500">
                    Resend OTP in {countdown} seconds
                  </p>
                )}
              </div>
            </div>

            {/* reCAPTCHA container */}
            <div id="recaptcha-container"></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OTPVerification;