import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Booking } from '../booking/entities/booking.entity';
import { TutorProfile } from '../tutor-profile/entities/tutor-profile.entity';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Booking, TutorProfile])],
  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
