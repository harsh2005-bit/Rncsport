import { Injectable, Logger } from '@nestjs/common';
import { GameGateway } from './game.gateway';

@Injectable()
export class GameService {
  private logger = new Logger('GameService - Engine');
  private crashMultiplier = 1.0;
  private crashInterval: NodeJS.Timeout;
  private isCrashed = false;

  constructor(private gameGateway: GameGateway) {}

  startCrashGame() {
    this.logger.log('Starting new Crash game...');
    this.crashMultiplier = 1.0;
    this.isCrashed = false;
    this.gameGateway.server.emit('gameStarted', { game: 'crash' });

    // Determine crash point upfront
    const crashPoint = this.generateCrashPoint();

    this.crashInterval = setInterval(() => {
      if (this.crashMultiplier >= crashPoint) {
        this.crashGame();
      } else {
        this.crashMultiplier += 0.01 + this.crashMultiplier * 0.01; // Non-linear growth
        this.gameGateway.server.emit('crashUpdate', {
          multiplier: Number(this.crashMultiplier.toFixed(2)),
        });
      }
    }, 100);
  }

  crashGame() {
    clearInterval(this.crashInterval);
    this.isCrashed = true;
    this.logger.log(`Game crashed at ${this.crashMultiplier.toFixed(2)}x`);
    this.gameGateway.server.emit('gameCrashed', {
      multiplier: Number(this.crashMultiplier.toFixed(2)),
    });

    // Schedule next game
    setTimeout(() => this.startCrashGame(), 5000);
  }

  private generateCrashPoint(): number {
    // Simple provably fair simulation
    const e = 2 ** 52;
    const h = crypto.getRandomValues(new Uint32Array(2))[0] * (2 ** 32) + crypto.getRandomValues(new Uint32Array(2))[1];
    if (h % 33 === 0) return 1.0;
    return Math.floor((100 * e - h) / (e - h)) / 100.0;
  }
}
