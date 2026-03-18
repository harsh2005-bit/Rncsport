import { IsEnum, IsNumber, IsPositive } from 'class-validator';
import { GameType } from '../games.service';

export class PlaceBetDto {
  @IsEnum(GameType)
  gameType: GameType;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsNumber()
  @IsPositive()
  odds: number;
}
