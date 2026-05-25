import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavedTutor } from './entities/saved-tutor.entity';

@Injectable()
export class SavedTutorService {
  constructor(
    @InjectRepository(SavedTutor)
    private savedTutorRepo: Repository<SavedTutor>,
  ) {}

  // 1. Menyimpan Tutor
  async saveTutor(userId: number, tutorProfileId: number) {
    try {
      const newSaved = this.savedTutorRepo.create({
        user_id: userId,
        tutor_profile_id: tutorProfileId,
      });
      return await this.savedTutorRepo.save(newSaved);
    } catch (error) {
      if ((error as any).code === '23505') {
        throw new BadRequestException('Tutor ini sudah ada di daftar simpanan Anda');
      }
      throw error;
    }
  }

  async unsaveTutor(userId: number, tutorProfileId: number) {
    await this.savedTutorRepo.delete({
      user_id: userId,
      tutor_profile_id: tutorProfileId,
    });
    return { message: 'Tutor berhasil dihapus dari daftar simpanan' };
  }

  async getMySavedTutors(userId: number) {
    return this.savedTutorRepo.find({
      where: { user_id: userId },
      relations: ['tutorProfile', 'tutorProfile.user'],
      order: { created_at: 'DESC' },
    });
  }
}
