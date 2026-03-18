import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FirebaseService implements OnModuleInit {
  onModuleInit() {
    try {
      if (admin.apps.length === 0) {
        const filePath = join(process.cwd(), 'serviceAccountKey.json');
        const serviceAccount = JSON.parse(readFileSync(filePath, 'utf8'));

        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          storageBucket: 'jsr-sports.firebasestorage.app',
        });

        console.log('Firebase Admin Initialized successfully.');
      }
    } catch (error) {
      console.error('Firebase Admin Initialization Error:', error);
    }
  }

  get auth() {
    return admin.auth();
  }

  get db() {
    return admin.firestore();
  }

  get storage() {
    return admin.storage();
  }
}
