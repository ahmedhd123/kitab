// Simple in-memory user store for testing without MongoDB
class InMemoryUserStore {
  constructor() {
    this.users = new Map();
    this.nextId = 1;
  }

  async findOne(query) {
    if (query.email) {
      for (let [id, user] of this.users) {
        if (user.email === query.email) {
          return {
            ...user,
            _id: id,
            save: async () => {
              this.users.set(id, user);
              return user;
            },
            comparePassword: async (password) => {
              return user.password === `hashed_${password}`;
            }
          };
        }
      }
    }
    if (query.$or) {
      for (let [id, user] of this.users) {
        for (let condition of query.$or) {
          if ((condition.email && user.email === condition.email) ||
              (condition.username && user.username === condition.username)) {
            return {
              ...user,
              _id: id,
              save: async () => {
                this.users.set(id, user);
                return user;
              },
              comparePassword: async (password) => {
                return user.password === `hashed_${password}`;
              }
            };
          }
        }
      }
    }
    return null;
  }

  async findById(id) {
    const user = this.users.get(parseInt(id));
    return user ? {
      ...user,
      _id: id,
      save: async () => {
        this.users.set(parseInt(id), user);
        return user;
      },
      comparePassword: async (password) => {
        return user.password === `hashed_${password}`;
      }
    } : null;
  }

  async save(userData) {
    const id = this.nextId++;
    const user = {
      ...userData,
      _id: id,
      isActive: true,
      lastActive: new Date(),
      createdAt: new Date(),
      stats: {
        booksRead: 0,
        reviewsWritten: 0,
        averageRating: 0
      },
      profile: userData.profile || {}
    };
    
    // Simulate password hashing
    user.password = `hashed_${userData.password}`;
    
    this.users.set(id, user);
    return {
      ...user,
      save: async () => {
        this.users.set(id, user);
        return user;
      },
      comparePassword: async (password) => {
        return user.password === `hashed_${password}`;
      }
    };
  }

  async create(userData) {
    return this.save(userData);
  }
}

// Export singleton instance
module.exports = new InMemoryUserStore();
