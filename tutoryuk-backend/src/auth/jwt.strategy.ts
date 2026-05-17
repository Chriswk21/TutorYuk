import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super-secret-key-jangan-bocor', // Harusnya di taruh di .env
    });
  }

  async validate(payload: any) {
    // Payload ini adalah isi dari token JWT yang didecode
    // Biasanya berisi { sub: userId, email: email, role: role }
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
