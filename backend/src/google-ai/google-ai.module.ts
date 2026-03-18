import { Module, Global } from '@nestjs/common';
import { GoogleAiService } from './google-ai.service';

@Global()
@Module({
  providers: [GoogleAiService],
  exports: [GoogleAiService],
})
export class GoogleAiModule {}
