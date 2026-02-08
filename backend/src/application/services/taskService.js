const taskRepository = require('../../infrastructure/repositories/taskRepository');
const AppError = require('../errors/AppError');

const listTasks = async (page = 1, limit = 8, search = '') => {
  const skip = (page - 1) * limit;
  
  // Build search filter
  let searchFilter = {};
  if (search) {
    searchFilter = {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    };
  }
  
  const [tasks, total] = await Promise.all([
    taskRepository.findAll({ skip, limit, sort: { createdAt: -1 }, search }),
    taskRepository.count(searchFilter)
  ]);
  
  return {
    tasks,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit
    }
  };
};

const createTask = async (data) => {
  if (!data?.title) {
    throw new AppError('Title required', 400);
  }

  return taskRepository.create({
    title: data.title,
    description: data.description,
    completed: data.completed ?? false
  });
};

const updateTask = async (id, data) => {
  const task = await taskRepository.findById(id);
  if (!task) {
    throw new AppError('Task not found', 404);
  }

  return taskRepository.update(id, data);
};

module.exports = {
  listTasks,
  createTask,
  updateTask
};
