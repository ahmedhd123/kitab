// Auto-generated configuration - DO NOT EDIT MANUALLY
// Use: npm run config:update to regenerate

export interface ApiConfig {
  BASE_URL: string;
  API_VERSION: string;
  TIMEOUT: number;
}

export interface AppConfig {
  api: ApiConfig;
  app: {
    name: string;
    version: string;
    environment: string;
  };
}

const CONFIG: Record<string, AppConfig> = {
  development: {
    api: {
      BASE_URL: 'http://localhost:5000',
      API_VERSION: 'v1',
      TIMEOUT: 10000
    },
    app: {
      name: 'كتابي - Kitabi (Dev)',
      version: '1.0.0-dev',
      environment: 'development'
    }
  },
  staging: {
    api: {
      BASE_URL: 'https://api-staging.kitabi.com',
      API_VERSION: 'v1', 
      TIMEOUT: 15000
    },
    app: {
      name: 'كتابي - Kitabi (Staging)',
      version: '1.0.0-staging',
      environment: 'staging'
    }
  },
  production: {
    api: {
      BASE_URL: 'https://api.kitabi.com',
      API_VERSION: 'v1',
      TIMEOUT: 20000
    },
    app: {
      name: 'كتابي - Kitabi',
      version: '1.0.0',
      environment: 'production'
    }
  }
};

// Auto-detect environment or use override
const ENV = process.env.NODE_ENV || 'development';
export const API_CONFIG = CONFIG[ENV] || CONFIG.development;

// For debugging
export const CURRENT_CONFIG = {
  environment: ENV,
  backend: API_CONFIG.api.BASE_URL,
  generated: new Date().toISOString()
};

console.log('📱 Kitabi Mobile Config Loaded:', CURRENT_CONFIG);
