// API client for making requests to Express backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6000/api';

class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Important for cookies/sessions
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }

  // For multipart/form-data uploads
  async upload(endpoint, formData, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      ...options,
      method: 'POST',
      body: formData,
      credentials: 'include',
      // Don't set Content-Type header for FormData - browser will set it with boundary
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      return data;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
const apiClient = new ApiClient();

export default apiClient;

// Named exports for specific API endpoints
export const applicationsApi = {
  submitLoan: (data) => apiClient.post('/applications/loan', data),
  submitInsurance: (data) => apiClient.post('/applications/insurance', data),
};

export const consultancyApi = {
  submit: (data) => apiClient.post('/consultancy', data),
};

export const galleryApi = {
  getEvents: (params) => {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`/gallery/events${query ? '?' + query : ''}`);
  },
  getEvent: (id) => apiClient.get(`/gallery/events/${id}`),
};

export const loanProductsApi = {
  getAll: () => apiClient.get('/loan-products'),
  getOne: (id) => apiClient.get(`/loan-products/${id}`),
};

export const adminApi = {
  // Applications
  getApplications: (params) => {
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`/admin/applications${query ? '?' + query : ''}`);
  },
  getApplication: (id) => apiClient.get(`/admin/applications/${id}`),
  updateApplicationStatus: (id, data) => apiClient.patch(`/admin/applications/${id}`, data),
  
  // Consultancy
  getConsultancyRequests: () => apiClient.get('/admin/consultancy'),
  deleteConsultancyRequest: (id) => apiClient.delete(`/admin/consultancy/${id}`),
  
  // Settings
  getSettings: () => apiClient.get('/admin/settings'),
  updateSettings: (data) => apiClient.post('/admin/settings', data),
  checkEmails: () => apiClient.get('/admin/check-emails'),
  
  // Gallery
  getGalleryEvents: () => apiClient.get('/admin/gallery/events'),
  getGalleryEvent: (id) => apiClient.get(`/admin/gallery/events/${id}`),
  createGalleryEvent: (formData) => apiClient.upload('/admin/gallery/events', formData),
  deleteGalleryEvent: (id) => apiClient.delete(`/admin/gallery/events/${id}`),
};

export const authApi = {
  getSession: () => apiClient.get('/auth/session'),
  signOut: () => apiClient.post('/auth/signout'),
  googleLogin: () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  },
};
