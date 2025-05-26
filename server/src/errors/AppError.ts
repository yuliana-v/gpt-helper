export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_SERVER_ERROR',
    public originalError?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, originalError?: any) {
    super(message, 400, 'VALIDATION_ERROR', originalError);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', originalError?: any) {
    super(message, 404, 'NOT_FOUND', originalError);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed', originalError?: any) {
    super(message, 401, 'UNAUTHORIZED', originalError);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Not authorized to perform this action', originalError?: any) {
    super(message, 403, 'FORBIDDEN', originalError);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed', originalError?: any) {
    super(message, 500, 'DATABASE_ERROR', originalError);
  }
}

export class ExternalServiceError extends AppError {
  constructor(message: string = 'External service request failed', originalError?: any) {
    super(message, 502, 'EXTERNAL_SERVICE_ERROR', originalError);
  }
} 