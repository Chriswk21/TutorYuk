import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TutorRegistration } from './entities/tutor-registration.entity';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { TutorProfile } from '../tutor-profile/entities/tutor-profile.entity';

@Injectable()
export class TutorRegistrationService {
  constructor(
    @InjectRepository(TutorRegistration)
    private registrationRepository: Repository<TutorRegistration>,

    @InjectRepository(TutorProfile)
    private tutorProfileRepository: Repository<TutorProfile>,
  ) {}

  async register(userId: number, dto: CreateRegistrationDto) {
    // Cek apakah user sudah punya profil tutor
    const existingProfile = await this.tutorProfileRepository.findOne({
      where: { user_id: userId },
    });

    if (existingProfile) {
      throw new BadRequestException('Anda sudah terdaftar sebagai tutor dan memiliki profil aktif.');
    }

    // Cek apakah ada pendaftaran yang berstatus PENDING
    const pendingReg = await this.registrationRepository.findOne({
      where: { user: { id: userId }, status: 'PENDING' },
    });

    if (pendingReg) {
      throw new BadRequestException('Anda sudah memiliki pengajuan pendaftaran yang berstatus PENDING.');
    }

    const newReg = this.registrationRepository.create({
      ...dto,
      user: { id: userId },
      user_id: userId,
      status: 'PENDING',
    });

    return await this.registrationRepository.save(newReg);
  }

  async findAll() {
    return await this.registrationRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findMyRegistration(userId: number) {
    return await this.registrationRepository.findOne({
      where: { user: { id: userId } },
      order: { created_at: 'DESC' },
    });
  }

  async updateStatus(id: number, status: string) {
    const registration = await this.registrationRepository.findOne({
      where: { id },
    });

    if (!registration) {
      throw new NotFoundException(`Pendaftaran tutor dengan ID ${id} tidak ditemukan`);
    }

    registration.status = status;
    const savedReg = await this.registrationRepository.save(registration);

    // Jika disetujui (APPROVED), buat profil tutor baru
    if (status === 'APPROVED' && registration.user_id) {
      const existingProfile = await this.tutorProfileRepository.findOne({
        where: { user_id: registration.user_id },
      });

      if (!existingProfile) {
        const newProfile = this.tutorProfileRepository.create({
          user_id: registration.user_id,
          phone_number: registration.phone_number,
          education: registration.education,
          bio: 'Halo! Saya adalah tutor di TutorYuk.',
          experience: 'Menyelesaikan perkuliahan di bidang terkait.',
          teaching_preference: 'Diskusikan via Chat',
          total_schedule: 0,
        });

        await this.tutorProfileRepository.save(newProfile);
      }
    }

    return savedReg;
  }
}
