import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: 'USER' | 'ADMIN';
  balance: number;
  avatarUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class UsersService {
  private collection = 'users';

  constructor(private firebase: FirebaseService) {}

  private get db() {
    return this.firebase.db;
  }

  async findOne(username: string): Promise<User | null> {
    const snapshot = await this.db.collection(this.collection)
      .where('username', '==', username)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as User;
  }

  async findByEmail(email: string): Promise<User | null> {
    const snapshot = await this.db.collection(this.collection)
      .where('email', '==', email)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as User;
  }

  async findById(id: string): Promise<User | null> {
    const doc = await this.db.collection(this.collection).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as User;
  }

  async create(data: any): Promise<User> {
    const createdAt = new Date();
    const newUser = {
      ...data,
      role: data.role || 'USER',
      balance: data.balance ?? 1000.0,
      createdAt,
      updatedAt: createdAt,
    };
    
    const docRef = await this.db.collection(this.collection).add(newUser);
    return { id: docRef.id, ...newUser } as User;
  }

  async updateBalance(id: string, amount: number): Promise<User> {
    const docRef = this.db.collection(this.collection).doc(id);
    await this.db.runTransaction(async (transaction) => {
      const doc = await transaction.get(docRef);
      if (!doc.exists) throw new Error('User not found');
      const userData = doc.data() as Partial<User> | undefined;
      const currentBalance = userData?.balance || 0;
      transaction.update(docRef, { balance: currentBalance + amount, updatedAt: new Date() });
    });
    const updatedDoc = await docRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() } as User;
  }

  async updateRole(id: string, role: string): Promise<User> {
    const docRef = this.db.collection(this.collection).doc(id);
    await docRef.update({ role, updatedAt: new Date() });
    const updatedDoc = await docRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() } as User;
  }
}
