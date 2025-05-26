import { Request } from 'express';

declare global {
  namespace Express {
    interface User {
      uid: string;
      name?: string;
      [key: string]: any;
    }

    interface Request {
      user?: User;
    }
  }
}
