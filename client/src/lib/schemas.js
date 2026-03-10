// Database Schema Definitions for Firestore Collections

// User Types
export const USER_TYPES = {
  PUBLIC: 'public',
  GOVERNMENT: 'government',
  SCHOOL: 'school',
  NGO: 'ngo'
};

// Issue Types
export const ISSUE_TYPES = {
  POVERTY: 'poverty',
  EDUCATION: 'education',
  HUNGER: 'hunger'
};

// Issue Severity Levels
export const SEVERITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Issue Status
export const ISSUE_STATUS = {
  REPORTED: 'reported',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
};

// User Schema
export const userSchema = {
  // Common fields for all user types
  id: '', // Auto-generated document ID
  email: '',
  phoneNumber: '',
  fullName: '',
  userType: '', // One of USER_TYPES
  isVerified: false,
  createdAt: null, // Timestamp
  updatedAt: null, // Timestamp

  // Government-specific fields
  governmentId: '', // Only for government users

  // School-specific fields
  schoolName: '', // Only for school users
  schoolRegistrationNumber: '', // Only for school users
  headmasterPhone: '', // Only for school users

  // NGO-specific fields
  organizationName: '', // Only for NGO users (optional)

  // Profile and settings
  profilePicture: '',
  language: 'en', // Default language
  notificationSettings: {
    email: true,
    sms: true,
    push: true
  }
};

// Issue Schema
export const issueSchema = {
  id: '', // Auto-generated document ID
  reportedBy: '', // User ID who reported the issue
  issueType: '', // One of ISSUE_TYPES
  severity: '', // One of SEVERITY_LEVELS
  status: '', // One of ISSUE_STATUS
  title: '',
  description: '',
  location: {
    latitude: 0,
    longitude: 0,
    address: '',
    city: '',
    state: '',
    country: ''
  },
  photos: [], // Array of photo URLs
  assignedTo: '', // NGO/Volunteer user ID (optional)
  resolutionNotes: '',
  resolutionPhotos: [], // Array of resolution photo URLs
  createdAt: null, // Timestamp
  updatedAt: null, // Timestamp
  resolvedAt: null, // Timestamp (when resolved)

  // Tracking and analytics
  viewCount: 0,
  upvotes: 0,
  tags: [] // Array of relevant tags
};

// School Schema
export const schoolSchema = {
  id: '', // Auto-generated document ID
  schoolName: '',
  registrationNumber: '',
  address: {
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: ''
  },
  location: {
    latitude: 0,
    longitude: 0
  },
  headmaster: {
    name: '',
    phone: '',
    email: ''
  },
  teachers: [], // Array of teacher user IDs
  students: [], // Array of student records
  createdAt: null,
  updatedAt: null,

  // School statistics
  totalStudents: 0,
  totalTeachers: 0,
  isActive: true
};

// Student Schema
export const studentSchema = {
  id: '', // Auto-generated document ID
  schoolId: '', // Reference to school
  studentId: '', // School-specific student ID
  name: '',
  class: '',
  section: '',
  rollNumber: '',
  dateOfBirth: null,
  gender: '',
  parentContact: {
    fatherName: '',
    motherName: '',
    phone: '',
    email: '',
    address: ''
  },
  healthData: {
    height: 0, // in cm
    weight: 0, // in kg
    bmi: 0,
    lastBMIUpdate: null,
    medicalConditions: []
  },
  attendanceRecord: [], // Array of attendance records
  mealRecord: [], // Array of meal records
  createdAt: null,
  updatedAt: null,
  isActive: true
};

// Attendance Schema
export const attendanceSchema = {
  id: '', // Auto-generated document ID
  schoolId: '',
  studentId: '',
  teacherId: '', // Teacher who marked attendance
  date: null, // Date of attendance
  isPresent: false,
  class: '',
  section: '',
  createdAt: null,
  notes: ''
};

// Meal Distribution Schema
export const mealSchema = {
  id: '', // Auto-generated document ID
  schoolId: '',
  date: null, // Date of meal distribution
  mealType: '', // breakfast, lunch, dinner
  studentsServed: 0,
  studentsPresent: 0,
  photos: [], // Array of meal distribution photos
  location: {
    latitude: 0,
    longitude: 0
  },
  verificationStatus: 'pending', // pending, verified, rejected
  verifiedBy: '', // Government official user ID
  verificationNotes: '',
  createdBy: '', // Teacher/School user ID
  createdAt: null,
  updatedAt: null,

  // YOLO analysis results
  aiAnalysis: {
    detectedStudents: 0,
    confidence: 0,
    analysisTimestamp: null,
    analysisResults: []
  }
};

// NGO/Volunteer Performance Schema
export const performanceSchema = {
  id: '', // Auto-generated document ID
  userId: '', // NGO/Volunteer user ID
  issuesResolved: 0,
  totalPoints: 0,
  weeklyPoints: 0,
  monthlyPoints: 0,
  rank: 0,
  badges: [], // Array of earned badges
  awardsReceived: [],
  lastActive: null,
  joinedAt: null,

  // Performance metrics
  averageResolutionTime: 0, // in hours
  successRate: 0, // percentage
  communityRating: 0, // 1-5 stars
  totalRatings: 0
};

// Government Scheme Schema
export const schemeSchema = {
  id: '', // Auto-generated document ID
  name: '',
  description: '',
  category: '', // poverty, education, hunger
  eligibilityCriteria: [],
  benefits: [],
  applicationProcess: '',
  requiredDocuments: [],
  contactInfo: {
    phone: '',
    email: '',
    website: '',
    office: ''
  },
  isActive: true,
  createdAt: null,
  updatedAt: null,

  // Multi-language support
  translations: {
    // language_code: { name, description, etc. }
  }
};

// Notification Schema
export const notificationSchema = {
  id: '', // Auto-generated document ID
  userId: '', // Recipient user ID
  type: '', // issue_update, scheme_alert, performance_update, etc.
  title: '',
  message: '',
  data: {}, // Additional data specific to notification type
  isRead: false,
  createdAt: null,
  expiresAt: null // Optional expiration date
};