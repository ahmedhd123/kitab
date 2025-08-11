// React hooks for API services
import { useState, useEffect, useCallback } from 'react';
import { 
  AuthService, 
  BooksService, 
  ReviewsService, 
  UserService,
  OfflineService,
  NetworkService 
} from '../services/api';
import type { 
  User, 
  Book, 
  Review, 
  UserStats as UserProfile,
  ApiResponse,
  AuthResponse 
} from '../types';

// Authentication Hook
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authenticated = await AuthService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        const userData = await AuthService.getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const result = await AuthService.login(email, password);
    if (result.success) {
      setUser(result.user);
      setIsAuthenticated(true);
    }
    return result;
  };

  const register = async (userData: any) => {
    const result = await AuthService.register(userData);
    if (result.success) {
      setUser(result.user);
      setIsAuthenticated(true);
    }
    return result;
  };

  const logout = async () => {
    const result = await AuthService.logout();
    if (result.success) {
      setUser(null);
      setIsAuthenticated(false);
    }
    return result;
  };

  return {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    checkAuthStatus
  };
};

// Books Hook
export const useBooks = (params?: any) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchBooks = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      setError(null);

      const currentPage = reset ? 1 : page;
      const result = await BooksService.getBooks({ 
        ...params, 
        page: currentPage 
      });

      if (result.success) {
        if (reset) {
          setBooks(result.data.books);
          setPage(1);
        } else {
          setBooks(prev => [...prev, ...result.data.books]);
        }
        
        setHasMore(result.data.pagination.hasNext);
        
        // Cache books for offline access
        await OfflineService.cacheBooks(result.data.books);
      } else {
        setError(result.error);
        
        // Load from cache if network fails
        const cachedBooks = await OfflineService.getCachedBooks();
        if (cachedBooks.length > 0) {
          setBooks(cachedBooks);
        }
      }
    } catch (err: any) {
      setError(err.message);
      
      // Load from cache on error
      const cachedBooks = await OfflineService.getCachedBooks();
      if (cachedBooks.length > 0) {
        setBooks(cachedBooks);
      }
    } finally {
      setLoading(false);
    }
  }, [params, page]);

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  const refresh = () => {
    fetchBooks(true);
  };

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return {
    books,
    loading,
    error,
    hasMore,
    loadMore,
    refresh
  };
};

// Single Book Hook
export const useBook = (bookId: string) => {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookId) return;

    const fetchBook = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await BooksService.getBook(bookId);
        if (result.success) {
          setBook(result.data);
        } else {
          setError(result.error);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  return { book, loading, error };
};

// Reviews Hook
export const useReviews = (bookId: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookId) return;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await ReviewsService.getBookReviews(bookId);
        if (result.success) {
          setReviews(result.data.reviews);
        } else {
          setError(result.error);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [bookId]);

  const addReview = async (reviewData: { rating: number; content: string }) => {
    try {
      const result = await ReviewsService.addReview(bookId, reviewData);
      if (result.success) {
        setReviews(prev => [result.data, ...prev]);
      }
      return result;
    } catch (error) {
      return { success: false, error: 'Failed to add review' };
    }
  };

  return {
    reviews,
    loading,
    error,
    addReview
  };
};

// User Profile Hook
export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await UserService.getProfile();
      if (result.success) {
        setProfile(result.data);
        await OfflineService.cacheUserData(result.data);
      } else {
        setError(result.error);
        // Load from cache
        const cachedProfile = await OfflineService.getCachedUserData();
        if (cachedProfile) {
          setProfile(cachedProfile);
        }
      }
    } catch (err: any) {
      setError(err.message);
      // Load from cache on error
      const cachedProfile = await OfflineService.getCachedUserData();
      if (cachedProfile) {
        setProfile(cachedProfile);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: any) => {
    try {
      const result = await UserService.updateProfile(profileData);
      if (result.success) {
        setProfile(result.data);
        await OfflineService.cacheUserData(result.data);
      }
      return result;
    } catch (error) {
      return { success: false, error: 'Failed to update profile' };
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile: fetchProfile
  };
};

// Favorites Hook
export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await UserService.getFavorites();
      if (result.success) {
        setFavorites(result.data);
      } else {
        setError(result.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (bookId: string) => {
    try {
      const result = await UserService.addToFavorites(bookId);
      if (result.success) {
        setFavorites(prev => [...prev, result.data]);
      }
      return result;
    } catch (error) {
      return { success: false, error: 'Failed to add to favorites' };
    }
  };

  const removeFromFavorites = async (bookId: string) => {
    try {
      const result = await UserService.removeFromFavorites(bookId);
      if (result.success) {
        setFavorites(prev => prev.filter(fav => fav._id !== bookId));
      }
      return result;
    } catch (error) {
      return { success: false, error: 'Failed to remove from favorites' };
    }
  };

  const isFavorite = (bookId: string) => {
    return favorites.some(fav => fav._id === bookId);
  };

  return {
    favorites,
    loading,
    error,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    refreshFavorites: fetchFavorites
  };
};

// Network Status Hook
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkConnection();
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    try {
      setLoading(true);
      const connected = await NetworkService.checkConnection();
      setIsOnline(connected);
    } catch (error) {
      setIsOnline(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    isOnline,
    loading,
    checkConnection
  };
};

// Search Hook
export const useSearch = () => {
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await BooksService.searchBooks(query);
      if (result.success) {
        setResults(result.data.books);
      } else {
        setError(result.error);
        setResults([]);
      }
    } catch (err: any) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
    setError(null);
  };

  return {
    results,
    loading,
    error,
    search,
    clearResults
  };
};
