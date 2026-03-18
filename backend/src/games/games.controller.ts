import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlaceBetDto } from './dto/place-bet.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('bet')
  async placeBet(@Request() req: any, @Body() placeBetDto: PlaceBetDto) {
    return this.gamesService.placeBet(req.user.userId, placeBetDto);
  }

  @Get('recent')
  async getRecentBets() {
    return this.gamesService.getRecentBets();
  }
}
