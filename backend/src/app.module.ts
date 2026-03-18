import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GamesModule } from './games/games.module';
import { UsersModule } from './users/users.module';
import { WebsocketsModule } from './websockets/websockets.module';
import { LeadsModule } from './leads/leads.module';
import { FirebaseModule } from './firebase/firebase.module';
import { GoogleAiModule } from './google-ai/google-ai.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    AuthModule,
    GamesModule,
    UsersModule,
    WebsocketsModule,
    LeadsModule,
    FirebaseModule,
    GoogleAiModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
