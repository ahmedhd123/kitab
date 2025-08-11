// Common types for the Kitabi mobile app

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: 'user' | 'admin' | 'moderator';
  bio?: string;
  favoriteGenres: string[];
  readingGoal?: number;
  booksRead: number;
  reviewsCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  coverImage?: string;
  rating: number;
  totalRatings: number;
  genre: string[];
  publishedDate: string;
  language: string;
  isbn?: string;
  pages?: number;
  publisher?: string;
  file?: {
    url: string;
    type: 'pdf' | 'epub' | 'mobi' | 'txt';
    size: number;
  };
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  user: User;
  book: string;
  rating: number;
  content: string;
  isApproved: boolean;
  sentiment?: 'positive' | 'neutral' | 'negative';
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReadingSession {
  _id: string;
  user: string;
  book: string;
  startTime: string;
  endTime?: string;
  currentPage: number;
  totalPages: number;
  progress: number;
  isActive: boolean;
}

export interface Bookmark {
  _id: string;
  user: string;
  book: string;
  page: number;
  note?: string;
  createdAt: string;
}

export interface Notification {
  _id: string;
  user: string;
  type: 'review' | 'follow' | 'recommendation' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  data?: any;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  user?: User;
  token?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  genre?: string;
  author?: string;
  language?: string;
  sortBy?: 'title' | 'author' | 'rating' | 'publishedDate' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SearchFilters {
  query?: string;
  genre?: string[];
  author?: string;
  language?: string;
  rating?: {
    min: number;
    max: number;
  };
  publishedDate?: {
    from: string;
    to: string;
  };
}

export interface BookDetails extends Book {
  reviews: Review[];
  relatedBooks: Book[];
  userRating?: number;
  userReview?: Review;
  isFavorite: boolean;
  readingProgress?: {
    currentPage: number;
    totalPages: number;
    percentage: number;
    lastRead: string;
  };
}

export interface UserStats {
  booksRead: number;
  pagesRead: number;
  averageRating: number;
  reviewsWritten: number;
  readingStreak: number;
  favoriteGenre: string;
  readingTime: number; // in minutes
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'ar' | 'en';
  fontSize: 'small' | 'medium' | 'large';
  fontFamily: string;
  autoNightMode: boolean;
  notificationsEnabled: boolean;
  syncEnabled: boolean;
}

export interface OfflineData {
  books: Book[];
  userProfile: User;
  favorites: Book[];
  readingProgress: ReadingSession[];
  bookmarks: Bookmark[];
  lastSync: string;
}

export interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean;
  type: string;
  details: any;
}

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  BookDetails: { bookId: string };
  Profile: { userId?: string };
  Search: { initialQuery?: string };
  Reader: { bookId: string; startPage?: number };
  Library: undefined;
  Favorites: undefined;
  Settings: undefined;
  Auth: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  EditProfile: undefined;
  WriteReview: { bookId: string };
  Reviews: { bookId: string };
  Authors: undefined;
  AuthorDetails: { authorId: string };
  Genre: { genre: string };
  Notifications: undefined;
};

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Library: undefined;
  Profile: undefined;
};

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ProfileForm {
  name: string;
  bio?: string;
  favoriteGenres: string[];
  readingGoal?: number;
}

export interface ReviewForm {
  rating: number;
  content: string;
}

export interface SearchState {
  query: string;
  filters: SearchFilters;
  results: Book[];
  isLoading: boolean;
  hasMore: boolean;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

export type ErrorCode = 
  | 'NETWORK_ERROR'
  | 'AUTH_ERROR'
  | 'VALIDATION_ERROR'
  | 'SERVER_ERROR'
  | 'NOT_FOUND'
  | 'PERMISSION_DENIED'
  | 'OFFLINE_ERROR';

// Component Props types
export interface BookCardProps {
  book: Book;
  onPress?: (book: Book) => void;
  showRating?: boolean;
  showAuthor?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export interface ReviewCardProps {
  review: Review;
  onPress?: (review: Review) => void;
  showBook?: boolean;
  showUser?: boolean;
}

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export interface LoadingProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
}

export interface EmptyStateProps {
  title: string;
  message: string;
  action?: {
    text: string;
    onPress: () => void;
  };
  icon?: string;
}
