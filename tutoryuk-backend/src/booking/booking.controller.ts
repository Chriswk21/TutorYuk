import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AcceptBookingDto } from './dto/accept-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // Tutee bikin request
  @Post()
  async create(@Request() req, @Body() dto: CreateBookingDto) {
    return this.bookingService.createBooking(req.user.id, dto);
  }

  // Tutee lihat semua booking-nya (semua status)
  @Get('my-requests')
  async myRequests(@Request() req) {
    return this.bookingService.findMyBookings(req.user.id);
  }

  // Tutor lihat booking yg masuk ke dia
  @Get('tutor-incoming')
  async tutorIncoming(@Request() req) {
    return this.bookingService.findTutorBookings(req.user.id);
  }

  // Tutor accept
  @Patch(':id/accept')
  async accept(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: AcceptBookingDto,
  ) {
    return this.bookingService.acceptBooking(req.user.id, +id, dto);
  }

  // Tutor reject
  @Patch(':id/reject')
  async reject(@Request() req, @Param('id') id: string) {
    return this.bookingService.rejectBooking(req.user.id, +id);
  }

  // Tutor mark complete
  @Patch(':id/complete')
  async complete(@Request() req, @Param('id') id: string) {
    return this.bookingService.completeBooking(req.user.id, +id);
  }

  // Tutee cancel (cuma kalo PENDING)
  @Patch(':id/cancel')
  async cancel(@Request() req, @Param('id') id: string) {
    return this.bookingService.cancelBooking(req.user.id, +id);
  }
}
