import Constants from 'expo-constants';

// Environment configuration for the mobile app
const ENV = {
  development: {
    apiUrl: 'http://10.0.2.2:5000/api', // Android emulator
    // apiUrl: 'http://localhost:5000/api', // iOS simulator
    aiUrl: 'http://10.0.2.2:8000',
    websocketUrl: 'ws://10.0.2.2:5000',
    environment: 'development',
    enableLogging: true,
    enableDebugMode: true,
    apiTimeout: 10000,
    retryAttempts: 3,
    cacheExpiry: 1000 * 60 * 15, // 15 minutes
  },
  staging: {
    apiUrl: 'https://staging-api.kitabi.com/api',
    aiUrl: 'https://staging-ai.kitabi.com',
    websocketUrl: 'wss://staging-api.kitabi.com',
    environment: 'staging',
    enableLogging: true,
    enableDebugMode: false,
    apiTimeout: 15000,
    retryAttempts: 3,
    cacheExpiry: 1000 * 60 * 30, // 30 minutes
  },
  production: {
    apiUrl: 'https://api.kitabi.com/api',
    aiUrl: 'https://ai.kitabi.com',
    websocketUrl: 'wss://api.kitabi.com',
    environment: 'production',
    enableLogging: false,
    enableDebugMode: false,
    apiTimeout: 20000,
    retryAttempts: 5,
    cacheExpiry: 1000 * 60 * 60, // 1 hour
  },
};

// Function to get current environment
const getEnvironment = () => {
  if (__DEV__) return 'development';
  if (Constants.expoConfig?.extra?.environment === 'staging') return 'staging';
  return 'production';
};

// Export current environment config
export const config = ENV[getEnvironment() as keyof typeof ENV];

// App configuration
export const APP_CONFIG = {
  name: 'كتابي',
  nameEn: 'Kitabi',
  version: Constants.expoConfig?.version || '1.0.0',
  bundleId: 'com.kitabi.mobile',
  
  // Feature flags
  features: {
    offlineMode: true,
    darkMode: true,
    biometricAuth: true,
    pushNotifications: true,
    socialFeatures: true,
    aiRecommendations: true,
    audioBooks: false, // Future feature
    bookClubs: false,  // Future feature
  },
  
  // UI Configuration
  ui: {
    primaryColor: '#007AFF',
    secondaryColor: '#34C759',
    errorColor: '#FF3B30',
    warningColor: '#FF9500',
    backgroundColor: '#F2F2F7',
    surfaceColor: '#FFFFFF',
    textColor: '#000000',
    subtextColor: '#666666',
    borderColor: '#E5E5EA',
    
    // Arabic RTL support
    rtlSupport: true,
    defaultLanguage: 'ar',
    supportedLanguages: ['ar', 'en'],
    
    // Typography
    fonts: {
      regular: 'System',
      medium: 'System-Medium',
      bold: 'System-Bold',
      arabic: 'Amiri', // Arabic font
    },
    
    // Spacing
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    
    // Border radius
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16,
    },
  },
  
  // API Configuration
  api: {
    timeout: config.apiTimeout,
    retryAttempts: config.retryAttempts,
    retryDelay: 1000,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    supportedImageFormats: ['jpg', 'jpeg', 'png', 'webp'],
    supportedBookFormats: ['pdf', 'epub', 'mobi', 'txt'],
    
    // Pagination
    defaultPageSize: 20,
    maxPageSize: 100,
    
    // Cache configuration
    cacheExpiry: config.cacheExpiry,
    maxCacheSize: 100 * 1024 * 1024, // 100MB
  },
  
  // Security Configuration
  security: {
    tokenExpiry: 1000 * 60 * 60 * 24, // 24 hours
    refreshTokenExpiry: 1000 * 60 * 60 * 24 * 30, // 30 days
    biometricTimeout: 1000 * 60 * 5, // 5 minutes
    maxLoginAttempts: 5,
    lockoutDuration: 1000 * 60 * 15, // 15 minutes
    
    // Encryption
    encryptSensitiveData: true,
    useSecureStorage: true,
  },
  
  // Performance Configuration
  performance: {
    imageQuality: 0.8,
    thumbnailSize: 150,
    preloadImages: 5,
    maxConcurrentRequests: 10,
    
    // Lazy loading
    lazyLoadThreshold: 100,
    virtualListThreshold: 50,
    
    // Memory management
    maxImageCacheSize: 50 * 1024 * 1024, // 50MB
    cleanupInterval: 1000 * 60 * 5, // 5 minutes
  },
  
  // Offline Configuration
  offline: {
    maxOfflineBooks: 100,
    maxOfflineSize: 1024 * 1024 * 1024, // 1GB
    syncOnStartup: true,
    autoDownloadCovers: true,
    compressionLevel: 0.7,
    
    // Sync intervals
    fullSyncInterval: 1000 * 60 * 60 * 6, // 6 hours
    incrementalSyncInterval: 1000 * 60 * 15, // 15 minutes
  },
  
  // Analytics Configuration
  analytics: {
    enabled: !__DEV__,
    trackUserEvents: true,
    trackPerformance: true,
    trackErrors: true,
    sessionTimeout: 1000 * 60 * 30, // 30 minutes
    
    // Events to track
    events: {
      bookView: 'book_view',
      bookDownload: 'book_download',
      searchQuery: 'search_query',
      reviewSubmit: 'review_submit',
      userRegister: 'user_register',
      userLogin: 'user_login',
    },
  },
  
  // Notification Configuration
  notifications: {
    enabled: true,
    categories: {
      newBooks: 'new_books',
      recommendations: 'recommendations',
      social: 'social_activity',
      system: 'system_updates',
    },
    
    // Default settings
    defaults: {
      newBooks: true,
      recommendations: true,
      social: true,
      system: true,
    },
    
    // Scheduling
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00',
    },
  },
  
  // Content Configuration
  content: {
    // Reading settings
    reading: {
      defaultFontSize: 16,
      fontSizeRange: [12, 24],
      defaultLineHeight: 1.5,
      defaultMargin: 20,
      nightModeOpacity: 0.8,
      
      // Page settings
      pagesPerRequest: 10,
      preloadPages: 3,
      maxZoomLevel: 3.0,
      minZoomLevel: 0.5,
    },
    
    // Book formats
    formats: {
      pdf: {
        supported: true,
        maxSize: 100 * 1024 * 1024, // 100MB
        quality: 'medium',
      },
      epub: {
        supported: true,
        maxSize: 50 * 1024 * 1024, // 50MB
        customCSS: true,
      },
      mobi: {
        supported: false, // Future support
        maxSize: 50 * 1024 * 1024,
      },
    },
    
    // Image settings
    images: {
      bookCovers: {
        quality: 0.8,
        maxWidth: 400,
        maxHeight: 600,
      },
      userAvatars: {
        quality: 0.7,
        maxWidth: 200,
        maxHeight: 200,
      },
    },
  },
  
  // Social Features Configuration
  social: {
    maxReviewLength: 2000,
    maxBioLength: 500,
    maxUsernameLength: 30,
    minPasswordLength: 8,
    
    // Following/Followers
    maxFollowing: 1000,
    maxFollowers: 10000,
    
    // Reviews
    allowEditReview: true,
    editTimeLimit: 1000 * 60 * 60 * 24, // 24 hours
    
    // Ratings
    ratingScale: 5,
    allowHalfRatings: true,
  },
  
  // Debug Configuration (development only)
  debug: {
    showNetworkLogger: __DEV__ && config.enableDebugMode,
    showReduxLogger: __DEV__ && config.enableDebugMode,
    showPerformanceMonitor: __DEV__ && config.enableDebugMode,
    mockAPI: false,
    bypassAuth: false,
  },
};

// Platform-specific configurations
export const PLATFORM_CONFIG = {
  ios: {
    statusBarStyle: 'dark-content',
    navigationBarStyle: 'default',
    hapticFeedback: true,
    swipeGestures: true,
  },
  
  android: {
    statusBarStyle: 'dark-content',
    navigationBarStyle: 'light',
    hapticFeedback: true,
    backHandler: true,
    hardwareBackButton: true,
  },
};

// Export URLs for easy access
export const URLS = {
  api: config.apiUrl,
  ai: config.aiUrl,
  websocket: config.websocketUrl,
  
  // External URLs
  termsOfService: 'https://kitabi.com/terms',
  privacyPolicy: 'https://kitabi.com/privacy',
  support: 'https://kitabi.com/support',
  feedback: 'mailto:feedback@kitabi.com',
  
  // Social media
  facebook: 'https://facebook.com/kitabi',
  twitter: 'https://twitter.com/kitabi',
  instagram: 'https://instagram.com/kitabi',
};

// Export current environment for debugging
export const CURRENT_ENV = getEnvironment();

// Log current configuration in development
if (__DEV__ && config.enableLogging) {
  console.log('🚀 Kitabi Mobile App Configuration');
  console.log('📱 Environment:', CURRENT_ENV);
  console.log('🌐 API URL:', config.apiUrl);
  console.log('🔧 Debug Mode:', config.enableDebugMode);
  console.log('📊 Analytics:', APP_CONFIG.analytics.enabled);
}
