import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key', // Ideally use process.env
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findOne(payload.sub); // Use user ID
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user; // This gets injected into `req.user`
  }
}
