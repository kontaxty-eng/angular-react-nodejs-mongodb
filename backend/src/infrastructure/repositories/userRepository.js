const User = require('../models/User');

class UserRepository {
  async findByEmail(email) {
    // Include passwordHash for authentication
    return User.findOne({ email: email.toLowerCase() });
  }

  async findById(id) {
    // Exclude passwordHash for profile queries
    return User.findById(id).select('-passwordHash');
  }

  async create(data) {
    return User.create(data);
  }

  async update(id, data) {
    return User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select('-passwordHash');
  }

  async delete(id) {
    return User.findByIdAndDelete(id);
  }
}

module.exports = new UserRepository();
