// Mobile API Service for React Native
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// API Configuration
const API_CONFIG = {
  // Development URLs
  local: Platform.OS === 'ios' ? 'http://localhost:5000' : 'http://10.0.2.2:5000',
  // Production URL (replace with your domain)
  production: 'https://api.kitabi.com',
  
  // Use local for development, production for release
  baseURL: __DEV__ ? 
    (Platform.OS === 'ios' ? 'http://localhost:5000' : 'http://10.0.2.2:5000') :
    'https://api.kitabi.com',
  
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
};

// Create axios instance
const api = axios.create(API_CONFIG);

// Request interceptor to add authentication token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, clear stored token
      await SecureStore.deleteItemAsync('userToken');
      // Redirect to login or handle as needed
    }
    return Promise.reject(error);
  }
);

// Auth Service
export const AuthService = {
  async login(email: string, password: string) {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Store token securely
      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('userData', JSON.stringify(user));
      
      return { success: true, user, token };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  },

  async register(userData: {
    username: string;
    email: string;
    password: string;
    name?: string;
  }) {
    try {
      const response = await api.post('/api/auth/register', userData);
      const { token, user } = response.data;
      
      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('userData', JSON.stringify(user));
      
      return { success: true, user, token };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  },

  async logout() {
    try {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userData');
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Logout failed' };
    }
  },

  async getCurrentUser() {
    try {
      const userData = await SecureStore.getItemAsync('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  },

  async isAuthenticated() {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      return !!token;
    } catch (error) {
      return false;
    }
  }
};

// Books Service
export const BooksService = {
  async getBooks(params?: {
    page?: number;
    limit?: number;
    search?: string;
    genre?: string;
    author?: string;
  }) {
    try {
      const response = await api.get('/api/books', { params });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch books' 
      };
    }
  },

  async getBook(id: string) {
    try {
      const response = await api.get(`/api/books/${id}`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch book' 
      };
    }
  },

  async getFeaturedBooks() {
    try {
      const response = await api.get('/api/books/featured');
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch featured books' 
      };
    }
  },

  async searchBooks(query: string) {
    try {
      const response = await api.get('/api/books/search', { 
        params: { q: query } 
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Search failed' 
      };
    }
  },

  async downloadBook(bookId: string) {
    try {
      const response = await api.post(`/api/books/${bookId}/download`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Download failed' 
      };
    }
  }
};

// Reviews Service
export const ReviewsService = {
  async getBookReviews(bookId: string, page = 1, limit = 10) {
    try {
      const response = await api.get(`/api/reviews/book/${bookId}`, {
        params: { page, limit }
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch reviews' 
      };
    }
  },

  async addReview(bookId: string, reviewData: {
    rating: number;
    content: string;
  }) {
    try {
      const response = await api.post('/api/reviews', {
        bookId,
        ...reviewData
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to add review' 
      };
    }
  },

  async updateReview(reviewId: string, reviewData: {
    rating?: number;
    content?: string;
  }) {
    try {
      const response = await api.put(`/api/reviews/${reviewId}`, reviewData);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update review' 
      };
    }
  },

  async deleteReview(reviewId: string) {
    try {
      const response = await api.delete(`/api/reviews/${reviewId}`);
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to delete review' 
      };
    }
  }
};

// User Service
export const UserService = {
  async getProfile() {
    try {
      const response = await api.get('/api/users/profile');
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch profile' 
      };
    }
  },

  async updateProfile(profileData: {
    name?: string;
    bio?: string;
    favoriteGenres?: string[];
    location?: string;
  }) {
    try {
      const response = await api.put('/api/users/profile', profileData);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update profile' 
      };
    }
  },

  async getFavorites() {
    try {
      const response = await api.get('/api/users/favorites');
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch favorites' 
      };
    }
  },

  async addToFavorites(bookId: string) {
    try {
      const response = await api.post(`/api/users/favorites/${bookId}`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to add to favorites' 
      };
    }
  },

  async removeFromFavorites(bookId: string) {
    try {
      const response = await api.delete(`/api/users/favorites/${bookId}`);
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to remove from favorites' 
      };
    }
  }
};

// Offline Storage Service
export const OfflineService = {
  async cacheBooks(books: any[]) {
    try {
      await SecureStore.setItemAsync('cachedBooks', JSON.stringify(books));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to cache books' };
    }
  },

  async getCachedBooks() {
    try {
      const cached = await SecureStore.getItemAsync('cachedBooks');
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      return [];
    }
  },

  async cacheUserData(userData: any) {
    try {
      await SecureStore.setItemAsync('cachedUserData', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to cache user data' };
    }
  },

  async getCachedUserData() {
    try {
      const cached = await SecureStore.getItemAsync('cachedUserData');
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      return null;
    }
  }
};

// Network Status Service
export const NetworkService = {
  async checkConnection() {
    try {
      const response = await api.get('/api/health', { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
};

export default api;
