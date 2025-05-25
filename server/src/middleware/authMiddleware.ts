import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../config/firebaseAdmin';
import { DecodedIdToken } from 'firebase-admin/auth';

interface AuthenticatedRequest extends Request {
  user?: DecodedIdToken;
}

export async function verifyFirebaseToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    console.log("decoded token:", decodedToken);
    req.user = decodedToken; // Attach user info to the request
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
}
