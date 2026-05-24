import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // GET /reviews/tutor/:tutorProfileId - publik, lihat review tutor
  @Get('tutor/:tutorProfileId')
  async byTutor(@Param('tutorProfileId') id: string) {
    return this.reviewService.findByTutor(+id);
  }

  // GET /reviews/booking/:bookingId/check - cek udah di-review atau belum
  @UseGuards(JwtAuthGuard)
  @Get('booking/:bookingId/check')
  async checkReview(@Param('bookingId') id: string) {
    return this.reviewService.hasReview(+id);
  }

  // POST /reviews/booking/:bookingId - kasih rating ke booking COMPLETED
  @UseGuards(JwtAuthGuard)
  @Post('booking/:bookingId')
  async create(
    @Request() req,
    @Param('bookingId') id: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewService.createReview(req.user.id, +id, dto);
  }
}
