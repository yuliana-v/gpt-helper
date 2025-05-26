import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../config/firebaseAdmin';
import { DecodedIdToken } from 'firebase-admin/auth';

interface AuthenticatedRequest extends Request {
  user?: DecodedIdToken;
}

export async function verifyFirebaseToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    if (req.body.offline) {
      console.warn('⚠️ No token, offline fallback allowed');
      req.user = { uid: 'offline-user', name: 'Offline' } as any;
      return next();
    }

    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const idToken = authHeader.split(' ')[1];

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (err) {
    if (req.body.offline) {
      console.warn('⚠️ Token verify failed, offline fallback allowed');
      req.user = { uid: 'offline-user', name: 'Offline' } as any;
      return next();
    }

    console.error('❌ Token verification failed:', err);
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
