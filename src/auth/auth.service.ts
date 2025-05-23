import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/types/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly UserService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.UserService.findOne(email);
    if (!user || !user.password) {
      throw new UnauthorizedException(
        'Invalid credentials: user not found or no password',
      );
    }

    if (!password) {
      throw new UnauthorizedException('Password must be provided');
    }

    const passwordIsValid = await argon2.verify(user.password, password);
    if (passwordIsValid) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }
  async login(user: IUser) {
    const { id, email } = user;
    return {
      id,
      email,
      token: this.jwtService.sign({ id, email }),
    };
  }
}
