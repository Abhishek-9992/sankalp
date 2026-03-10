// Helper utility functions

// Format phone number for display
export const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
};

// Format date for display
export const formatDate = (date) => {
  if (!date) return '';

  if (date.toDate) {
    // Firestore timestamp
    return date.toDate().toLocaleDateString('en-IN');
  }

  if (date instanceof Date) {
    return date.toLocaleDateString('en-IN');
  }

  return new Date(date).toLocaleDateString('en-IN');
};

// Format date and time for display
export const formatDateTime = (date) => {
  if (!date) return '';

  if (date.toDate) {
    // Firestore timestamp
    return date.toDate().toLocaleString('en-IN');
  }

  if (date instanceof Date) {
    return date.toLocaleString('en-IN');
  }

  return new Date(date).toLocaleString('en-IN');
};

// Calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

// Get user's current location
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
};

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Generate random ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Capitalize first letter of each word
export const capitalizeWords = (str) => {
  return str.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

// Convert file to base64
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// Validate file type and size
export const validateFile = (file, allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'], maxSize = 5 * 1024 * 1024) => {
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Please upload JPEG or PNG images.' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: `File size too large. Maximum size is ${maxSize / (1024 * 1024)}MB.` };
  }

  return { valid: true };
};

// Get severity color for issues
export const getSeverityColor = (severity) => {
  switch (severity) {
    case 'low':
      return 'text-green-600 bg-green-100';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100';
    case 'high':
      return 'text-orange-600 bg-orange-100';
    case 'critical':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

// Get status color for issues
export const getStatusColor = (status) => {
  switch (status) {
    case 'reported':
      return 'text-blue-600 bg-blue-100';
    case 'in_progress':
      return 'text-yellow-600 bg-yellow-100';
    case 'resolved':
      return 'text-green-600 bg-green-100';
    case 'closed':
      return 'text-gray-600 bg-gray-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

// Format user type for display
export const formatUserType = (userType) => {
  switch (userType) {
    case 'public':
      return 'Public User';
    case 'government':
      return 'Government Official';
    case 'school':
      return 'School';
    case 'ngo':
      return 'NGO/Volunteer';
    default:
      return 'Unknown';
  }
};

// Local storage helpers
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }
};