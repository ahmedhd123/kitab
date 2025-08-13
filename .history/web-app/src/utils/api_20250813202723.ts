// API configuration utility
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const apiUrl = (endpoint: string): string => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // If API_BASE_URL is relative, use it as is
  if (API_BASE_URL.startsWith('/')) {
    return `${API_BASE_URL}/${cleanEndpoint}`;
  }
  
  // If API_BASE_URL is absolute, use it as is
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

export const getApiUrl = (endpoint: string): string => {
  return apiUrl(endpoint);
};

// Helper for common API endpoints
export const apiEndpoints = {
  auth: {
    login: () => apiUrl('auth'),
    register: () => apiUrl('auth'),
  },
  books: () => apiUrl('books'),
  health: () => apiUrl('health'),
  admin: {
    dashboard: () => apiUrl('admin/dashboard'),
    books: () => apiUrl('admin/books'),
  }
};

export default apiUrl;
