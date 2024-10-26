import admin from 'firebase-admin';

// Initialize Firebase Admin SDK only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), // or use service account credentials here
  });
}

export default admin;
