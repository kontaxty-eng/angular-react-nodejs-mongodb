const taskController = require('../../../presentation/controllers/taskController');
const taskService = require('../../../application/services/taskService');

// Mock the service
jest.mock('../../../application/services/taskService');

describe('TaskController', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      query: {},
      params: {},
      body: {}
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  describe('list', () => {
    it('should return paginated tasks', async () => {
      const mockResult = {
        tasks: [{ _id: '1', title: 'Task 1' }],
        pagination: { currentPage: 1, totalPages: 1, totalItems: 1, itemsPerPage: 5 }
      };

      req.query = { page: '1', limit: '5' };
      taskService.listTasks.mockResolvedValue(mockResult);

      await taskController.list(req, res, next);

      expect(taskService.listTasks).toHaveBeenCalledWith(1, 5, '');
      expect(res.json).toHaveBeenCalledWith(mockResult);
      expect(next).not.toHaveBeenCalled();
    });

    it('should use default values if query params are missing', async () => {
      const mockResult = {
        tasks: [],
        pagination: { currentPage: 1, totalPages: 0, totalItems: 0, itemsPerPage: 5 }
      };

      taskService.listTasks.mockResolvedValue(mockResult);

      await taskController.list(req, res, next);

      expect(taskService.listTasks).toHaveBeenCalledWith(1, 5, '');
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('should pass search parameter to service', async () => {
      const mockResult = { tasks: [], pagination: {} };
      req.query = { page: '1', limit: '5', search: 'test' };
      taskService.listTasks.mockResolvedValue(mockResult);

      await taskController.list(req, res, next);

      expect(taskService.listTasks).toHaveBeenCalledWith(1, 5, 'test');
    });

    it('should call next with error on failure', async () => {
      const error = new Error('Database error');
      taskService.listTasks.mockRejectedValue(error);

      await taskController.list(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a task successfully', async () => {
      const taskData = { title: 'New Task', description: 'Description' };
      const createdTask = { _id: '123', ...taskData };

      req.body = taskData;
      taskService.createTask.mockResolvedValue(createdTask);

      await taskController.create(req, res, next);

      expect(taskService.createTask).toHaveBeenCalledWith(taskData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdTask);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error on failure', async () => {
      const error = new Error('Validation error');
      req.body = { description: 'No title' };
      taskService.createTask.mockRejectedValue(error);

      await taskController.create(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a task successfully', async () => {
      const taskId = '123';
      const updateData = { title: 'Updated Title' };
      const updatedTask = { _id: taskId, ...updateData };

      req.params = { id: taskId };
      req.body = updateData;
      taskService.updateTask.mockResolvedValue(updatedTask);

      await taskController.update(req, res, next);

      expect(taskService.updateTask).toHaveBeenCalledWith(taskId, updateData);
      expect(res.json).toHaveBeenCalledWith(updatedTask);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error if task not found', async () => {
      const error = new Error('Task not found');
      req.params = { id: 'nonexistent' };
      req.body = { title: 'Updated' };
      taskService.updateTask.mockRejectedValue(error);

      await taskController.update(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
