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

  async findAllPublic(options?: {
    page?: number;
    limit?: number;
    searchQuery?: string;
    minRating?: number;
  }) {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const searchQuery = options?.searchQuery;
    const minRating = options?.minRating;

    const query = this.tutorProfileRepository
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.user', 'user');

    if (searchQuery) {
      query.andWhere(
        '(LOWER(user.name) LIKE :search OR LOWER(profile.education) LIKE :search OR LOWER(profile.experience) LIKE :search OR LOWER(profile.bio) LIKE :search)',
        { search: `%${searchQuery.toLowerCase()}%` }
      );
    }

    if (minRating && minRating > 0) {
      query.andWhere('profile.rating >= :minRating', { minRating });
    }

    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findPublicById(id: number) {
    return this.tutorProfileRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }
}
