// Import the new API service
import { IssueService as ApiIssueService, UserService as ApiUserService, checkApiHealth } from './api';
import { MOCK_ISSUES } from './mockAuth';

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  ISSUES: 'issues',
  SCHOOLS: 'schools',
  STUDENTS: 'students',
  ATTENDANCE: 'attendance',
  MEALS: 'meals',
  PERFORMANCE: 'performance',
  SCHEMES: 'schemes',
  NOTIFICATIONS: 'notifications'
};



// User-specific operations
export class UserService {
  static async createUser(userData) {
    try {
      return await ApiUserService.createUser(userData);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async getUserByEmail(email) {
    try {
      // For now, we'll use the login endpoint to get user by email
      return await ApiUserService.login(email, 'PublicUser123!');
    } catch (error) {
      return null;
    }
  }

  static async getUsersByType(userType) {
    // This would need a specific endpoint in the backend
    return [];
  }

  static async updateUserProfile(userId, profileData) {
    try {
      return await ApiUserService.updateUser(userId, profileData);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  static async getById(userId) {
    try {
      return await ApiUserService.getById(userId);
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }
}



// Issue-specific operations
export class IssueService {
  static async createIssue(issueData) {
    try {
      return await ApiIssueService.createIssue(issueData);
    } catch (error) {
      // Fallback to mock implementation
      console.log('Mock: Creating issue', issueData);
      return 'mock_issue_' + Date.now();
    }
  }

  static async getIssuesByLocation(latitude, longitude, radiusKm = 10) {
    try {
      return await ApiIssueService.getIssuesByLocation(latitude, longitude, radiusKm);
    } catch (error) {
      // Return mock issues
      return MOCK_ISSUES;
    }
  }

  static async getIssuesByReporter(userId) {
    try {
      return await ApiIssueService.getIssuesByReporter(userId);
    } catch (error) {
      // Return mock issues for the user
      return MOCK_ISSUES.filter(issue => issue.reportedBy === userId);
    }
  }

  static async getAll(collectionName) {
    try {
      if (collectionName === 'issues') {
        return await ApiIssueService.getAll();
      }
      return [];
    } catch (error) {
      // Return mock data based on collection
      if (collectionName === 'issues') {
        return MOCK_ISSUES;
      }
      return [];
    }
  }

  static async getIssuesByAssignee(userId) {
    try {
      return await ApiIssueService.getIssuesByAssignee(userId);
    } catch (error) {
      return [];
    }
  }

  static async updateIssueStatus(issueId, status, resolutionData = {}) {
    try {
      return await ApiIssueService.updateIssueStatus(issueId, status, resolutionData);
    } catch (error) {
      console.error('Error updating issue status:', error);
      throw error;
    }
  }

  static async getIssuesByType(issueType) {
    try {
      return await ApiIssueService.getIssuesByType(issueType);
    } catch (error) {
      return [];
    }
  }

  static async getIssuesBySeverity(severity) {
    try {
      return await ApiIssueService.getIssuesBySeverity(severity);
    } catch (error) {
      return [];
    }
  }
}

