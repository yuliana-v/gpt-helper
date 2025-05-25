import admin from 'firebase-admin';
var serviceAccount = require('./firebase-admin-sdk.json');

// Option 1: Use application default credentials (GCP or .env GOOGLE_APPLICATION_CREDENTIALS)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

// Export the admin auth instance
export const adminAuth = admin.auth();
