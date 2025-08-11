// Authentication utilities
export interface UserStats {
  booksRead: number;
  currentlyReading: number;
  favoriteGenres: string[];
  readingStreak: number;
}

export interface AIPreferences {
  language: string;
  preferredGenres: string[];
  readingGoals: string[];
  personalityType: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
  };
  stats?: UserStats;
  aiPreferences?: AIPreferences;
}

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const getAuthUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  const userData = localStorage.getItem('user');
  if (!userData) return null;
  
  try {
    return JSON.parse(userData);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export const logout = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
};

export const getDisplayName = (user: User | null): string => {
  if (!user) return '';
  
  const fullName = `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim();
  return fullName || user.username || '';
};
