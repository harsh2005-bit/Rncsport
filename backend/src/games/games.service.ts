import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { UsersService } from '../users/users.service';

export enum GameType {
  CRASH = 'CRASH',
  DICE = 'DICE',
  MINES = 'MINES',
  PLINKO = 'PLINKO',
  SLOTS = 'SLOTS',
}

export enum BetStatus {
  PENDING = 'PENDING',
  WON = 'WON',
  LOST = 'LOST',
  CANCELLED = 'CANCELLED',
}

export interface Bet {
  id?: string;
  userId: string;
  username?: string;
  gameType: GameType;
  amount: number;
  multiplier?: number | null;
  payout?: number | null;
  status: BetStatus;
  createdAt: Date;
}

@Injectable()
export class GamesService {
  private collection = 'bets';

  constructor(
    private firebase: FirebaseService,
    private usersService: UsersService,
  ) {}

  private get db() {
    return this.firebase.db;
  }

  async placeBet(
    userId: string,
    data: { gameType: GameType; amount: number; odds: number },
  ) {
    const user = await this.usersService.findById(userId);
    if (!user || user.balance < data.amount) {
      throw new Error('Insufficient balance');
    }

    // Deduct balance
    await this.usersService.updateBalance(userId, -data.amount);

    // Create bet in Firestore
    const createdAt = new Date();
    const username = user.username || user.email.split('@')[0];

    const newBet = {
      userId,
      username,
      gameType: data.gameType,
      amount: data.amount,
      multiplier: data.odds,
      status: BetStatus.PENDING,
      createdAt,
    };

    const docRef = await this.db.collection(this.collection).add(newBet);
    return { id: docRef.id, ...newBet } as Bet;
  }

  async getRecentBets(): Promise<Bet[]> {
    const snapshot = await this.db
      .collection(this.collection)
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Bet[];
  }
}
