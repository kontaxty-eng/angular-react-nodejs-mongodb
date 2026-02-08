# Unit Tests Documentation

## Overview

Comprehensive unit tests have been implemented for both backend and frontend to ensure code quality and reliability.

## Backend Tests (Node.js + Jest)

### Test Framework

- **Jest** - JavaScript testing framework
- **Coverage reporting** enabled

### Test Files Created

#### 1. TaskService Tests (`src/application/services/__tests__/taskService.test.js`)

Tests the business logic layer for task operations:

**Test Cases:**

- ✅ List tasks with pagination (default values)
- ✅ List tasks with search filtering
- ✅ Calculate pagination correctly for different pages
- ✅ Create task with valid data
- ✅ Create task validation (missing title)
- ✅ Create task with completed flag
- ✅ Update existing task
- ✅ Update task not found error
- ✅ Partial task updates

**Coverage:** 100% statements, 100% branches, 100% functions

#### 2. AuthService Tests (`src/application/services/__tests__/authService.test.js`)

Tests authentication and user management:

**Test Cases:**

- ✅ Register new user successfully
- ✅ Register with email normalization (lowercase)
- ✅ Register validation (missing email/password)
- ✅ Register duplicate email error
- ✅ Login with valid credentials
- ✅ Login validation errors
- ✅ Login with invalid credentials
- ✅ Get user profile with valid token
- ✅ Get profile with missing/invalid token
- ✅ Get profile when user not found

**Coverage:** 100% statements, 100% branches, 100% functions

#### 3. TaskController Tests (`src/presentation/controllers/__tests__/taskController.test.js`)

Tests the HTTP request handling layer:

**Test Cases:**

- ✅ List tasks with query parameters
- ✅ List tasks with default values
- ✅ List tasks with search parameter
- ✅ Error handling via next() middleware
- ✅ Create task successfully
- ✅ Update task successfully
- ✅ Controller error propagation

**Coverage:** 100% statements, 100% branches, 100% functions

### Running Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Current Coverage Summary

```
Test Suites: 3 passed, 3 total
Tests:       33 passed, 33 total

Core Services Coverage:
- authService.js:  100% coverage
- taskService.js:  100% coverage
- taskController.js: 100% coverage
```

## Frontend Tests (Angular + Jasmine/Karma)

### Test Framework

- **Jasmine** - Behavior-driven testing framework
- **Karma** - Test runner
- **Angular Testing Utilities** - TestBed, HttpTestingController

### Test Files Created

#### 1. TaskService Tests (`src/app/core/services/task.service.spec.ts`)

Tests HTTP communication for task operations:

**Test Cases:**

- ✅ Get tasks with pagination
- ✅ Get tasks with search parameter
- ✅ Get tasks with default values
- ✅ Search parameter omitted when empty
- ✅ Create new task
- ✅ Update task
- ✅ Update task completion status
- ✅ Delete task

**Key Features Tested:**

- HTTP request methods (GET, POST, PATCH, DELETE)
- Query parameter handling
- Request body validation
- Response mapping

#### 2. AuthService Tests (`src/app/core/services/auth.service.spec.ts`)

Tests authentication service:

**Test Cases:**

- ✅ Register user and store token
- ✅ Register error handling
- ✅ Login user and store token
- ✅ Login with invalid credentials
- ✅ Get user profile with token
- ✅ Get profile with missing token
- ✅ Logout removes token
- ✅ isLoggedIn() returns correct state

**Key Features Tested:**

- LocalStorage integration
- Token management
- Authorization headers
- Error handling

#### 3. ListComponent Tests (`src/app/features/list/list.component.spec.ts`)

Tests the task list component logic:

**Test Cases:**

- ✅ Component creation
- ✅ Load tasks on initialization
- ✅ Search filtering with debounce
- ✅ Clear search functionality
- ✅ Add task with valid form
- ✅ Add task validation (invalid form)
- ✅ Add task error handling
- ✅ Edit task (single and multiple)
- ✅ Update task with valid form
- ✅ Update task validation
- ✅ Cancel edit
- ✅ Page change handling
- ✅ Page size change handling

**Key Features Tested:**

- Form validation (ReactiveFormsModule)
- Signal updates
- Pagination logic
- Search with debounce (300ms)
- Multiple simultaneous edits (Map)
- Error handling

### Running Frontend Tests

```bash
cd frontend

# Run tests once
npm test

# Tests will run in Chrome browser
# Results displayed in terminal and browser
```

## Test Mocking Strategy

### Backend Mocks

- **Repository layer** - Mocked to isolate service logic
- **bcryptjs** - Mocked to avoid expensive hashing in tests
- **JWT utilities** - Mocked for token operations
- **Mongoose models** - Isolated via repository pattern

### Frontend Mocks

- **HttpClient** - Mocked via HttpTestingController
- **TaskService** - Spy objects with jasmine.createSpyObj
- **LocalStorage** - Cleared before each test

## Best Practices Followed

1. **Isolation**: Each test is independent and doesn't affect others
2. **AAA Pattern**: Arrange, Act, Assert structure
3. **Descriptive Names**: Test names clearly describe what is being tested
4. **Edge Cases**: Tests cover success paths, error paths, and edge cases
5. **Mock External Dependencies**: Services, HTTP calls, and storage are mocked
6. **Clean Up**: `beforeEach` and `afterEach` ensure clean state
7. **Coverage**: Critical business logic has 100% coverage

## What's Tested

### Backend

✅ Business logic (services)
✅ HTTP controllers
✅ Error handling
✅ Validation logic
✅ Authentication flow
✅ Pagination logic
✅ Search/filter functionality

### Frontend

✅ Service HTTP operations
✅ Component logic
✅ Form validation
✅ Signal state management
✅ Event handling
✅ Error handling
✅ Token management

## What's NOT Tested (Intentionally)

- Database models (Mongoose schemas)
- Database connection logic
- Express app configuration
- Route definitions (simple mappings)
- Environment configuration
- Third-party library code

## Future Test Enhancements

1. **Integration Tests**: Test full API endpoints with test database
2. **E2E Tests**: Test complete user flows with Cypress or Playwright
3. **Component E2E**: Test Angular components with user interactions
4. **Performance Tests**: Test pagination with large datasets
5. **Security Tests**: Test authentication edge cases
6. **Accessibility Tests**: Test frontend components for a11y

## CI/CD Integration

These tests are ready to be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Backend Tests
  run: |
    cd backend
    npm test

- name: Frontend Tests
  run: |
    cd frontend
    npm test -- --watch=false --browsers=ChromeHeadless
```
