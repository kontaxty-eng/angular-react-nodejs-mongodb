import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('register', () => {
    it('should register a user and store token', () => {
      const credentials = { email: 'test@example.com', password: 'password123' };
      const response = { token: 'jwt_token', email: 'test@example.com' };

      service.register(credentials.email, credentials.password).subscribe(res => {
        expect(res).toEqual(response);
        expect(localStorage.getItem('token')).toBe('jwt_token');
      });

      const req = httpMock.expectOne('/api/auth/register');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      req.flush(response);
    });

    it('should handle registration error', () => {
      const credentials = { email: 'existing@example.com', password: 'password123' };

      service.register(credentials.email, credentials.password).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(409);
        }
      });

      const req = httpMock.expectOne('/api/auth/register');
      req.flush({ message: 'Email already registered' }, { status: 409, statusText: 'Conflict' });
    });
  });

  describe('login', () => {
    it('should login a user and store token', () => {
      const credentials = { email: 'test@example.com', password: 'password123' };
      const response = { token: 'jwt_token', email: 'test@example.com' };

      service.login(credentials.email, credentials.password).subscribe(res => {
        expect(res).toEqual(response);
        expect(localStorage.getItem('token')).toBe('jwt_token');
      });

      const req = httpMock.expectOne('/api/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      req.flush(response);
    });

    it('should handle invalid credentials', () => {
      const credentials = { email: 'test@example.com', password: 'wrongpassword' };

      service.login(credentials.email, credentials.password).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne('/api/auth/login');
      req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('getProfile', () => {
    it('should get user profile when token exists', () => {
      localStorage.setItem('token', 'valid_token');
      const profile = { email: 'test@example.com' };

      service.getProfile().subscribe(res => {
        expect(res).toEqual(profile);
      });

      const req = httpMock.expectOne('/api/auth/profile');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('Bearer valid_token');
      req.flush(profile);
    });

    it('should handle missing token', () => {
      service.getProfile().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne('/api/auth/profile');
      req.flush({ message: 'Missing token' }, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('logout', () => {
    it('should remove token from localStorage', () => {
      localStorage.setItem('token', 'jwt_token');
      expect(localStorage.getItem('token')).toBe('jwt_token');

      service.logout();

      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('isLoggedIn', () => {
    it('should return true when token exists', () => {
      localStorage.setItem('token', 'jwt_token');
      expect(service.isLoggedIn()).toBe(true);
    });

    it('should return false when token does not exist', () => {
      expect(service.isLoggedIn()).toBe(false);
    });
  });
});
