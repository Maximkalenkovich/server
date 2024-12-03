import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private readonly UserService: UserService) {}
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.UserService.findOne(email);
    const passwordIsValid = await argon2.verify(user.password, password);
    if (user && passwordIsValid) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }
}
