import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile/:email')
  async getProfile(@Param('email') email: string) {
    let user = await this.usersService.findByEmail(email);

    // Check if this email should be an admin
    const adminEmails = process.env.ADMIN_EMAILS
      ? process.env.ADMIN_EMAILS.split(',')
      : [];
    const isAdminEmail = adminEmails.includes(email);

    if (!user) {
      // Create a default profile if not exists
      user = await this.usersService.create({
        email,
        username: email.split('@')[0],
        passwordHash: 'FIREBASE_AUTH',
        balance: 1000.0,
        role: (isAdminEmail ? 'ADMIN' : 'USER') as any,
      });
    } else if (isAdminEmail && user.role !== 'ADMIN') {
      // Auto-promote to admin if email is in the admin list but role is not admin
      user = await this.usersService.updateRole(user.id, 'ADMIN');
    }

    return user;
  }
}
