import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FirebaseService implements OnModuleInit {
  onModuleInit() {
    try {
      if (admin.apps.length === 0) {
        const filePath = join(process.cwd(), 'serviceAccountKey.json');
        const serviceAccountStr = readFileSync(filePath, 'utf8');
        const serviceAccount = JSON.parse(serviceAccountStr) as admin.ServiceAccount;

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
    return getFirestore(admin.app(), 'default');
  }

  get storage() {
    return admin.storage();
  }
}
