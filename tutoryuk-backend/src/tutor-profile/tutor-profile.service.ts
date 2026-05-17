import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TutorProfile } from './entities/tutor-profile.entity';
import { UpdateTutorProfileDto } from './dto/update-tutor-profile.dto';

@Injectable()
export class TutorProfileService {
  constructor(
    @InjectRepository(TutorProfile)
    private tutorProfileRepository: Repository<TutorProfile>,
  ) {}

  async updateProfile(userId: number, updateDto: UpdateTutorProfileDto) {
    try {
      // Cari apakah profil tutor sudah ada untuk user ini
      let profile = await this.tutorProfileRepository.findOne({
        where: { user_id: userId },
      });

      if (profile) {
        // Jika sudah ada, update datanya
        Object.assign(profile, updateDto);
      } else {
        // Jika belum ada, buat baru
        profile = this.tutorProfileRepository.create({
          user_id: userId,
          phone_number: updateDto.phone_number || '',
          bio: updateDto.bio || '',
          experience: updateDto.experience || '',
          education: updateDto.education || '',
          profile_path: updateDto.profile_path,
          teaching_preference: updateDto.teaching_preference,
        });
      }

      return await this.tutorProfileRepository.save(profile);
    } catch (error) {
      console.error('Error updating tutor profile:', error);
      throw new InternalServerErrorException('Gagal mengupdate profil tutor');
    }
  }

  async getProfile(userId: number) {
    return this.tutorProfileRepository.findOne({
      where: { user_id: userId },
    });
  }

  async findAllPublic() {
    return this.tutorProfileRepository.find({
      relations: ['user'], // Join dengan tabel user untuk dapat nama tutor
    });
  }

  async findPublicById(id: number) {
    return this.tutorProfileRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }
}
