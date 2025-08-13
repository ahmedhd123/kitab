#!/usr/bin/env node

/**
 * 🐘 POSTGRESQL DATABASE SETUP AND SEEDING
 * ======================================
 * Sets up PostgreSQL database with initial data for Kitabi
 */

const { User, Book, Review, sequelize } = require('../src/models/postgres');
const path = require('path');
const fs = require('fs');

// Load sample data
let sampleUsers = [];
let sampleBooks = [];

try {
  const usersPath = path.join(__dirname, '../data/sample-users.json');
  const booksPath = path.join(__dirname, '../data/sample-books.json');
  
  if (fs.existsSync(usersPath)) {
    sampleUsers = JSON.parse(fs.readFileSync(usersPath, 'utf8')).users || [];
  }
  
  if (fs.existsSync(booksPath)) {
    sampleBooks = JSON.parse(fs.readFileSync(booksPath, 'utf8')).books || [];
  }
  
  console.log(`📚 Loaded ${sampleUsers.length} sample users`);
  console.log(`📖 Loaded ${sampleBooks.length} sample books`);
} catch (error) {
  console.warn('⚠️  Could not load sample data:', error.message);
}

async function setupDatabase() {
  try {
    console.log('🐘 Setting up PostgreSQL database for Kitabi...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connection established');
    
    // Sync database (create tables)
    console.log('🏗️  Creating database tables...');
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Database tables synchronized');
    
    // Check existing data
    const userCount = await User.count();
    const bookCount = await Book.count();
    const reviewCount = await Review.count();
    
    console.log(`📊 Current database state:`);
    console.log(`   👥 Users: ${userCount}`);
    console.log(`   📚 Books: ${bookCount}`);
    console.log(`   ⭐ Reviews: ${reviewCount}`);
    
    return { userCount, bookCount, reviewCount };
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  }
}

async function seedUsers() {
  try {
    console.log('👥 Seeding users...');
    
    const existingCount = await User.count();
    if (existingCount > 0) {
      console.log(`ℹ️  Found ${existingCount} existing users, skipping user seeding`);
      return existingCount;
    }
    
    // Create admin user
    const adminUser = await User.create({
      email: 'admin@kitabi.com',
      password: 'admin123',
      username: 'admin',
      firstName: 'مدير',
      lastName: 'النظام',
      role: 'admin',
      isAdmin: true,
      bio: 'مدير نظام كتابي'
    });
    
    console.log('✅ Admin user created');
    
    // Create sample users from data
    let createdUsers = 1;
    for (const userData of sampleUsers.slice(0, 10)) {
      try {
        await User.create({
          email: userData.email,
          password: userData.password || 'user123',
          username: userData.username,
          firstName: userData.firstName || userData.profile?.firstName || 'مستخدم',
          lastName: userData.lastName || userData.profile?.lastName || 'كتابي',
          role: userData.role || 'user',
          isAdmin: userData.isAdmin || false,
          bio: userData.bio || 'مستخدم في منصة كتابي',
          favoriteGenres: userData.favoriteGenres || []
        });
        createdUsers++;
      } catch (userError) {
        console.warn(`⚠️  Could not create user ${userData.email}:`, userError.message);
      }
    }
    
    console.log(`✅ Created ${createdUsers} users`);
    return createdUsers;
    
  } catch (error) {
    console.error('❌ User seeding failed:', error);
    throw error;
  }
}

async function seedBooks() {
  try {
    console.log('📚 Seeding books...');
    
    const existingCount = await Book.count();
    if (existingCount > 0) {
      console.log(`ℹ️  Found ${existingCount} existing books, skipping book seeding`);
      return existingCount;
    }
    
    // Get admin user for book ownership
    const adminUser = await User.findOne({ where: { email: 'admin@kitabi.com' } });
    
    let createdBooks = 0;
    for (const bookData of sampleBooks.slice(0, 20)) {
      try {
        await Book.create({
          title: bookData.title,
          author: bookData.author,
          isbn: bookData.isbn,
          description: bookData.description || `كتاب رائع بعنوان "${bookData.title}" للكاتب ${bookData.author}`,
          genre: bookData.genre || 'أدب',
          genres: Array.isArray(bookData.genres) ? bookData.genres : [bookData.genre || 'أدب'],
          language: bookData.language || 'ar',
          publishedDate: bookData.publishedDate ? new Date(bookData.publishedDate) : new Date(),
          pageCount: bookData.pageCount || Math.floor(Math.random() * 400) + 100,
          coverImage: bookData.coverImage || bookData.cover,
          fileUrl: bookData.fileUrl || bookData.downloadUrl,
          fileType: bookData.fileType || 'pdf',
          fileSize: bookData.fileSize || Math.floor(Math.random() * 10000000) + 1000000,
          tags: Array.isArray(bookData.tags) ? bookData.tags : [],
          isPublic: bookData.isPublic !== false,
          isFeatured: Math.random() > 0.8,
          addedBy: adminUser ? adminUser.id : null
        });
        createdBooks++;
      } catch (bookError) {
        console.warn(`⚠️  Could not create book "${bookData.title}":`, bookError.message);
      }
    }
    
    console.log(`✅ Created ${createdBooks} books`);
    return createdBooks;
    
  } catch (error) {
    console.error('❌ Book seeding failed:', error);
    throw error;
  }
}

async function seedReviews() {
  try {
    console.log('⭐ Seeding reviews...');
    
    const existingCount = await Review.count();
    if (existingCount > 0) {
      console.log(`ℹ️  Found ${existingCount} existing reviews, skipping review seeding`);
      return existingCount;
    }
    
    // Get users and books for reviews
    const users = await User.findAll({ limit: 10 });
    const books = await Book.findAll({ limit: 10 });
    
    if (users.length === 0 || books.length === 0) {
      console.log('⚠️  No users or books found, skipping review seeding');
      return 0;
    }
    
    const reviewComments = [
      'كتاب رائع ومفيد جداً',
      'أسلوب الكاتب ممتاز ومشوق',
      'استفدت كثيراً من هذا الكتاب',
      'محتوى غني ومعلومات قيمة',
      'أنصح بقراءة هذا الكتاب',
      'كتاب ملهم ويستحق القراءة',
      'معلومات مفيدة وأسلوب سهل',
      'تجربة قراءة ممتعة',
      'كتاب شامل ومرجع مهم',
      'أعجبني الكتاب كثيراً'
    ];
    
    let createdReviews = 0;
    
    // Create reviews for each book
    for (const book of books) {
      const numReviews = Math.floor(Math.random() * 3) + 1; // 1-3 reviews per book
      
      for (let i = 0; i < numReviews && i < users.length; i++) {
        try {
          await Review.create({
            userId: users[i].id,
            bookId: book.id,
            rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
            comment: reviewComments[Math.floor(Math.random() * reviewComments.length)],
            isPublic: true
          });
          createdReviews++;
        } catch (reviewError) {
          console.warn(`⚠️  Could not create review:`, reviewError.message);
        }
      }
    }
    
    console.log(`✅ Created ${createdReviews} reviews`);
    
    // Update book ratings
    console.log('🔄 Updating book ratings...');
    for (const book of books) {
      await book.updateRating();
    }
    
    return createdReviews;
    
  } catch (error) {
    console.error('❌ Review seeding failed:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('🚀 Starting PostgreSQL database setup for Kitabi...');
    console.log('='.repeat(60));
    
    // Setup database
    const dbStats = await setupDatabase();
    
    // Seed data if needed
    if (dbStats.userCount === 0 || dbStats.bookCount === 0) {
      console.log('\n🌱 Database is empty, seeding with initial data...');
      
      const userCount = await seedUsers();
      const bookCount = await seedBooks();
      const reviewCount = await seedReviews();
      
      console.log('\n📊 Seeding completed:');
      console.log(`   👥 Users created: ${userCount}`);
      console.log(`   📚 Books created: ${bookCount}`);
      console.log(`   ⭐ Reviews created: ${reviewCount}`);
    } else {
      console.log('\n✅ Database already contains data, skipping seeding');
    }
    
    // Final stats
    const finalUserCount = await User.count();
    const finalBookCount = await Book.count();
    const finalReviewCount = await Review.count();
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 PostgreSQL Database Setup Complete!');
    console.log('='.repeat(60));
    console.log(`👥 Total Users: ${finalUserCount}`);
    console.log(`📚 Total Books: ${finalBookCount}`);
    console.log(`⭐ Total Reviews: ${finalReviewCount}`);
    console.log('\n📋 Admin Login:');
    console.log('   Email: admin@kitabi.com');
    console.log('   Password: admin123');
    console.log('\n🌐 Database ready for Kitabi application!');
    
    process.exit(0);
    
  } catch (error) {
    console.error('💥 Setup failed:', error);
    process.exit(1);
  }
}

// Run setup if called directly
if (require.main === module) {
  main();
}

module.exports = { setupDatabase, seedUsers, seedBooks, seedReviews };
