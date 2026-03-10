// API service for backend communication
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  static async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  static async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  static async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: data,
    });
  }

  static async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data,
    });
  }

  static async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: data,
    });
  }

  static async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Issue-specific API operations
export class IssueService {
  static async createIssue(issueData) {
    try {
      const issue = await ApiService.post('/issues', issueData);
      return issue._id;
    } catch (error) {
      console.error('Error creating issue:', error);
      throw error;
    }
  }

  static async getAll() {
    try {
      return await ApiService.get('/issues');
    } catch (error) {
      console.error('Error fetching issues:', error);
      return [];
    }
  }

  static async getIssuesByReporter(userId) {
    try {
      return await ApiService.get(`/issues/reporter/${userId}`);
    } catch (error) {
      console.error('Error fetching user issues:', error);
      return [];
    }
  }

  static async getIssuesByAssignee(userId) {
    try {
      return await ApiService.get(`/issues/assignee/${userId}`);
    } catch (error) {
      console.error('Error fetching assigned issues:', error);
      return [];
    }
  }

  static async getIssuesByLocation(latitude, longitude, radiusKm = 10) {
    try {
      return await ApiService.get(`/issues/location/${latitude}/${longitude}/${radiusKm}`);
    } catch (error) {
      console.error('Error fetching issues by location:', error);
      return [];
    }
  }

  static async getIssuesByType(issueType) {
    try {
      return await ApiService.get(`/issues/type/${issueType}`);
    } catch (error) {
      console.error('Error fetching issues by type:', error);
      return [];
    }
  }

  static async getIssuesBySeverity(severity) {
    try {
      return await ApiService.get(`/issues/severity/${severity}`);
    } catch (error) {
      console.error('Error fetching issues by severity:', error);
      return [];
    }
  }

  static async getById(issueId) {
    try {
      return await ApiService.get(`/issues/${issueId}`);
    } catch (error) {
      console.error('Error fetching issue:', error);
      throw error;
    }
  }

  static async updateIssue(issueId, updateData) {
    try {
      return await ApiService.put(`/issues/${issueId}`, updateData);
    } catch (error) {
      console.error('Error updating issue:', error);
      throw error;
    }
  }

  static async updateIssueStatus(issueId, status, resolutionData = {}) {
    try {
      return await ApiService.patch(`/issues/${issueId}/status`, {
        status,
        ...resolutionData
      });
    } catch (error) {
      console.error('Error updating issue status:', error);
      throw error;
    }
  }

  static async upvoteIssue(issueId) {
    try {
      return await ApiService.patch(`/issues/${issueId}/upvote`);
    } catch (error) {
      console.error('Error upvoting issue:', error);
      throw error;
    }
  }

  static async deleteIssue(issueId) {
    try {
      return await ApiService.delete(`/issues/${issueId}`);
    } catch (error) {
      console.error('Error deleting issue:', error);
      throw error;
    }
  }
}

// User-specific API operations
export class UserService {
  static async createUser(userData) {
    try {
      return await ApiService.post('/users', userData);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async getById(userId) {
    try {
      return await ApiService.get(`/users/${userId}`);
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  static async updateUser(userId, updateData) {
    try {
      return await ApiService.put(`/users/${userId}`, updateData);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  static async verifyUser(userId) {
    try {
      return await ApiService.patch(`/users/${userId}/verify`);
    } catch (error) {
      console.error('Error verifying user:', error);
      throw error;
    }
  }

  static async login(email, password) {
    try {
      return await ApiService.post('/users/auth/login', { email, password });
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }
}

// Health check
export const checkApiHealth = async () => {
  try {
    return await ApiService.get('/health');
  } catch (error) {
    console.error('API health check failed:', error);
    return { status: 'ERROR', message: error.message };
  }
};

export default ApiService;
