// Local MongoDB Configuration
module.exports = {
  development: {
    url: 'mongodb://localhost:27017/kitabi-local',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }
  },
  
  // Database initialization settings
  collections: {
    users: 'users',
    books: 'books',
    reviews: 'reviews',
    categories: 'categories'
  },
  
  // Initial data seeding
  seedData: true,
  createIndexes: true,
  
  // Admin user for local development
  adminUser: {
    email: 'admin@kitabi.local',
    password: 'admin123',
    name: 'Local Admin',
    role: 'admin'
  }
};
