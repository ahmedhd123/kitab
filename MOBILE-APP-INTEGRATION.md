# 📱 Kitabi Mobile App - Complete Integration Guide

## Overview
This guide provides complete integration between the React Native mobile app, Node.js backend, and MongoDB Atlas database. The mobile app is built with TypeScript, Expo, and includes offline support, Arabic RTL layout, and comprehensive API integration.

## 🛠️ Tech Stack

### Mobile App
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router / React Navigation
- **State Management**: React Hooks
- **Storage**: Expo SecureStore (authentication) + AsyncStorage (offline data)
- **Networking**: Axios with retry logic and offline support
- **UI**: Native components with Arabic RTL support

### Backend Integration
- **API**: RESTful Node.js with Express
- **Database**: MongoDB Atlas (cloud database)
- **Authentication**: JWT tokens with automatic refresh
- **File Upload**: Multer for book covers and documents

## 📁 Mobile App Structure

```
mobile-app/KitabiMobile/
├── hooks/
│   └── useApi.ts              # React hooks for API integration
├── services/
│   └── api.ts                 # Comprehensive API service layer
├── types/
│   └── index.ts               # TypeScript type definitions
├── screens/
│   └── HomeScreen.tsx         # Example screen with full integration
├── components/               # Reusable UI components
├── navigation/              # App navigation structure
├── utils/                   # Helper functions and constants
└── assets/                  # Images, fonts, icons
```

## 🔧 Implementation Steps

### 1. Install Dependencies

```bash
cd mobile-app/KitabiMobile

# Core dependencies (already installed)
npm install expo-router expo-secure-store @expo/vector-icons
npm install axios react-native-async-storage

# Additional recommended packages
npm install react-native-gesture-handler react-native-reanimated
npm install expo-image-picker expo-document-picker
npm install react-native-pdf expo-file-system
```

### 2. Environment Configuration

Create `.env` file in mobile app root:

```env
# API Configuration
API_BASE_URL=http://10.0.2.2:5000/api  # Android emulator
# API_BASE_URL=http://localhost:5000/api  # iOS simulator
# API_BASE_URL=https://your-production-api.com/api  # Production

# App Configuration
APP_NAME=Kitabi
APP_VERSION=1.0.0
```

### 3. API Service Integration

The API service (`services/api.ts`) provides:

- **Authentication**: Login, register, logout with JWT
- **Books Management**: CRUD operations, search, filtering
- **Reviews System**: Add, edit, delete reviews
- **User Profile**: Profile management, favorites, reading progress
- **Offline Support**: Caching and sync capabilities
- **Network Handling**: Retry logic and error management

### 4. React Hooks Usage

The custom hooks (`hooks/useApi.ts`) provide:

- `useAuth()`: Authentication state and methods
- `useBooks()`: Books data with pagination and filtering
- `useBook(id)`: Single book details
- `useReviews(bookId)`: Book reviews management
- `useUserProfile()`: User profile data and updates
- `useFavorites()`: Favorites management
- `useSearch()`: Search functionality
- `useNetworkStatus()`: Network connectivity monitoring

### 5. Screen Implementation Example

```tsx
// HomeScreen.tsx - Complete example with Arabic RTL support
import { useBooks, useAuth, useSearch } from '../hooks/useApi';

const HomeScreen = () => {
  const { books, loading, loadMore } = useBooks();
  const { user, isAuthenticated } = useAuth();
  const { search, results } = useSearch();
  
  // Full implementation with Arabic UI and offline support
};
```

## 🗄️ Database Integration

### MongoDB Atlas Setup

1. **Create Cluster** (already documented in `MONGODB-ATLAS-SETUP.md`)
2. **Configure Network Access** for mobile development
3. **Update Backend Connection** string in `backend/.env`

### Mobile-Specific Database Features

```javascript
// Enhanced User model for mobile
const userSchema = {
  // ... existing fields
  
  // Mobile-specific fields
  deviceTokens: [String],        // Push notifications
  appVersion: String,            // App version tracking
  lastSync: Date,                // Offline sync timestamp
  preferences: {
    theme: String,               // light/dark/auto
    language: String,            // ar/en
    notifications: Boolean,
    autoSync: Boolean
  },
  readingSessions: [{
    book: ObjectId,
    startTime: Date,
    endTime: Date,
    currentPage: Number,
    progress: Number
  }],
  bookmarks: [{
    book: ObjectId,
    page: Number,
    note: String,
    createdAt: Date
  }]
};

// Enhanced Book model for mobile
const bookSchema = {
  // ... existing fields
  
  // Mobile-specific fields
  downloadUrl: String,           // Direct download link
  fileSize: Number,              // File size in bytes
  supportedFormats: [String],    // pdf, epub, mobi
  isOfflineAvailable: Boolean,   // Offline reading support
  mobileOptimized: Boolean,      // Mobile-optimized version
  thumbnails: {
    small: String,               // 150x200
    medium: String,              // 300x400
    large: String                // 600x800
  }
};
```

## 📱 Mobile App Features

### Authentication Flow
1. Login/Register with email and password
2. JWT token storage in SecureStore
3. Automatic token refresh
4. Biometric authentication (optional)

### Book Management
1. Browse books with infinite scroll
2. Search with advanced filters
3. Book details with reviews and ratings
4. Add to favorites and reading lists
5. Download for offline reading

### Reading Experience
1. Built-in PDF/EPUB reader
2. Reading progress tracking
3. Bookmarks and notes
4. Night mode and font customization
5. Arabic text support with RTL layout

### Offline Support
1. Cache frequently accessed data
2. Sync when connection is restored
3. Offline reading for downloaded books
4. Queue actions for later sync

### Social Features
1. Write and manage reviews
2. Follow other users
3. Reading recommendations
4. Share books and reviews

## 🔐 Security Implementation

### Authentication Security
```typescript
// JWT token management
const AuthService = {
  async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    await SecureStore.setItemAsync('auth_token', response.data.token);
    await SecureStore.setItemAsync('refresh_token', response.data.refreshToken);
    return response.data;
  },
  
  async getToken() {
    return await SecureStore.getItemAsync('auth_token');
  },
  
  async refreshToken() {
    const refreshToken = await SecureStore.getItemAsync('refresh_token');
    const response = await api.post('/auth/refresh', { refreshToken });
    await SecureStore.setItemAsync('auth_token', response.data.token);
    return response.data.token;
  }
};
```

### API Security
- JWT tokens in Authorization header
- Request/response encryption for sensitive data
- API rate limiting and validation
- Secure file upload and download

## 🌐 Network Handling

### Connection Management
```typescript
const NetworkService = {
  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'HEAD',
        timeout: 5000
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  },
  
  // Retry logic for failed requests
  async retryRequest(requestFn: Function, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }
};
```

## 🚀 Deployment

### Development
```bash
# Start Metro bundler
npx expo start

# Run on Android
npx expo run:android

# Run on iOS
npx expo run:ios
```

### Production Build
```bash
# Build for Android
eas build --platform android --profile production

# Build for iOS
eas build --platform ios --profile production

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

## 📊 Performance Optimization

### Code Optimization
1. **Lazy Loading**: Load screens and components on demand
2. **Image Optimization**: Use appropriate sizes and formats
3. **Memory Management**: Proper cleanup of listeners and timers
4. **Bundle Splitting**: Separate code for different features

### Data Optimization
1. **Pagination**: Load data in chunks
2. **Caching**: Smart caching strategies
3. **Compression**: Gzip API responses
4. **CDN**: Use CDN for static assets

## 🧪 Testing Strategy

### Unit Testing
```typescript
// Example test for API hooks
import { renderHook, act } from '@testing-library/react-hooks';
import { useBooks } from '../hooks/useApi';

test('should fetch books on mount', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useBooks());
  
  expect(result.current.loading).toBe(true);
  
  await waitForNextUpdate();
  
  expect(result.current.loading).toBe(false);
  expect(result.current.books.length).toBeGreaterThan(0);
});
```

### Integration Testing
- API endpoint testing with real backend
- Database operations testing
- Authentication flow testing
- Offline functionality testing

## 📈 Analytics and Monitoring

### User Analytics
- Screen views and user interactions
- Reading behavior tracking
- Feature usage statistics
- Performance metrics

### Error Tracking
- Crash reporting with stack traces
- API error monitoring
- User feedback collection
- Performance bottleneck identification

## 🌍 Internationalization (i18n)

### Arabic Support
```typescript
// RTL layout configuration
import { I18nManager } from 'react-native';

// Enable RTL
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

// Text direction in styles
const styles = StyleSheet.create({
  text: {
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  }
});
```

### Language Files
```typescript
// i18n/ar.ts
export const ar = {
  common: {
    search: 'بحث',
    loading: 'جاري التحميل...',
    error: 'حدث خطأ',
    retry: 'إعادة المحاولة'
  },
  books: {
    title: 'الكتب',
    author: 'المؤلف',
    rating: 'التقييم',
    addToFavorites: 'إضافة للمفضلة'
  }
};
```

## 🔄 Data Synchronization

### Sync Strategy
1. **Real-time**: WebSocket for instant updates
2. **Periodic**: Background sync every 15 minutes
3. **Manual**: Pull-to-refresh functionality
4. **Conflict Resolution**: Last-write-wins or user choice

### Offline Queue
```typescript
const OfflineQueue = {
  queue: [],
  
  async addAction(action: OfflineAction) {
    this.queue.push(action);
    await AsyncStorage.setItem('offline_queue', JSON.stringify(this.queue));
  },
  
  async processQueue() {
    for (const action of this.queue) {
      try {
        await this.executeAction(action);
        this.removeFromQueue(action.id);
      } catch (error) {
        console.error('Failed to sync action:', error);
      }
    }
  }
};
```

This comprehensive mobile integration provides a robust, scalable, and user-friendly Arabic book platform with full offline support and cloud synchronization.
