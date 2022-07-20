import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwtConstants.accessSecret'),
    });
  }

  async validate(payload: {
    email: string;
    sub: string;
  }): Promise<{ userId: string; email: string }> {
    //add revoked tokens check

    const result = { userId: payload.sub, email: payload.email };

    return result;
  }
}
