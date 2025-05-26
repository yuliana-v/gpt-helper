import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError, NotFoundError, DatabaseError } from '../errors/AppError';

interface ErrorResponse {
  error: {
    message: string;
    code: string;
    status: number;
    details?: any;
  };
}

function isAppError(error: any): error is AppError {
  return error instanceof AppError;
}

function formatErrorResponse(error: AppError): ErrorResponse {
  const response: ErrorResponse = {
    error: {
      message: error.message,
      code: error.code,
      status: error.statusCode,
    }
  };

  // Only include details in development
  if (process.env.NODE_ENV === 'development' && error.originalError) {
    response.error.details = {
      stack: error.stack,
      originalError: error.originalError
    };
  }

  return response;
}

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Handle known application errors
  if (isAppError(error)) {
    const response = formatErrorResponse(error);
    return res.status(error.statusCode).json(response);
  }

  // Handle unknown errors
  const unknownError = new AppError(
    'An unexpected error occurred',
    500,
    'INTERNAL_SERVER_ERROR',
    error
  );
  const response = formatErrorResponse(unknownError);
  return res.status(500).json(response);
}

// Middleware to handle 404 errors
export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  const error = new NotFoundError(`Resource not found: ${req.method} ${req.path}`);
  next(error);
}

// Middleware to handle async errors
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
} 