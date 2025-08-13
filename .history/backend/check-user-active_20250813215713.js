require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

// Database connection using environment variable
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: console.log, // Enable detailed logging
    dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? {
            require: true,
            rejectUnauthorized: false
        } : false
    }
});

// User model definition
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  favoriteGenres: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  preferences: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
}, {
  tableName: 'users',
  timestamps: true
});

async function checkUserActive() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected');
        
        // Find the most recent test user
        const user = await User.findOne({
            where: {
                email: {
                    [Sequelize.Op.like]: 'testuser%@postgresql.test'
                }
            },
            order: [['createdAt', 'DESC']]
        });
        
        if (user) {
            console.log('👤 Found user:');
            console.log('📧 Email:', user.email);
            console.log('👤 Username:', user.username);
            console.log('🔴 isActive:', user.isActive);
            console.log('🔴 isActive type:', typeof user.isActive);
            console.log('🏷️ Role:', user.role);
            console.log('🛡️ isAdmin:', user.isAdmin);
            console.log('📅 Created:', user.createdAt);
            
            console.log('\n🔍 Raw user data:');
            console.log(user.toJSON());
        } else {
            console.log('❌ No test user found');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

checkUserActive();
