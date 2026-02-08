const bcrypt = require('bcryptjs');
const authService = require('../../../application/services/authService');
const userRepository = require('../../../infrastructure/repositories/userRepository');
const { signToken, verifyToken } = require('../../../infrastructure/security/jwt');
const AppError = require('../../../application/errors/AppError');

// Mock dependencies
jest.mock('../../../infrastructure/repositories/userRepository');
jest.mock('../../../infrastructure/security/jwt');
jest.mock('bcryptjs');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = 'hashed_password';
      const mockUser = { _id: '123', email: 'test@example.com', passwordHash: hashedPassword };
      const mockToken = 'jwt_token';

      userRepository.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue(hashedPassword);
      userRepository.create.mockResolvedValue(mockUser);
      signToken.mockReturnValue(mockToken);

      const result = await authService.register(email, password);

      expect(result).toEqual({ token: mockToken, email: 'test@example.com' });
      expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(userRepository.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        passwordHash: hashedPassword
      });
      expect(signToken).toHaveBeenCalledWith(mockUser);
    });

    it('should convert email to lowercase', async () => {
      const email = 'Test@Example.COM';
      const hashedPassword = 'hashed';
      const mockUser = { _id: '123', email: 'test@example.com', passwordHash: hashedPassword };

      userRepository.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue(hashedPassword);
      userRepository.create.mockResolvedValue(mockUser);
      signToken.mockReturnValue('token');

      await authService.register(email, 'password');

      expect(userRepository.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        passwordHash: hashedPassword
      });
    });

    it('should throw error if email is missing', async () => {
      await expect(authService.register('', 'password'))
        .rejects
        .toThrow(new AppError('Email and password required', 400));

      expect(userRepository.findByEmail).not.toHaveBeenCalled();
    });

    it('should throw error if password is missing', async () => {
      await expect(authService.register('test@example.com', ''))
        .rejects
        .toThrow(new AppError('Email and password required', 400));

      expect(userRepository.findByEmail).not.toHaveBeenCalled();
    });

    it('should throw error if email already exists', async () => {
      const email = 'existing@example.com';
      userRepository.findByEmail.mockResolvedValue({ email });

      await expect(authService.register(email, 'password'))
        .rejects
        .toThrow(new AppError('Email already registered', 409));

      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(userRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const mockUser = { _id: '123', email, passwordHash: 'hashed' };
      const mockToken = 'jwt_token';

      userRepository.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      signToken.mockReturnValue(mockToken);

      const result = await authService.login(email, password);

      expect(result).toEqual({ token: mockToken, email });
      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, 'hashed');
      expect(signToken).toHaveBeenCalledWith(mockUser);
    });

    it('should throw error if email is missing', async () => {
      await expect(authService.login('', 'password'))
        .rejects
        .toThrow(new AppError('Email and password required', 400));
    });

    it('should throw error if password is missing', async () => {
      await expect(authService.login('test@example.com', ''))
        .rejects
        .toThrow(new AppError('Email and password required', 400));
    });

    it('should throw error if user not found', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.login('nonexistent@example.com', 'password'))
        .rejects
        .toThrow(new AppError('Invalid credentials', 401));

      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw error if password is incorrect', async () => {
      const mockUser = { _id: '123', email: 'test@example.com', passwordHash: 'hashed' };
      userRepository.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await expect(authService.login('test@example.com', 'wrongpassword'))
        .rejects
        .toThrow(new AppError('Invalid credentials', 401));

      expect(signToken).not.toHaveBeenCalled();
    });
  });

  describe('getProfile', () => {
    it('should return user profile with valid token', async () => {
      const mockToken = 'valid_token';
      const mockPayload = { sub: '123' };
      const mockUser = { _id: '123', email: 'test@example.com', passwordHash: 'hashed' };

      verifyToken.mockReturnValue(mockPayload);
      userRepository.findById.mockResolvedValue(mockUser);

      const result = await authService.getProfile(mockToken);

      expect(result).toEqual({ email: 'test@example.com' });
      expect(verifyToken).toHaveBeenCalledWith(mockToken);
      expect(userRepository.findById).toHaveBeenCalledWith('123');
    });

    it('should throw error if token is missing', async () => {
      await expect(authService.getProfile(''))
        .rejects
        .toThrow(new AppError('Missing token', 401));

      expect(verifyToken).not.toHaveBeenCalled();
    });

    it('should throw error if token is invalid', async () => {
      const mockToken = 'invalid_token';
      verifyToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.getProfile(mockToken))
        .rejects
        .toThrow(new AppError('Invalid token', 401));
    });

    it('should throw error if user not found', async () => {
      const mockToken = 'valid_token';
      const mockPayload = { sub: '123' };

      verifyToken.mockReturnValue(mockPayload);
      userRepository.findById.mockResolvedValue(null);

      await expect(authService.getProfile(mockToken))
        .rejects
        .toThrow(new AppError('User not found', 404));
    });
  });
});
