import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ValidationError } from '../errors/AppError';
import {
  SearchParams,
  HistoryTypeParams,
  HistoryIdParams,
  DateRangeParams,
  isValidHistoryType,
  isValidDateString,
  ValidationResult
} from '../types/api';

type RequestWithQuery<T> = Request<ParamsDictionary, any, any, T>;

export function validateSearchParams(
  req: RequestWithQuery<Partial<SearchParams>>,
  res: Response,
  next: NextFunction
) {
  const { q, from, to } = req.query;
  const errors: Array<{ field: string; message: string }> = [];

  if (!q || typeof q !== 'string' || q.trim().length < 2) {
    errors.push({
      field: 'q',
      message: 'Query string is required and must be at least 2 characters'
    });
  }

  if (from && !isValidDateString(from)) {
    errors.push({
      field: 'from',
      message: 'Invalid date format for "from" parameter'
    });
  }

  if (to && !isValidDateString(to)) {
    errors.push({
      field: 'to',
      message: 'Invalid date format for "to" parameter'
    });
  }

  if (errors.length > 0) {
    throw new ValidationError('Invalid search parameters', { errors });
  }

  next();
}

export function validateDateRange(
  req: RequestWithQuery<Partial<DateRangeParams>>,
  res: Response,
  next: NextFunction
) {
  const { from, to } = req.query;
  const errors: Array<{ field: string; message: string }> = [];

  if (from && !isValidDateString(from)) {
    errors.push({
      field: 'from',
      message: 'Invalid date format for "from" parameter'
    });
  }

  if (to && !isValidDateString(to)) {
    errors.push({
      field: 'to',
      message: 'Invalid date format for "to" parameter'
    });
  }

  if (errors.length > 0) {
    throw new ValidationError('Invalid date range parameters', { errors });
  }

  next();
}

export function validateHistoryType(
  req: Request<{ type: string }>,
  res: Response,
  next: NextFunction
) {
  const { type } = req.params;

  if (!isValidHistoryType(type)) {
    throw new ValidationError('Invalid history type. Use comment, test, or analysis.');
  }

  next();
}

export function validateHistoryId(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  if (!/^\d+$/.test(id)) {
    throw new ValidationError('Invalid ID. Must be a numeric value.');
  }

  next();
}

// Generic validation middleware factory
export function validateRequest<T>(
  validator: (data: unknown) => ValidationResult<T>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = validator(req.body);
    
    if (!result.isValid) {
      throw new ValidationError('Invalid request data', { errors: result.errors });
    }

    // Attach validated data to request for use in route handlers
    (req as any).validatedData = result.data;
    next();
  };
} 