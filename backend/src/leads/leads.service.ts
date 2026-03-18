import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

export interface Lead {
  id?: string;
  name: string;
  mobileNumber: string;
  createdAt?: Date;
}

@Injectable()
export class LeadsService {
  private collection = 'leads';

  constructor(private firebase: FirebaseService) {}

  private get db() {
    return this.firebase.db;
  }

  async createLead(name: string, mobileNumber: string): Promise<Lead> {
    const createdAt = new Date();
    const newLead = {
      name,
      mobileNumber,
      createdAt,
    };
    
    const docRef = await this.db.collection(this.collection).add(newLead);
    return { id: docRef.id, ...newLead } as Lead;
  }

  async getAllLeads(): Promise<Lead[]> {
    const snapshot = await this.db.collection(this.collection)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Lead[];
  }

  async findByMobile(mobileNumber: string): Promise<Lead | null> {
    const snapshot = await this.db.collection(this.collection)
      .where('mobileNumber', '==', mobileNumber)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Lead;
  }
}
