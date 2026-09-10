import { Request, Response, NextFunction } from 'express';

/**
 * Deep NoSQL Injection Sanitization Middleware
 * Recursively strips keys starting with '$' or containing '.' from req.body, req.query, and req.params
 * preventing MongoDB operator injection attacks (e.g. {"$gt": ""}).
 */
function cleanObject(obj: any): any {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(cleanObject);
  }

  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    // Strip MongoDB operators like $gt, $ne, $where or keys containing dot notation
    if (key.startsWith('$') || key.includes('.')) {
      continue;
    }
    cleaned[key] = cleanObject(value);
  }
  return cleaned;
}

export function sanitizeNoSQL(req: Request, res: Response, next: NextFunction): void {
  try {
    if (req.body && typeof req.body === 'object') {
      req.body = cleanObject(req.body);
    }
    if (req.query && typeof req.query === 'object') {
      req.query = cleanObject(req.query);
    }
    if (req.params && typeof req.params === 'object') {
      req.params = cleanObject(req.params);
    }
    next();
  } catch (err) {
    next(err);
  }
}
