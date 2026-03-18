import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { FirebaseService } from '../firebase/firebase.service';

export interface PaymentRequest {
  id?: string;
  userId: string;
  name: string;
  phoneNumber: string;
  paymentMethod: 'UPI' | 'BANK_TRANSFER';
  platform: string;
  transactionId?: string | null;
  screenshotUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
  updatedAt?: Date;
}

interface MulterFile {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
}

@Injectable()
export class PaymentsService {
  private collection = 'payment_requests';

  constructor(private firebase: FirebaseService) {}

  private get db() {
    return this.firebase.db;
  }

  async submitPayment(data: Partial<PaymentRequest>): Promise<PaymentRequest> {
    const createdAt = new Date();
    const newRequest = {
      ...data,
      status: 'PENDING',
      createdAt,
      updatedAt: createdAt,
    };

    const docRef = await this.db.collection(this.collection).add(newRequest);
    return { id: docRef.id, ...newRequest } as PaymentRequest;
  }

  async submitPaymentWithFile(
    body: any,
    file: MulterFile,
  ): Promise<PaymentRequest> {
    try {
      const bucket = this.firebase.storage.bucket();
      const fileName = `payment_proofs/${Date.now()}_${file.originalname}`;
      const fileRef = bucket.file(fileName);

      console.log(
        `Starting upload to bucket: ${bucket.name}, path: ${fileName}`,
      );

      const downloadToken = randomUUID();
      await fileRef.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
          metadata: {
            firebaseStorageDownloadTokens: downloadToken,
          },
        },
      });

      console.log(
        'File saved to Storage. Generating persistent download URL...',
      );

      const screenshotUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media&token=${downloadToken}`;
      console.log('Download URL generated successfully:', screenshotUrl);

      console.log('Adding record to Firestore...');
      const result = await this.submitPayment({
        userId: body.userId,
        name: body.name || 'Unknown',
        phoneNumber: body.phoneNumber || 'Unknown',
        paymentMethod: body.paymentMethod || 'UPI',
        platform: body.platform || 'All Panel Exch',
        transactionId: body.transactionId || null,
        screenshotUrl,
      });
      console.log('Transaction record created successfully.');
      return result;
    } catch (error: any) {
      console.error('CRITICAL Service Error:', error);
      throw error;
    }
  }

  async getAllPayments(): Promise<PaymentRequest[]> {
    const snapshot = await this.db
      .collection(this.collection)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as PaymentRequest[];
  }

  async updateStatus(
    id: string,
    status: 'APPROVED' | 'REJECTED',
  ): Promise<PaymentRequest> {
    const docRef = this.db.collection(this.collection).doc(id);
    const updatedAt = new Date();
    await docRef.update({ status, updatedAt });
    const updatedDoc = await docRef.get();
    if (!updatedDoc.exists) throw new Error('Payment request not found');
    return { id: updatedDoc.id, ...updatedDoc.data() } as PaymentRequest;
  }

  async findByUserId(userId: string): Promise<PaymentRequest[]> {
    const snapshot = await this.db
      .collection(this.collection)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as PaymentRequest[];
  }
}
