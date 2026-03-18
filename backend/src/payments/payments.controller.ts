import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Headers,
  UnauthorizedException,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('submit')
  @UseInterceptors(FileInterceptor('file'))
  async submitPayment(
    @Body()
    body: {
      userId: string;
      name?: string;
      phoneNumber?: string;
      paymentMethod?: 'UPI' | 'BANK_TRANSFER';
      platform?: string;
      transactionId?: string;
    },
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      if (!body.userId || !file) {
        throw new BadRequestException(
          'Missing required fields (userId or file)',
        );
      }
      return await this.paymentsService.submitPaymentWithFile(
        body as any,
        file,
      );
    } catch (error: any) {
      console.error('Payment Submission Failed:', error);
      const err = error as Error;
      throw new BadRequestException(err.message || 'Payment submission failed');
    }
  }

  @Get('all')
  async getAllPayments(@Headers('x-admin-key') adminKey: string) {
    this.verifyAdminKey(adminKey);
    return this.paymentsService.getAllPayments();
  }

  @Patch('status/:id')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'APPROVED' | 'REJECTED',
    @Headers('x-admin-key') adminKey: string,
  ) {
    this.verifyAdminKey(adminKey);
    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      throw new BadRequestException('Invalid status');
    }
    return this.paymentsService.updateStatus(id, status);
  }

  private verifyAdminKey(adminKey: string) {
    const secretKey = process.env.ADMIN_SECRET_KEY || 'jsrboss8055$@';
    if (adminKey !== secretKey) {
      throw new UnauthorizedException('Invalid admin key');
    }
  }
}
