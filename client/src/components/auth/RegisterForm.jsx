import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  validateForm,
  publicUserValidation,
  governmentUserValidation,
  schoolUserValidation,
  ngoUserValidation
} from '../../utils/validation';
import { USER_TYPES } from '../../lib/schemas';
import {
  User,
  Shield,
  GraduationCap,
  Heart,
  ArrowLeft,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Lock,
  FileText,
  Building
} from 'lucide-react';

const RegisterForm = ({
  initialUserType = null,
  onBackToLanding,
  onNavigateToLogin,
  onNavigateToOTPVerification
}) => {
  const { t } = useLanguage();
  const { register } = useAuth();

  const [selectedUserType, setSelectedUserType] = useState(initialUserType);
  const [formData, setFormData] = useState({
    userType: initialUserType || '',
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    // Government specific
    governmentId: '',
    // School specific
    schoolName: '',
    schoolRegistrationNumber: '',
    headmasterPhone: '',
    // NGO specific
    organizationName: '',
    // Terms
    agreeTerms: false
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const userTypeOptions = [
    {
      type: USER_TYPES.PUBLIC,
      icon: User,
      title: t('landing.userTypes.public.title'),
      description: t('landing.userTypes.public.description'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      type: USER_TYPES.GOVERNMENT,
      icon: Shield,
      title: t('landing.userTypes.government.title'),
      description: t('landing.userTypes.government.description'),
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      type: USER_TYPES.SCHOOL,
      icon: GraduationCap,
      title: t('landing.userTypes.school.title'),
      description: t('landing.userTypes.school.description'),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      type: USER_TYPES.NGO,
      icon: Heart,
      title: t('landing.userTypes.ngo.title'),
      description: t('landing.userTypes.ngo.description'),
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  useEffect(() => {
    if (initialUserType) {
      setSelectedUserType(initialUserType);
      setFormData(prev => ({
        ...prev,
        userType: initialUserType
      }));
    }
  }, [initialUserType]);

  const handleUserTypeSelect = (userType) => {
    setSelectedUserType(userType);
    setFormData(prev => ({
      ...prev,
      userType
    }));
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const getValidationSchema = () => {
    switch (selectedUserType) {
      case USER_TYPES.GOVERNMENT:
        return governmentUserValidation;
      case USER_TYPES.SCHOOL:
        return schoolUserValidation;
      case USER_TYPES.NGO:
        return ngoUserValidation;
      default:
        return publicUserValidation;
    }
  };

  const validateFormData = () => {
    const schema = getValidationSchema();
    const { isValid, errors: validationErrors } = validateForm(formData, schema);

    // Additional validations
    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeTerms) {
      validationErrors.agreeTerms = 'You must agree to the terms and conditions';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFormData()) {
      return;
    }

    setIsLoading(true);

    try {
      const userData = {
        userType: selectedUserType,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        // Add type-specific fields
        ...(selectedUserType === USER_TYPES.GOVERNMENT && {
          governmentId: formData.governmentId
        }),
        ...(selectedUserType === USER_TYPES.SCHOOL && {
          schoolName: formData.schoolName,
          schoolRegistrationNumber: formData.schoolRegistrationNumber,
          headmasterPhone: formData.headmasterPhone
        }),
        ...(selectedUserType === USER_TYPES.NGO && {
          organizationName: formData.organizationName
        })
      };

      const result = await register(formData.email, formData.password, userData);

      if (result.success) {
        // Navigate to OTP verification
        onNavigateToOTPVerification({
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          userType: selectedUserType
        });
      } else {
        setErrors({
          general: result.error || 'Registration failed. Please try again.'
        });
      }
    } catch (error) {
      setErrors({
        general: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If no user type is selected, show user type selection
  if (!selectedUserType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={onBackToLanding}
            className="mb-6 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold text-gray-900">
                {t('auth.register.title')}
              </CardTitle>
              <p className="text-gray-600 mt-2">
                {t('auth.register.selectUserType')}
              </p>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userTypeOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <Card
                      key={option.type}
                      className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50"
                      onClick={() => handleUserTypeSelect(option.type)}
                    >
                      <CardContent className="p-6 text-center">
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${option.bgColor} mb-4`}>
                          <IconComponent className={`h-8 w-8 ${option.color}`} />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {option.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {option.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  {t('auth.register.hasAccount')}{' '}
                  <button
                    onClick={onNavigateToLogin}
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    {t('auth.register.signIn')}
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Registration form for selected user type
  const selectedOption = userTypeOptions.find(option => option.type === selectedUserType);
  const IconComponent = selectedOption?.icon || User;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => setSelectedUserType(null)}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Change User Type
        </Button>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className={`mx-auto w-16 h-16 ${selectedOption?.bgColor} rounded-full flex items-center justify-center mb-4`}>
              <IconComponent className={`h-8 w-8 ${selectedOption?.color}`} />
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {t('auth.register.title')}
              </CardTitle>
              <Badge variant="outline">
                {selectedOption?.title}
              </Badge>
            </div>
            <p className="text-gray-600">
              {t('auth.register.subtitle')}
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* General Error */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}

              {/* Common Fields */}
              {selectedUserType !== USER_TYPES.SCHOOL && (
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                    {t('auth.register.fullName')}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`pl-10 ${errors.fullName ? 'border-red-500' : ''}`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-sm text-red-600">{errors.fullName}</p>
                  )}
                </div>
              )}

              {/* School Name (for schools) */}
              {selectedUserType === USER_TYPES.SCHOOL && (
                <div className="space-y-2">
                  <label htmlFor="schoolName" className="text-sm font-medium text-gray-700">
                    {t('auth.register.schoolName')}
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="schoolName"
                      name="schoolName"
                      value={formData.schoolName}
                      onChange={handleInputChange}
                      className={`pl-10 ${errors.schoolName ? 'border-red-500' : ''}`}
                      placeholder="Enter school name"
                    />
                  </div>
                  {errors.schoolName && (
                    <p className="text-sm text-red-600">{errors.schoolName}</p>
                  )}
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  {t('auth.register.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="Enter your email address"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                  {selectedUserType === USER_TYPES.SCHOOL ? t('auth.register.headmasterPhone') : t('auth.register.phoneNumber')}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="phoneNumber"
                    name={selectedUserType === USER_TYPES.SCHOOL ? "headmasterPhone" : "phoneNumber"}
                    value={selectedUserType === USER_TYPES.SCHOOL ? formData.headmasterPhone : formData.phoneNumber}
                    onChange={handleInputChange}
                    className={`pl-10 ${errors.phoneNumber || errors.headmasterPhone ? 'border-red-500' : ''}`}
                    placeholder="Enter 10-digit phone number"
                  />
                </div>
                {(errors.phoneNumber || errors.headmasterPhone) && (
                  <p className="text-sm text-red-600">{errors.phoneNumber || errors.headmasterPhone}</p>
                )}
              </div>

              {/* Type-specific fields */}
              {selectedUserType === USER_TYPES.GOVERNMENT && (
                <div className="space-y-2">
                  <label htmlFor="governmentId" className="text-sm font-medium text-gray-700">
                    {t('auth.register.governmentId')}
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="governmentId"
                      name="governmentId"
                      value={formData.governmentId}
                      onChange={handleInputChange}
                      className={`pl-10 ${errors.governmentId ? 'border-red-500' : ''}`}
                      placeholder="Enter government ID"
                    />
                  </div>
                  {errors.governmentId && (
                    <p className="text-sm text-red-600">{errors.governmentId}</p>
                  )}
                </div>
              )}

              {selectedUserType === USER_TYPES.SCHOOL && (
                <div className="space-y-2">
                  <label htmlFor="schoolRegistrationNumber" className="text-sm font-medium text-gray-700">
                    {t('auth.register.schoolRegistration')}
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="schoolRegistrationNumber"
                      name="schoolRegistrationNumber"
                      value={formData.schoolRegistrationNumber}
                      onChange={handleInputChange}
                      className={`pl-10 ${errors.schoolRegistrationNumber ? 'border-red-500' : ''}`}
                      placeholder="Enter registration number"
                    />
                  </div>
                  {errors.schoolRegistrationNumber && (
                    <p className="text-sm text-red-600">{errors.schoolRegistrationNumber}</p>
                  )}
                </div>
              )}

              {selectedUserType === USER_TYPES.NGO && (
                <div className="space-y-2">
                  <label htmlFor="organizationName" className="text-sm font-medium text-gray-700">
                    {t('auth.register.organizationName')}
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="organizationName"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      className={`pl-10 ${errors.organizationName ? 'border-red-500' : ''}`}
                      placeholder="Enter organization name (optional)"
                    />
                  </div>
                  {errors.organizationName && (
                    <p className="text-sm text-red-600">{errors.organizationName}</p>
                  )}
                </div>
              )}

              {/* Password Fields (only for non-school users) */}
              {selectedUserType !== USER_TYPES.SCHOOL && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                      {t('auth.register.password')}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                      {t('auth.register.confirmPassword')}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                </>
              )}

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="agreeTerms" className="text-sm text-gray-700">
                  {t('auth.register.agreeTerms')}
                </label>
              </div>
              {errors.agreeTerms && (
                <p className="text-sm text-red-600">{errors.agreeTerms}</p>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : t('auth.register.createAccount')}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {t('auth.register.hasAccount')}{' '}
                <button
                  onClick={onNavigateToLogin}
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  {t('auth.register.signIn')}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterForm;