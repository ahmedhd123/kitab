/**
 * 🗃️ POSTGRESQL MODELS FOR KITABI
 * ==============================
 * Sequelize models replacing MongoDB collections
 */

const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database_postgres');

// =============================================================================
// USER MODEL
// =============================================================================
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
    allowNull: false,
    set(value) {
      // Hash password before saving
      const hashedPassword = bcrypt.hashSync(value, 12);
      this.setDataValue('password', hashedPassword);
    }
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
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    { fields: ['email'] },
    { fields: ['username'] },
    { fields: ['role'] }
  ]
});

// User instance methods
User.prototype.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

User.prototype.getPublicProfile = function() {
  const user = this.toJSON();
  delete user.password;
  return user;
};

// =============================================================================
// BOOK MODEL
// =============================================================================
const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isbn: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: true
  },
  genres: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  language: {
    type: DataTypes.STRING,
    defaultValue: 'ar'
  },
  publishedDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  pageCount: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  coverImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fileType: {
    type: DataTypes.ENUM('pdf', 'epub', 'mobi', 'txt'),
    defaultValue: 'pdf'
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  downloadCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  averageRating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.0
  },
  totalRatings: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  addedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'books',
  timestamps: true,
  indexes: [
    { fields: ['title'] },
    { fields: ['author'] },
    { fields: ['genre'] },
    { fields: ['isbn'] },
    { fields: ['language'] },
    { fields: ['isPublic'] },
    { fields: ['isFeatured'] },
    { fields: ['averageRating'] },
    { fields: ['downloadCount'] }
  ]
});

// Book instance methods
Book.prototype.incrementDownload = async function() {
  this.downloadCount += 1;
  await this.save();
  return this.downloadCount;
};

Book.prototype.incrementView = async function() {
  this.viewCount += 1;
  await this.save();
  return this.viewCount;
};

Book.prototype.updateRating = async function() {
  const reviews = await Review.findAll({
    where: { bookId: this.id },
    attributes: ['rating']
  });
  
  if (reviews.length > 0) {
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating = (total / reviews.length).toFixed(2);
    this.totalRatings = reviews.length;
  } else {
    this.averageRating = 0;
    this.totalRatings = 0;
  }
  
  await this.save();
  return this.averageRating;
};

// =============================================================================
// REVIEW MODEL
// =============================================================================
const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  bookId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'books',
      key: 'id'
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  likedBy: {
    type: DataTypes.JSON,
    defaultValue: []
  }
}, {
  tableName: 'reviews',
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['bookId'] },
    { fields: ['rating'] },
    { fields: ['isPublic'] },
    { unique: true, fields: ['userId', 'bookId'] } // One review per user per book
  ]
});

// =============================================================================
// ASSOCIATIONS
// =============================================================================

// User associations
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
User.hasMany(Book, { foreignKey: 'addedBy', as: 'addedBooks' });

// Book associations
Book.hasMany(Review, { foreignKey: 'bookId', as: 'reviews' });
Book.belongsTo(User, { foreignKey: 'addedBy', as: 'addedByUser' });

// Review associations
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Review.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });

// =============================================================================
// HOOKS
// =============================================================================

// After creating/updating/deleting a review, update book rating
Review.addHook('afterCreate', async (review) => {
  const book = await Book.findByPk(review.bookId);
  if (book) {
    await book.updateRating();
  }
});

Review.addHook('afterUpdate', async (review) => {
  const book = await Book.findByPk(review.bookId);
  if (book) {
    await book.updateRating();
  }
});

Review.addHook('afterDestroy', async (review) => {
  const book = await Book.findByPk(review.bookId);
  if (book) {
    await book.updateRating();
  }
});

// =============================================================================
// EXPORT MODELS
// =============================================================================

module.exports = {
  User,
  Book,
  Review,
  sequelize
};
