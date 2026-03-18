import {
  Controller,
  Post,
  Body,
  Get,
  BadRequestException,
} from '@nestjs/common';
import { LeadsService } from './leads.service';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  async create(@Body() body: { name: string; mobileNumber: string }) {
    const { name, mobileNumber } = body;

    if (!name || !mobileNumber) {
      throw new BadRequestException('Name and mobile number are required');
    }

    if (!/^\d{10}$/.test(mobileNumber)) {
      throw new BadRequestException(
        'Please enter a valid 10-digit mobile number.',
      );
    }

    try {
      await this.leadsService.createLead(name, mobileNumber);
      return {
        success: true,
        message: 'Login successful. You can now continue.',
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException('Failed to store lead: ' + message);
    }
  }

  @Post('login')
  async login(@Body() body: { mobileNumber: string }) {
    const { mobileNumber } = body;

    if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
      throw new BadRequestException(
        'Please enter a valid 10-digit mobile number.',
      );
    }

    const lead = await this.leadsService.findByMobile(mobileNumber);

    if (!lead) {
      throw new BadRequestException(
        'Account not found. Please register as a new user.',
      );
    }

    return {
      success: true,
      name: lead.name,
      message: `Welcome back, ${lead.name}.`,
    };
  }

  @Get()
  async findAll() {
    return await this.leadsService.getAllLeads();
  }
}
