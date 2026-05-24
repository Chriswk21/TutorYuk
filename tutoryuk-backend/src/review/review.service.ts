import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { Booking } from '../booking/entities/booking.entity';
import { TutorProfile } from '../tutor-profile/entities/tutor-profile.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepo: Repository<Review>,
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,
    @InjectRepository(TutorProfile)
    private tutorProfileRepo: Repository<TutorProfile>,
  ) {}

  // Bikin review buat booking yg COMPLETED
  // Logic running average:
  //  - Sebelum: tutor.rating=4, tutor.total_schedule=9
  //  - Masuk rating baru 5: new_avg = (4*9 + 5) / (9+1) = 4.1
  //  - Update: tutor.rating=4.1, tutor.total_schedule=10
  async createReview(userId: number, bookingId: number, dto: CreateReviewDto) {
    // 1. Cek booking ada & status COMPLETED & punya tutee ini
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking tidak ditemukan');
    }

    if (Number(booking.user_id) !== Number(userId)) {
      throw new ForbiddenException('Kamu bukan tutee dari booking ini');
    }

    if (booking.status !== 'COMPLETED') {
      throw new BadRequestException(
        'Kamu cuma bisa kasih rating untuk sesi yang udah COMPLETED',
      );
    }

    // 2. Cek belum pernah di-review (unique booking_id di DB)
    const existing = await this.reviewRepo.findOne({
      where: { booking_id: bookingId },
    });
    if (existing) {
      throw new BadRequestException('Booking ini sudah pernah di-review');
    }

    // 3. Simpen review-nya
    const review = this.reviewRepo.create({
      booking_id: bookingId,
      rating: dto.rating,
      comment: dto.comment,
    });
    await this.reviewRepo.save(review);

    // 4. Update tutor_profiles: running average + total_schedule
    const tutor = await this.tutorProfileRepo.findOne({
      where: { id: Number(booking.tutor_profile_id) },
    });
    if (tutor) {
      const oldRating = tutor.rating ?? 0;
      const oldTotal = tutor.total_schedule ?? 0;
      const newTotal = oldTotal + 1;
      const newRating = (oldRating * oldTotal + dto.rating) / newTotal;

      tutor.rating = Math.round(newRating * 100) / 100; // 2 angka di belakang koma
      tutor.total_schedule = newTotal;
      await this.tutorProfileRepo.save(tutor);
    }

    return review;
  }

  // Ambil semua review buat 1 tutor (publik) - gabung sama booking + user
  async findByTutor(tutorProfileId: number) {
    return this.reviewRepo
      .createQueryBuilder('review')
      .innerJoin('review.booking', 'booking')
      .innerJoin('booking.user', 'user')
      .where('booking.tutor_profile_id = :tid', { tid: tutorProfileId })
      .select([
        'review.id',
        'review.rating',
        'review.comment',
        'review.created_at',
        'booking.id',
        'user.id',
        'user.name',
      ])
      .orderBy('review.created_at', 'DESC')
      .getMany();
  }

  // Cek satu booking udah ada review atau belum (buat frontend tampilin tombol)
  async hasReview(bookingId: number) {
    const review = await this.reviewRepo.findOne({
      where: { booking_id: bookingId },
    });
    return { hasReview: !!review, review };
  }
}
