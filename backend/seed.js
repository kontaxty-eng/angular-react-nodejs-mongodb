const mongoose = require('mongoose');
require('dotenv').config();

const Task = require('./src/infrastructure/models/Task');

const seedTasks = [
  { title: 'Complete project documentation', description: 'Write comprehensive docs for the Angular MongoDB project', completed: false },
  { title: 'Implement user authentication', description: 'Add JWT-based authentication system', completed: true },
  { title: 'Create task management UI', description: 'Build Angular components for task CRUD operations', completed: false },
  { title: 'Setup Docker environment', description: 'Configure docker-compose for dev environment', completed: true },
  { title: 'Add unit tests', description: 'Write tests for backend services and controllers', completed: false },
  { title: 'Implement error handling', description: 'Add comprehensive error handling across the app', completed: false },
  { title: 'Setup CI/CD pipeline', description: 'Configure GitHub Actions for automated deployment', completed: false },
  { title: 'Add data validation', description: 'Implement input validation on frontend and backend', completed: true },
  { title: 'Performance optimization', description: 'Optimize queries and implement caching', completed: false },
  { title: 'Security audit', description: 'Review and fix security vulnerabilities', completed: false },
  { title: 'Complete project documentation2', description: 'Write comprehensive docs for the Angular MongoDB project', completed: false },
  { title: 'Implement user authentication2', description: 'Add JWT-based authentication system', completed: true },
  { title: 'Create task management UI2', description: 'Build Angular components for task CRUD operations', completed: false },
  { title: 'Setup Docker environment2', description: 'Configure docker-compose for dev environment', completed: true },
  { title: 'Add unit tests2', description: 'Write tests for backend services and controllers', completed: false },
  { title: 'Implement error handling2', description: 'Add comprehensive error handling across the app', completed: false },
  { title: 'Setup CI/CD pipeline2', description: 'Configure GitHub Actions for automated deployment', completed: false },
  { title: 'Add data validation2', description: 'Implement input validation on frontend and backend', completed: true },
  { title: 'Performance optimization2', description: 'Optimize queries and implement caching', completed: false },
  { title: 'Security audit2', description: 'Review and fix security vulnerabilities', completed: false },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://mongo:27017/angular-nodejs-mongodb');
    console.log('Connected to MongoDB');

    // Clear existing tasks (optional)
    await Task.deleteMany({});
    console.log('Cleared existing tasks');

    // Log what we're trying to insert
    console.log(`Attempting to insert ${seedTasks.length} tasks`);

    // Insert tasks one by one to see which fail
    let successCount = 0;
    let failCount = 0;
    
    for (const taskData of seedTasks) {
      try {
        await Task.create(taskData);
        successCount++;
      } catch (error) {
        failCount++;
        console.error(`Failed to insert task "${taskData.title}":`, error.message);
      }
    }
    
    console.log(`Successfully inserted ${successCount} tasks, ${failCount} failed`);
    
    // Verify what was actually inserted
    const allTasks = await Task.find({});
    const completedTasks = await Task.find({ completed: true });
    const notCompletedTasks = await Task.find({ completed: false });
    console.log(`Database has ${allTasks.length} total tasks: ${completedTasks.length} completed, ${notCompletedTasks.length} not completed`);

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
