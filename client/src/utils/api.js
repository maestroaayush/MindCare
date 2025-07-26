const API_BASE_URL = 'http://localhost:5001/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Common headers for authenticated requests
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`
});

// Generic API request function
const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Auth API functions
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data || 'Login failed');
      }
      
      return data;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data || 'Registration failed');
      }
      
      return data;
    } catch (error) {
      console.error('Register API error:', error);
      throw error;
    }
  },

  getProfile: async () => {
    return apiRequest('/auth/me');
  },

  updateProfile: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/auth/update`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      body: formData
    });
    return await response.json();
  }
};

// Resources API functions
export const resourcesAPI = {
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) queryParams.append(key, filters[key]);
    });
    
    const url = `/resources${queryParams.toString() ? `?${queryParams}` : ''}`;
    return apiRequest(url);
  },

  getById: async (id) => {
    return apiRequest(`/resources/${id}`);
  },

  create: async (resourceData) => {
    return apiRequest('/resources', {
      method: 'POST',
      body: JSON.stringify(resourceData)
    });
  },

  update: async (id, resourceData) => {
    return apiRequest(`/resources/${id}`, {
      method: 'PUT',
      body: JSON.stringify(resourceData)
    });
  },

  delete: async (id) => {
    return apiRequest(`/resources/${id}`, {
      method: 'DELETE'
    });
  },

  like: async (id) => {
    return apiRequest(`/resources/${id}/like`, {
      method: 'POST'
    });
  },

  getCategories: async () => {
    return apiRequest('/resources/meta/categories');
  },

  getTypes: async () => {
    return apiRequest('/resources/meta/types');
  }
};

// Sessions API functions
export const sessionsAPI = {
  getAll: async () => {
    return apiRequest('/sessions');
  },

  getUpcoming: async () => {
    return apiRequest('/sessions/upcoming');
  },

  create: async (sessionData) => {
    return apiRequest('/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData)
    });
  },

  update: async (id, sessionData) => {
    return apiRequest(`/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sessionData)
    });
  },

  delete: async (id) => {
    return apiRequest(`/sessions/${id}`, {
      method: 'DELETE'
    });
  },

  getPsychiatrists: async () => {
    return apiRequest('/sessions/psychiatrists');
  }
};

export default {
  authAPI,
  resourcesAPI,
  sessionsAPI
};
