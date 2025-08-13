/**
 * MongoDB Atlas Database Setup and User Management
 * Complete setup for production authentication system
 */

const mongoose = require('mongoose');
const User = require('../src/models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Color codes for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

console.log(`${colors.cyan}${colors.bright}
🚀 MongoDB Atlas Authentication Setup
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${colors.reset}`);

async function setupAuthentication() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        
        if (!mongoUri) {
            console.log(`${colors.red}❌ MONGODB_URI not found in environment variables${colors.reset}`);
            return false;
        }

        console.log(`${colors.blue}📡 Connecting to MongoDB Atlas...${colors.reset}`);
        
        await mongoose.connect(mongoUri, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });

        console.log(`${colors.green}✅ Connected to MongoDB Atlas successfully!${colors.reset}`);

        // Create admin user if doesn't exist
        const adminEmail = 'admin@kitabi.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
            console.log(`${colors.yellow}👨‍💼 Creating admin user...${colors.reset}`);
            
            const hashedPassword = await bcrypt.hash('admin123', 12);
            
            const adminUser = new User({
                username: 'admin',
                email: adminEmail,
                password: hashedPassword,
                profile: {
                    firstName: 'مدير',
                    lastName: 'الموقع',
                    bio: 'مدير منصة كتابي'
                },
                role: 'admin',
                isAdmin: true,
                status: 'active',
                permissions: [
                    'users:read', 'users:write', 'users:delete',
                    'books:read', 'books:write', 'books:delete',
                    'reviews:read', 'reviews:write', 'reviews:delete',
                    'admin:dashboard', 'admin:analytics', 'admin:settings'
                ],
                stats: {
                    booksRead: 0,
                    reviewsWritten: 0,
                    averageRating: 0
                }
            });

            await adminUser.save();
            console.log(`${colors.green}✅ Admin user created successfully${colors.reset}`);
        } else {
            console.log(`${colors.yellow}ℹ️ Admin user already exists${colors.reset}`);
        }

        // Create test user if doesn't exist
        const testEmail = 'test@kitabi.com';
        const existingTest = await User.findOne({ email: testEmail });

        if (!existingTest) {
            console.log(`${colors.yellow}👤 Creating test user...${colors.reset}`);
            
            const hashedPassword = await bcrypt.hash('test123', 12);
            
            const testUser = new User({
                username: 'testuser',
                email: testEmail,
                password: hashedPassword,
                profile: {
                    firstName: 'مستخدم',
                    lastName: 'تجريبي',
                    bio: 'حساب تجريبي للاختبار'
                },
                role: 'user',
                isAdmin: false,
                status: 'active',
                favoriteGenres: ['رواية', 'تطوير ذات', 'تاريخ'],
                stats: {
                    booksRead: 5,
                    reviewsWritten: 3,
                    averageRating: 4.2
                }
            });

            await testUser.save();
            console.log(`${colors.green}✅ Test user created successfully${colors.reset}`);
        } else {
            console.log(`${colors.yellow}ℹ️ Test user already exists${colors.reset}`);
        }

        // Display database statistics
        const totalUsers = await User.countDocuments();
        const adminUsers = await User.countDocuments({ role: 'admin' });
        const activeUsers = await User.countDocuments({ status: 'active' });

        console.log(`${colors.green}📊 Database Statistics:${colors.reset}`);
        console.log(`   • Total Users: ${totalUsers}`);
        console.log(`   • Admin Users: ${adminUsers}`);
        console.log(`   • Active Users: ${activeUsers}`);

        // Test authentication
        console.log(`${colors.blue}🔐 Testing authentication...${colors.reset}`);
        
        const admin = await User.findOne({ email: adminEmail }).select('+password');
        if (admin) {
            const isValidPassword = await bcrypt.compare('admin123', admin.password);
            if (isValidPassword) {
                console.log(`${colors.green}✅ Admin authentication test passed${colors.reset}`);
            } else {
                console.log(`${colors.red}❌ Admin authentication test failed${colors.reset}`);
            }
        }

        console.log(`${colors.green}${colors.bright}
🎉 MongoDB Atlas Authentication Setup Complete!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔑 Login Credentials:
   Admin: admin@kitabi.com / admin123
   Test:  test@kitabi.com / test123

✅ Ready for production use!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${colors.reset}`);

        return true;

    } catch (error) {
        console.log(`${colors.red}❌ Setup failed: ${error.message}${colors.reset}`);
        console.log(`${colors.yellow}📚 Troubleshooting:${colors.reset}`);
        console.log(`   1. Check MongoDB Atlas connection string`);
        console.log(`   2. Verify IP whitelist settings`);
        console.log(`   3. Ensure database user has write permissions`);
        console.log(`   4. Check network connectivity`);
        return false;
    } finally {
        await mongoose.disconnect();
        console.log(`${colors.blue}👋 Disconnected from MongoDB Atlas${colors.reset}`);
    }
}

// Run setup if called directly
if (require.main === module) {
    setupAuthentication()
        .then((success) => {
            process.exit(success ? 0 : 1);
        })
        .catch((error) => {
            console.error(`${colors.red}Unexpected error:${colors.reset}`, error);
            process.exit(1);
        });
}

module.exports = { setupAuthentication };
