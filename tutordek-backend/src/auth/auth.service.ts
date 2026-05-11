import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const normalizedRole = data.role?.toUpperCase?.() ?? 'USER';
    const payload = {
      ...data,
      role: normalizedRole === 'TUTOR' ? 'TUTOR' : normalizedRole === 'ADMIN' ? 'ADMIN' : 'USER',
    } as RegisterDto;

    // Cek dulu email udah ada apa belum
    const existingUser = await this.userRepository.findOne({
      where: { email: payload.email },
    });
    if (existingUser) throw new ConflictException('Email sudah terdaftar!');

    // Hashing password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(payload.password, salt);

    const newUser = this.userRepository.create({
      ...payload,
      password: hashedPassword,
    });

    try {
      return await this.userRepository.save(newUser);
    } catch (error) {
      console.error('Register error:', error);
      throw new BadRequestException('Terjadi kesalahan saat pendaftaran. Coba lagi nanti.');
    }
  }

  async login(email: string, pass: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Email atau password salah!');

    // Bandingin password yang diinput sama yang di DB (Hashed)
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) throw new UnauthorizedException('Email atau password salah!');

    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      message: 'Login Berhasil',
      user: { id: user.id, name: user.name, role: user.role },
      access_token: this.jwtService.sign(payload),
    };
  }
}
