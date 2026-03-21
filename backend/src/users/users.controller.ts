import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile/:email')
  async getProfile(@Param('email') email: string) {
    let user = await this.usersService.findByEmail(email);

    console.log(`Checking profile for: ${email}`);
    console.log(`ADMIN_EMAILS from env: ${process.env.ADMIN_EMAILS}`);
    const adminEmails = (
      process.env.ADMIN_EMAILS ||
      'jsrsportsofficial@gmail.com,harshjhabksc@gmail.com'
    )
      .split(',')
      .map((e) => e.trim().toLowerCase());

    const isAdminEmail = adminEmails.includes(email.toLowerCase());
    console.log(`Found admin emails: ${JSON.stringify(adminEmails)}`);
    console.log(`Is Admin? ${isAdminEmail}`);

    if (!user) {
      // Create a default profile if not exists
      user = await this.usersService.create({
        email,
        username: email.split('@')[0],
        passwordHash: 'FIREBASE_AUTH',
        balance: 1000.0,
        role: isAdminEmail ? 'ADMIN' : 'USER',
      });
    } else if (isAdminEmail && user.role !== 'ADMIN') {
      // Auto-promote to admin if email is in the admin list but role is not admin
      user = await this.usersService.updateRole(user.id, 'ADMIN');
    }

    return user;
  }
}
