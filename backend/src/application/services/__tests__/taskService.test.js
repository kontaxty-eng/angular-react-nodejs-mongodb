const taskService = require('../../../application/services/taskService');
const taskRepository = require('../../../infrastructure/repositories/taskRepository');
const AppError = require('../../../application/errors/AppError');

// Mock the repository
jest.mock('../../../infrastructure/repositories/taskRepository');

describe('TaskService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listTasks', () => {
    it('should return paginated tasks without search', async () => {
      const mockTasks = [
        { _id: '1', title: 'Task 1', description: 'Desc 1', completed: false },
        { _id: '2', title: 'Task 2', description: 'Desc 2', completed: true }
      ];

      taskRepository.findAll.mockResolvedValue(mockTasks);
      taskRepository.count.mockResolvedValue(10);

      const result = await taskService.listTasks(1, 5);

      expect(result.tasks).toEqual(mockTasks);
      expect(result.pagination).toEqual({
        currentPage: 1,
        totalPages: 2,
        totalItems: 10,
        itemsPerPage: 5
      });
      expect(taskRepository.findAll).toHaveBeenCalledWith({
        skip: 0,
        limit: 5,
        sort: { createdAt: -1 },
        search: ''
      });
    });

    it('should return filtered tasks with search term', async () => {
      const mockTasks = [
        { _id: '1', title: 'Test Task', description: 'Test description', completed: false }
      ];

      taskRepository.findAll.mockResolvedValue(mockTasks);
      taskRepository.count.mockResolvedValue(1);

      const result = await taskService.listTasks(1, 5, 'test');

      expect(result.tasks).toEqual(mockTasks);
      expect(result.pagination.totalItems).toBe(1);
      expect(taskRepository.findAll).toHaveBeenCalledWith({
        skip: 0,
        limit: 5,
        sort: { createdAt: -1 },
        search: 'test'
      });
      expect(taskRepository.count).toHaveBeenCalledWith({
        $or: [
          { title: { $regex: 'test', $options: 'i' } },
          { description: { $regex: 'test', $options: 'i' } }
        ]
      });
    });

    it('should calculate correct pagination for page 2', async () => {
      taskRepository.findAll.mockResolvedValue([]);
      taskRepository.count.mockResolvedValue(25);

      const result = await taskService.listTasks(2, 5);

      expect(result.pagination).toEqual({
        currentPage: 2,
        totalPages: 5,
        totalItems: 25,
        itemsPerPage: 5
      });
      expect(taskRepository.findAll).toHaveBeenCalledWith({
        skip: 5,
        limit: 5,
        sort: { createdAt: -1 },
        search: ''
      });
    });

    it('should use default values for page and limit', async () => {
      taskRepository.findAll.mockResolvedValue([]);
      taskRepository.count.mockResolvedValue(0);

      await taskService.listTasks();

      expect(taskRepository.findAll).toHaveBeenCalledWith({
        skip: 0,
        limit: 8,
        sort: { createdAt: -1 },
        search: ''
      });
    });
  });

  describe('createTask', () => {
    it('should create a task with valid data', async () => {
      const taskData = { title: 'New Task', description: 'New description' };
      const mockCreatedTask = { _id: '123', ...taskData, completed: false };

      taskRepository.create.mockResolvedValue(mockCreatedTask);

      const result = await taskService.createTask(taskData);

      expect(result).toEqual(mockCreatedTask);
      expect(taskRepository.create).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'New description',
        completed: false
      });
    });

    it('should throw error if title is missing', async () => {
      await expect(taskService.createTask({ description: 'Desc' }))
        .rejects
        .toThrow(new AppError('Title required', 400));

      expect(taskRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error if data is null', async () => {
      await expect(taskService.createTask(null))
        .rejects
        .toThrow(new AppError('Title required', 400));
    });

    it('should set completed to true if provided', async () => {
      const taskData = { title: 'Task', description: 'Desc', completed: true };
      taskRepository.create.mockResolvedValue(taskData);

      await taskService.createTask(taskData);

      expect(taskRepository.create).toHaveBeenCalledWith({
        title: 'Task',
        description: 'Desc',
        completed: true
      });
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', async () => {
      const taskId = '123';
      const existingTask = { _id: taskId, title: 'Old', description: 'Old desc' };
      const updateData = { title: 'Updated', description: 'Updated desc' };
      const updatedTask = { ...existingTask, ...updateData };

      taskRepository.findById.mockResolvedValue(existingTask);
      taskRepository.update.mockResolvedValue(updatedTask);

      const result = await taskService.updateTask(taskId, updateData);

      expect(result).toEqual(updatedTask);
      expect(taskRepository.findById).toHaveBeenCalledWith(taskId);
      expect(taskRepository.update).toHaveBeenCalledWith(taskId, updateData);
    });

    it('should throw error if task not found', async () => {
      const taskId = 'nonexistent';
      taskRepository.findById.mockResolvedValue(null);

      await expect(taskService.updateTask(taskId, { title: 'Updated' }))
        .rejects
        .toThrow(new AppError('Task not found', 404));

      expect(taskRepository.update).not.toHaveBeenCalled();
    });

    it('should allow partial updates', async () => {
      const taskId = '123';
      const existingTask = { _id: taskId, title: 'Old', description: 'Old desc' };
      const updateData = { completed: true };

      taskRepository.findById.mockResolvedValue(existingTask);
      taskRepository.update.mockResolvedValue({ ...existingTask, completed: true });

      await taskService.updateTask(taskId, updateData);

      expect(taskRepository.update).toHaveBeenCalledWith(taskId, updateData);
    });
  });
});
