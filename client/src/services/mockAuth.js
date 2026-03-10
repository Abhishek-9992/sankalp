// Mock Authentication Service for Demo Mode
// This allows testing login functionality without Firebase

const DEMO_USERS = {
  'public.user@demo.com': {
    id: 'user_public_001',
    email: 'public.user@demo.com',
    password: 'PublicUser123!',
    fullName: 'Rajesh Kumar',
    phoneNumber: '+91 9876543210',
    userType: 'public',
    isVerified: true,
    createdAt: new Date('2024-01-01'),
    language: 'en'
  },
  'gov.official@demo.com': {
    id: 'user_gov_001',
    email: 'gov.official@demo.com',
    password: 'GovOfficial123!',
    fullName: 'Dr. Priya Sharma',
    phoneNumber: '+91 9876543211',
    userType: 'government',
    governmentId: 'GOV123456789',
    isVerified: true,
    createdAt: new Date('2024-01-01'),
    language: 'en'
  },
  'school.admin@demo.com': {
    id: 'user_school_001',
    email: 'school.admin@demo.com',
    password: 'SchoolAdmin123!',
    schoolName: 'Government Primary School Delhi',
    schoolRegistrationNumber: 'DL/EDU/2023/001',
    headmasterPhone: '+91 9876543212',
    userType: 'school',
    isVerified: true,
    createdAt: new Date('2024-01-01'),
    language: 'en'
  },
  'ngo.volunteer@demo.com': {
    id: 'user_ngo_001',
    email: 'ngo.volunteer@demo.com',
    password: 'NGOVolunteer123!',
    fullName: 'Amit Singh',
    phoneNumber: '+91 9876543213',
    organizationName: 'Help India Foundation',
    userType: 'ngo',
    isVerified: true,
    createdAt: new Date('2024-01-01'),
    language: 'en'
  }
};

export class MockAuthService {
  static currentUser = null;

  // Mock sign in
  static async signInWithEmail(email, password) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = DEMO_USERS[email];

        if (user && user.password === password) {
          this.currentUser = { ...user };
          delete this.currentUser.password; // Remove password from response

          resolve({
            success: true,
            user: {
              uid: user.id,
              email: user.email,
              displayName: user.fullName || user.schoolName
            },
            userData: this.currentUser
          });
        } else {
          resolve({
            success: false,
            error: 'Invalid email or password'
          });
        }
      }, 1000); // Simulate network delay
    });
  }

  // Mock registration
  static async registerWithEmail(email, password, userData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (DEMO_USERS[email]) {
          resolve({
            success: false,
            error: 'User already exists'
          });
        } else {
          const newUser = {
            id: `user_${userData.userType}_${Date.now()}`,
            email,
            ...userData,
            isVerified: false,
            createdAt: new Date()
          };

          // In real app, this would be saved to database
          console.log('New user registered:', newUser);

          resolve({
            success: true,
            user: {
              uid: newUser.id,
              email: newUser.email,
              displayName: newUser.fullName || newUser.schoolName
            },
            userId: newUser.id,
            message: 'Registration successful. Please verify your email.'
          });
        }
      }, 1500);
    });
  }

  // Mock sign out
  static async signOut() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.currentUser = null;
        resolve({ success: true });
      }, 500);
    });
  }

  // Mock password reset
  static async resetPassword(email) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (DEMO_USERS[email]) {
          resolve({
            success: true,
            message: 'Password reset email sent successfully.'
          });
        } else {
          resolve({
            success: false,
            error: 'No user found with this email address.'
          });
        }
      }, 1000);
    });
  }

  // Mock OTP sending
  static async sendOTP(phoneNumber, recaptchaVerifier) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          verificationId: 'mock_verification_id_' + Date.now(),
          message: 'OTP sent successfully.'
        });
      }, 2000);
    });
  }

  // Mock OTP verification
  static async verifyOTP(verificationId, otp) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (otp === '123456') { // Demo OTP
          resolve({
            success: true,
            user: this.currentUser,
            message: 'Phone number verified successfully.'
          });
        } else {
          resolve({
            success: false,
            error: 'Invalid OTP. Please try again.'
          });
        }
      }, 1500);
    });
  }

  // Get current user
  static getCurrentUser() {
    return this.currentUser;
  }

  // Check if user is authenticated
  static isAuthenticated() {
    return !!this.currentUser;
  }

  // Get user role
  static async getUserRole() {
    return this.currentUser?.userType || null;
  }
}

// Mock issues data
export const MOCK_ISSUES = [
  {
    id: 'issue_001',
    title: 'Water Shortage in Slum Area',
    description: 'Severe water shortage affecting 200+ families in Dharavi slum. No clean water access for 3 days.',
    issueType: 'poverty',
    severity: 'high',
    status: 'reported',
    reportedBy: 'user_public_001',
    location: {
      latitude: 19.0176,
      longitude: 72.8562,
      address: 'Dharavi, Mumbai, Maharashtra',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India'
    },
    photos: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    viewCount: 45,
    upvotes: 12,
    tags: ['water', 'slum', 'urgent']
  },
  {
    id: 'issue_002',
    title: 'School Lacks Basic Infrastructure',
    description: 'Government school missing desks, blackboards, and proper toilets. 150 students affected.',
    issueType: 'education',
    severity: 'medium',
    status: 'in_progress',
    reportedBy: 'user_public_001',
    assignedTo: 'user_ngo_001',
    location: {
      latitude: 28.6139,
      longitude: 77.2090,
      address: 'New Delhi, Delhi',
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India'
    },
    photos: [],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
    viewCount: 78,
    upvotes: 23,
    tags: ['school', 'infrastructure', 'education']
  },
  {
    id: 'issue_003',
    title: 'Children Not Receiving Mid-Day Meals',
    description: 'Mid-day meal program stopped for 2 weeks. 80 children going hungry.',
    issueType: 'hunger',
    severity: 'critical',
    status: 'resolved',
    reportedBy: 'user_public_001',
    assignedTo: 'user_ngo_001',
    location: {
      latitude: 13.0827,
      longitude: 80.2707,
      address: 'Chennai, Tamil Nadu',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India'
    },
    photos: [],
    resolutionNotes: 'Meal program resumed. Local NGO coordinated with school administration.',
    resolvedAt: new Date('2024-01-14'),
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-14'),
    viewCount: 156,
    upvotes: 67,
    tags: ['meals', 'children', 'school', 'resolved']
  }
];