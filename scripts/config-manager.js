#!/usr/bin/env node

/**
 * Kitabi System - Environment Configuration Manager
 * Automatically updates API endpoints across all components when backend changes
 */

const fs = require('fs');
const path = require('path');

class KitabiConfigManager {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.configs = {
      development: {
        backend: 'http://localhost:5000',
        frontend: 'http://localhost:3000',
        database: 'mongodb://localhost:27017/kitabi'
      },
      staging: {
        backend: 'https://api-staging.kitabi.com',
        frontend: 'https://staging.kitabi.com',
        database: 'mongodb+srv://staging-cluster...'
      },
      production: {
        backend: 'https://api.kitabi.com',
        frontend: 'https://kitabi.com',
        database: 'mongodb+srv://production-cluster...'
      }
    };
  }

  /**
   * Update mobile app configuration
   */
  updateMobileConfig(environment = 'development') {
    const configPath = path.join(this.projectRoot, 'mobile-app/KitabiMobile/config/index.ts');
    const config = this.configs[environment];
    
    const configContent = `// Auto-generated configuration - DO NOT EDIT MANUALLY
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
      BASE_URL: '${this.configs.development.backend}',
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
      BASE_URL: '${this.configs.staging.backend}',
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
      BASE_URL: '${this.configs.production.backend}',
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
`;

    try {
      // Ensure config directory exists
      const configDir = path.dirname(configPath);
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }

      fs.writeFileSync(configPath, configContent);
      console.log(`✅ Mobile config updated for ${environment} environment`);
      console.log(`📱 Backend URL: ${config.backend}`);
    } catch (error) {
      console.error('❌ Failed to update mobile config:', error.message);
    }
  }

  /**
   * Update frontend environment variables
   */
  updateFrontendConfig(environment = 'development') {
    const envPath = path.join(this.projectRoot, 'web-app/.env.local');
    const config = this.configs[environment];
    
    const envContent = `# Auto-generated environment configuration
# Generated: ${new Date().toISOString()}
# Environment: ${environment}

NEXT_PUBLIC_API_URL=${config.backend}
NEXT_PUBLIC_APP_ENV=${environment}
NEXT_PUBLIC_APP_NAME="كتابي - Kitabi"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# Backend API endpoints
NEXT_PUBLIC_API_BASE_URL=${config.backend}/api
NEXT_PUBLIC_AUTH_URL=${config.backend}/api/auth
NEXT_PUBLIC_BOOKS_URL=${config.backend}/api/books
NEXT_PUBLIC_USERS_URL=${config.backend}/api/users

# Feature flags
NEXT_PUBLIC_ENABLE_SOCIAL_LOGIN=false
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_OFFLINE_MODE=true
`;

    try {
      fs.writeFileSync(envPath, envContent);
      console.log(`✅ Frontend config updated for ${environment} environment`);
      console.log(`🌐 Backend URL: ${config.backend}`);
    } catch (error) {
      console.error('❌ Failed to update frontend config:', error.message);
    }
  }

  /**
   * Update backend environment variables
   */
  updateBackendConfig(environment = 'development') {
    const envPath = path.join(this.projectRoot, `backend/.env.${environment}`);
    const config = this.configs[environment];
    
    const envContent = `# Auto-generated backend configuration
# Generated: ${new Date().toISOString()}
# Environment: ${environment}

NODE_ENV=${environment}
PORT=5000

# Database Configuration
MONGODB_URI=${config.database}

# Client Configuration
CLIENT_URL=${config.frontend}
ALLOWED_ORIGINS=${config.frontend},${config.frontend.replace('http://', 'https://')},http://localhost:3000,http://localhost:3001

# JWT Configuration
JWT_SECRET=kitabi-super-secret-jwt-key-${environment}
JWT_EXPIRE=7d

# Security
BCRYPT_ROUNDS=12
SESSION_SECRET=kitabi-session-secret-${environment}

# Features
ENABLE_SOCIAL_LOGIN=false
ENABLE_ANALYTICS=false
ENABLE_FILE_UPLOAD=true

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# External Services (update with your keys)
OPENAI_API_KEY=
GOOGLE_BOOKS_API_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Monitoring
ENABLE_LOGGING=true
LOG_LEVEL=${environment === 'production' ? 'warn' : 'debug'}
`;

    try {
      fs.writeFileSync(envPath, envContent);
      console.log(`✅ Backend config updated for ${environment} environment`);
      console.log(`🗄️ Database: ${config.database}`);
    } catch (error) {
      console.error('❌ Failed to update backend config:', error.message);
    }
  }

  /**
   * Update app.json for mobile app builds
   */
  updateMobileAppJson(environment = 'production') {
    const appJsonPath = path.join(this.projectRoot, 'mobile-app/KitabiMobile/app.json');
    const config = this.configs[environment];
    
    try {
      const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
      
      // Update app configuration based on environment
      appJson.expo.name = environment === 'production' ? 'كتابي - Kitabi' : `كتابي - Kitabi (${environment})`;
      appJson.expo.slug = environment === 'production' ? 'kitabi' : `kitabi-${environment}`;
      appJson.expo.version = environment === 'production' ? '1.0.0' : `1.0.0-${environment}`;
      
      // Update bundle identifier for different environments
      if (appJson.expo.ios) {
        appJson.expo.ios.bundleIdentifier = environment === 'production' 
          ? 'com.kitabi.app' 
          : `com.kitabi.app.${environment}`;
      }
      
      if (appJson.expo.android) {
        appJson.expo.android.package = environment === 'production'
          ? 'com.kitabi.app'
          : `com.kitabi.app.${environment}`;
      }

      // Add environment-specific configuration
      appJson.expo.extra = {
        ...appJson.expo.extra,
        environment: environment,
        apiUrl: config.backend,
        buildTimestamp: new Date().toISOString()
      };

      fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
      console.log(`✅ Mobile app.json updated for ${environment} environment`);
      console.log(`📦 Package: ${appJson.expo.android?.package || appJson.expo.ios?.bundleIdentifier}`);
    } catch (error) {
      console.error('❌ Failed to update app.json:', error.message);
    }
  }

  /**
   * Update all configurations for a specific environment
   */
  updateAll(environment = 'development') {
    console.log(`🔄 Updating all configurations for ${environment} environment...`);
    console.log('===============================================');
    
    this.updateBackendConfig(environment);
    this.updateFrontendConfig(environment);
    this.updateMobileConfig(environment);
    
    if (environment !== 'development') {
      this.updateMobileAppJson(environment);
    }
    
    console.log('===============================================');
    console.log(`✅ All configurations updated for ${environment}!`);
    console.log(`🔗 Backend: ${this.configs[environment].backend}`);
    console.log(`🌐 Frontend: ${this.configs[environment].frontend}`);
    console.log(`🗄️ Database: ${this.configs[environment].database}`);
  }

  /**
   * Sync versions across all package.json files
   */
  syncVersions(newVersion) {
    const packages = [
      'package.json',
      'backend/package.json',
      'web-app/package.json',
      'mobile-app/KitabiMobile/package.json'
    ];

    packages.forEach(packagePath => {
      const fullPath = path.join(this.projectRoot, packagePath);
      
      try {
        if (fs.existsSync(fullPath)) {
          const packageJson = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
          packageJson.version = newVersion;
          fs.writeFileSync(fullPath, JSON.stringify(packageJson, null, 2));
          console.log(`✅ Updated version in ${packagePath}`);
        }
      } catch (error) {
        console.error(`❌ Failed to update ${packagePath}:`, error.message);
      }
    });
  }

  /**
   * Create deployment status file
   */
  createDeploymentStatus(environment, status = 'deployed') {
    const statusPath = path.join(this.projectRoot, 'deployment-status.json');
    
    let deploymentStatus = {};
    
    try {
      if (fs.existsSync(statusPath)) {
        deploymentStatus = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
      }
    } catch (error) {
      console.warn('Could not read existing deployment status');
    }

    deploymentStatus[environment] = {
      status: status,
      timestamp: new Date().toISOString(),
      backend: this.configs[environment].backend,
      frontend: this.configs[environment].frontend,
      database: this.configs[environment].database
    };

    try {
      fs.writeFileSync(statusPath, JSON.stringify(deploymentStatus, null, 2));
      console.log(`✅ Deployment status updated for ${environment}`);
    } catch (error) {
      console.error('❌ Failed to update deployment status:', error.message);
    }
  }
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  const environment = args[1] || 'development';
  
  const manager = new KitabiConfigManager();

  switch (command) {
    case 'update':
      manager.updateAll(environment);
      manager.createDeploymentStatus(environment, 'configured');
      break;
    
    case 'mobile':
      manager.updateMobileConfig(environment);
      break;
    
    case 'frontend':
      manager.updateFrontendConfig(environment);
      break;
    
    case 'backend':
      manager.updateBackendConfig(environment);
      break;
    
    case 'version':
      if (args[1]) {
        manager.syncVersions(args[1]);
      } else {
        console.error('❌ Please provide a version number');
      }
      break;
    
    default:
      console.log(`
🔧 Kitabi Configuration Manager

Usage:
  node config-manager.js <command> [environment]

Commands:
  update <env>     Update all configurations for environment
  mobile <env>     Update mobile app configuration only
  frontend <env>   Update frontend configuration only  
  backend <env>    Update backend configuration only
  version <ver>    Sync version across all packages

Environments:
  development (default)
  staging
  production

Examples:
  node config-manager.js update development
  node config-manager.js update production
  node config-manager.js mobile staging
  node config-manager.js version 1.0.1
`);
  }
}

module.exports = KitabiConfigManager;
