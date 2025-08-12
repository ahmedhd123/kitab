/**
 * MongoDB Atlas Setup Script
 * This script initializes the MongoDB Atlas database with sample data
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('../src/models/Book');
const User = require('../src/models/User');
const bcrypt = require('bcryptjs');

// Sample data
const sampleBooks = require('../data/sample-books.json');

const sampleUsers = [
  {
    name: "مدير النظام",
    username: "admin",
    email: "admin@kitabi.com",
    password: "admin123",
    isAdmin: true,
    role: "admin",
    status: "active",
    bio: "مدير النظام الرئيسي لمنصة كتابي",
    avatar: "https://via.placeholder.com/150x150?text=Admin",
    favoriteGenres: ["تقنية", "إدارة", "فلسفة"],
    readingGoal: 50,
    booksRead: 25,
    isEmailVerified: true
  },
  {
    name: "أحمد محمد",
    username: "ahmed",
    email: "ahmed@example.com",
    password: "user123",
    isAdmin: false,
    role: "user",
    status: "active",
    bio: "قارئ شغوف للأدب العربي والكتب التقنية",
    avatar: "https://via.placeholder.com/150x150?text=Ahmed",
    favoriteGenres: ["أدب عربي", "تقنية", "تاريخ"],
    readingGoal: 30,
    booksRead: 15,
    isEmailVerified: true
  },
  {
    name: "فاطمة علي",
    username: "fatima",
    email: "fatima@example.com", 
    password: "user123",
    isAdmin: false,
    role: "user",
    status: "active",
    bio: "أحب الروايات والشعر العربي الكلاسيكي",
    avatar: "https://via.placeholder.com/150x150?text=Fatima",
    favoriteGenres: ["رواية", "شعر", "أدب كلاسيكي"],
    readingGoal: 25,
    booksRead: 20,
    isEmailVerified: true
  },
  {
    name: "محمد صالح",
    username: "mohammed",
    email: "mohammed@example.com",
    password: "user123", 
    isAdmin: false,
    role: "user",
    status: "active",
    bio: "مهتم بالكتب العلمية والفلسفية",
    avatar: "https://via.placeholder.com/150x150?text=Mohammed",
    favoriteGenres: ["علوم", "فلسفة", "تطوير ذاتي"],
    readingGoal: 40,
    booksRead: 12,
    isEmailVerified: true
  }
];

async function setupAtlasDatabase() {
  try {
    // Check if MONGODB_URI exists and contains Atlas connection
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    if (!mongoUri.includes('mongodb+srv://')) {
      console.log('⚠️  Warning: MONGODB_URI does not appear to be an Atlas connection string');
      console.log('   Make sure you are using the correct Atlas connection string');
    }

    console.log('🔌 Connecting to MongoDB Atlas...');
    console.log(`   URI: ${mongoUri.replace(/\/\/.*@/, '//***@')}`);
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority'
    });

    console.log('✅ Connected to MongoDB Atlas successfully');
    console.log(`   Database: ${mongoose.connection.db.databaseName}`);

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Book.deleteMany({});
    await User.deleteMany({});
    console.log('   ✅ Existing data cleared');

    // Insert books
    console.log('📚 Inserting sample books...');
    const insertedBooks = await Book.insertMany(sampleBooks);
    console.log(`   ✅ Inserted ${insertedBooks.length} books`);

    // Hash passwords and insert users
    console.log('👥 Creating sample users...');
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 12);
        return {
          ...user,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date()
        };
      })
    );

    const insertedUsers = await User.insertMany(hashedUsers);
    console.log(`   ✅ Created ${insertedUsers.length} users`);

    // Display summary
    console.log('\n🎉 MongoDB Atlas setup completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Database Summary:');
    console.log(`   🗄️  Database: ${mongoose.connection.db.databaseName}`);
    console.log(`   📚 Books: ${insertedBooks.length}`);
    console.log(`   👥 Users: ${insertedUsers.length}`);
    console.log('');
    console.log('🔐 Admin Login:');
    console.log('   📧 Email: admin@kitabi.com');
    console.log('   🔑 Password: admin123');
    console.log('');
    console.log('👤 Test Users:');
    sampleUsers.filter(u => !u.isAdmin).forEach(user => {
      console.log(`   📧 ${user.email} | 🔑 ${user.password}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 Your Kitabi platform is ready!');

  } catch (error) {
    console.error('❌ Atlas setup failed:', error.message);
    
    if (error.message.includes('MONGODB_URI')) {
      console.log('\n💡 Setup Instructions:');
      console.log('1. Get your MongoDB Atlas connection string');
      console.log('2. Update MONGODB_URI in your .env file');
      console.log('3. Replace <password> with your actual password');
      console.log('4. Run this script again');
    }
    
    if (error.message.includes('authentication')) {
      console.log('\n🔐 Authentication Error:');
      console.log('1. Check your username and password in the connection string');
      console.log('2. Verify the user exists in Database Access');
      console.log('3. Ensure the user has read/write permissions');
    }
    
    if (error.message.includes('network') || error.message.includes('timeout')) {
      console.log('\n🌐 Network Error:');
      console.log('1. Check your internet connection');
      console.log('2. Verify Network Access settings in Atlas');
      console.log('3. Add your IP address to the whitelist');
    }
    
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Test connection function
async function testConnection() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.log('❌ MONGODB_URI not found in .env file');
      return false;
    }

    console.log('🔍 Testing MongoDB Atlas connection...');
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });

    console.log('✅ Connection test successful!');
    console.log(`   Database: ${mongoose.connection.db.databaseName}`);
    return true;
    
  } catch (error) {
    console.log('❌ Connection test failed:', error.message);
    return false;
  } finally {
    await mongoose.connection.close();
  }
}

// Run based on command line argument
const command = process.argv[2];

if (command === 'test') {
  testConnection();
} else if (command === 'setup') {
  setupAtlasDatabase();
} else {
  console.log('📋 MongoDB Atlas Management Script');
  console.log('');
  console.log('Usage:');
  console.log('  npm run atlas:test   - Test connection to Atlas');
  console.log('  npm run atlas:setup  - Setup Atlas with sample data');
  console.log('');
  console.log('Or run directly:');
  console.log('  node scripts/setup-atlas.js test');
  console.log('  node scripts/setup-atlas.js setup');
}
