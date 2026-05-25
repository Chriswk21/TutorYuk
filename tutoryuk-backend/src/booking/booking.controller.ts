import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AcceptBookingDto } from './dto/accept-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // Tutee bikin request
  @Post()
  async create(@CurrentUser() user: any, @Body() dto: CreateBookingDto) {
    return this.bookingService.createBooking(user.id, dto);
  }

  // Tutee lihat semua booking-nya (semua status)
  @Get('my-requests')
  async myRequests(@CurrentUser() user: any) {
    return this.bookingService.findMyBookings(user.id);
  }

  // Tutor lihat booking yg masuk ke dia
  @Get('tutor-incoming')
  async tutorIncoming(@CurrentUser() user: any) {
    return this.bookingService.findTutorBookings(user.id);
  }

  // Tutor accept
  @Patch(':id/accept')
  async accept(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: AcceptBookingDto,
  ) {
    return this.bookingService.acceptBooking(user.id, +id, dto);
  }

  // Tutor reject
  @Patch(':id/reject')
  async reject(@CurrentUser() user: any, @Param('id') id: string) {
    return this.bookingService.rejectBooking(user.id, +id);
  }

  // Tutor mark complete
  @Patch(':id/complete')
  async complete(@CurrentUser() user: any, @Param('id') id: string) {
    return this.bookingService.completeBooking(user.id, +id);
  }

  // Tutee cancel (cuma kalo PENDING)
  @Patch(':id/cancel')
  async cancel(@CurrentUser() user: any, @Param('id') id: string) {
    return this.bookingService.cancelBooking(user.id, +id);
  }
}
