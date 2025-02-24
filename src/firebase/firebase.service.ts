import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as serviceAccount from './firebase-service-account.json';

@Injectable()
export class FirebaseService {
  constructor() {
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(
          serviceAccount as admin.ServiceAccount,
        ),
      });
      console.log('Firebase Admin Initialized');
    }
  }

  async verifyToken(token: string) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      return decodedToken;
    } catch (error) {
      throw error;
    }
  }

  // Create a user with email and password
  async createUser(email: string, password: string) {
    try {
      const userRecord = await admin.auth().createUser({ email, password });
      return userRecord;
    } catch (error) {
      throw error;
    }
  }

  // Generate a custom token for the given uid (if needed)
  async generateCustomToken(uid: string) {
    try {
      const customToken = await admin.auth().createCustomToken(uid);
      return customToken;
    } catch (error) {
      throw error;
    }
  }
}
