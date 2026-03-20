import { Module } from '@nestjs/common';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';

@Module({
  imports: [],
  controllers: [LeadsController],
  providers: [LeadsService],
})
export class LeadsModule {}
