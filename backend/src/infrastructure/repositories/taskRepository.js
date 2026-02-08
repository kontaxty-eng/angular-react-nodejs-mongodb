const Task = require('../models/Task');

class TaskRepository {
  async findAll(options = {}) {
    const { skip = 0, limit = 10, sort = { createdAt: -1 }, search = '' } = options;
    
    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    return Task.find(query).sort(sort).skip(skip).limit(limit);
  }

  async count(filter = {}) {
    return Task.countDocuments(filter);
  }

  async findById(id) {
    return Task.findById(id);
  }

  async create(data) {
    return Task.create(data);
  }

  async update(id, data) {
    return Task.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return Task.findByIdAndDelete(id);
  }
}

module.exports = new TaskRepository();
