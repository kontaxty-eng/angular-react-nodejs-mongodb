const Task = require('../../infrastructure/models/Task');

const seedTasks = [
  { title: 'Complete project documentation', description: 'Write comprehensive docs for the Angular MongoDB project', completed: false },
  { title: 'Implement user authentication', description: 'Add JWT-based authentication system', completed: true },
  { title: 'Create task management UI', description: 'Build Angular components for task CRUD operations', completed: false },
  { title: 'Setup Docker environment', description: 'Configure docker-compose for dev environment', completed: true },
  { title: 'Add unit tests', description: 'Write tests for backend services and controllers', completed: false },
];

exports.seed = async (req, res) => {
  try {
    // Clear existing tasks (optional - remove if you want to keep existing)
    // await Task.deleteMany({});
    
    const tasks = await Task.insertMany(seedTasks);
    res.json({ message: `Seeded ${tasks.length} tasks`, tasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
