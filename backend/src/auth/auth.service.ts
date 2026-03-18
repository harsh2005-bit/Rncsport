import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && await bcrypt.compare(pass, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        balance: user.balance,
        role: user.role,
      },
    };
  }

  async register(data: { username: string; email: string; pass: string }) {
    const existing = await this.usersService.findOne(data.username);
    if (existing) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(data.pass, 10);
    const user = await this.usersService.create({
      username: data.username,
      email: data.email,
      passwordHash: hashedPassword,
    });

    return this.login(user);
  }
}
