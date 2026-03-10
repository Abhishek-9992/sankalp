// Validation utility functions

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  // Indian phone number validation (10 digits)
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateGovernmentId = (govId) => {
  // Basic validation for government ID (can be enhanced based on specific requirements)
  return govId && govId.length >= 6;
};

export const validateSchoolRegistration = (regNumber) => {
  // Basic validation for school registration number
  return regNumber && regNumber.length >= 4;
};

export const validateName = (name) => {
  // Name should be at least 2 characters and contain only letters and spaces
  const nameRegex = /^[a-zA-Z\s]{2,}$/;
  return nameRegex.test(name.trim());
};

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

// Form validation schemas
export const publicUserValidation = {
  fullName: (value) => {
    if (!validateRequired(value)) return 'Full name is required';
    if (!validateName(value)) return 'Please enter a valid name';
    return null;
  },
  email: (value) => {
    if (!validateRequired(value)) return 'Email is required';
    if (!validateEmail(value)) return 'Please enter a valid email address';
    return null;
  },
  phoneNumber: (value) => {
    if (!validateRequired(value)) return 'Phone number is required';
    if (!validatePhone(value)) return 'Please enter a valid 10-digit phone number';
    return null;
  },
  password: (value) => {
    if (!validateRequired(value)) return 'Password is required';
    if (!validatePassword(value)) return 'Password must be at least 8 characters with uppercase, lowercase, and number';
    return null;
  }
};

export const governmentUserValidation = {
  ...publicUserValidation,
  governmentId: (value) => {
    if (!validateRequired(value)) return 'Government ID is required';
    if (!validateGovernmentId(value)) return 'Please enter a valid government ID';
    return null;
  }
};

export const schoolUserValidation = {
  schoolName: (value) => {
    if (!validateRequired(value)) return 'School name is required';
    if (value.trim().length < 3) return 'School name must be at least 3 characters';
    return null;
  },
  schoolRegistrationNumber: (value) => {
    if (!validateRequired(value)) return 'School registration number is required';
    if (!validateSchoolRegistration(value)) return 'Please enter a valid registration number';
    return null;
  },
  email: (value) => {
    if (!validateRequired(value)) return 'Email is required';
    if (!validateEmail(value)) return 'Please enter a valid email address';
    return null;
  },
  headmasterPhone: (value) => {
    if (!validateRequired(value)) return 'Headmaster phone number is required';
    if (!validatePhone(value)) return 'Please enter a valid 10-digit phone number';
    return null;
  }
};

export const ngoUserValidation = {
  fullName: (value) => {
    if (!validateRequired(value)) return 'Name is required';
    if (!validateName(value)) return 'Please enter a valid name';
    return null;
  },
  email: (value) => {
    if (!validateRequired(value)) return 'Email is required';
    if (!validateEmail(value)) return 'Please enter a valid email address';
    return null;
  },
  phoneNumber: (value) => {
    if (!validateRequired(value)) return 'Phone number is required';
    if (!validatePhone(value)) return 'Please enter a valid 10-digit phone number';
    return null;
  },
  organizationName: (value) => {
    // Optional field, but if provided should be valid
    if (value && value.trim().length < 2) return 'Organization name must be at least 2 characters';
    return null;
  }
};

// Generic form validator
export const validateForm = (formData, validationSchema) => {
  const errors = {};
  let isValid = true;

  Object.keys(validationSchema).forEach(field => {
    const validator = validationSchema[field];
    const error = validator(formData[field]);
    if (error) {
      errors[field] = error;
      isValid = false;
    }
  });

  return { isValid, errors };
};