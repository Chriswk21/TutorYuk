import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TutorRegistration } from './entities/tutor-registration.entity';
import { CreateRegistrationDto } from './dto/create-registration.dto';

@Injectable()
export class TutorRegistrationService {
  constructor(
    @InjectRepository(TutorRegistration)
    private registrationRepository: Repository<TutorRegistration>,
  ) {}

  async register(dto: CreateRegistrationDto) {
    const newReg = this.registrationRepository.create(dto);
    return await this.registrationRepository.save(newReg);
  }

  async findAll() {
    return await this.registrationRepository.find();
  }

  async updateStatus(id: number, status: string) {
    const registration = await this.registrationRepository.findOne({
      where: { id },
    });

    if (!registration) {
      throw new NotFoundException(`Pendaftaran tutor dengan ID ${id} tidak ditemukan`);
    }

    registration.status = status;
    return await this.registrationRepository.save(registration);
  }
}
