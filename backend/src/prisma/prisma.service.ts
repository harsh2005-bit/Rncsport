import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Successfully connected to MongoDB');

      // Ensure collections exist to avoid "Transactions not supported" error
      try {
        await this.$runCommandRaw({
          create: 'leads',
        });
        console.log("Collection 'leads' created successfully");
      } catch (e: unknown) {
        const error = e as { message?: string };
        if (error.message?.includes('already exists')) {
          console.log("Collection 'leads' already exists");
        } else {
          console.error('Error creating leads collection:', error.message);
        }
      }
    } catch (err) {
      console.error('Failed to connect to MongoDB:', err);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
