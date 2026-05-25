import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { TutorProfile } from '../tutor-profile/entities/tutor-profile.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AcceptBookingDto } from './dto/accept-booking.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,
    @InjectRepository(TutorProfile)
    private tutorProfileRepo: Repository<TutorProfile>,
  ) {}

  // 1. Tutee bikin request baru (status PENDING)
  async createBooking(userId: number, dto: CreateBookingDto) {
    // Validasi: tutor_profile_id beneran ada
    const tutorExists = await this.tutorProfileRepo.findOne({
      where: { id: dto.tutor_profile_id },
    });
    if (!tutorExists) {
      throw new NotFoundException('Tutor tidak ditemukan');
    }

    const newBooking = this.bookingRepo.create({
      user_id: userId,
      tutor_profile_id: dto.tutor_profile_id,
      schedule_date: new Date(dto.schedule_date),
      notes: dto.notes,
      status: 'PENDING',
    });
    return this.bookingRepo.save(newBooking);
  }

  // 2. Tutee lihat booking-nya
  async findMyBookings(userId: number) {
    return this.bookingRepo.find({
      where: { user_id: userId },
      relations: ['tutorProfile', 'tutorProfile.user'],
      order: { created_at: 'DESC' },
    });
  }

  // 3. Tutor lihat booking yg masuk ke dia
  async findTutorBookings(userId: number) {
    // Cari tutor profile dari user_id
    const profile = await this.tutorProfileRepo.findOne({
      where: { user_id: userId },
    });
    if (!profile) {
      throw new NotFoundException(
        'Profile tutor tidak ditemukan. Pastikan kamu terdaftar sebagai tutor.',
      );
    }

    return this.bookingRepo.find({
      where: { tutor_profile_id: profile.id },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  // 4. Tutor accept booking (set lokasi + opsional ubah tanggal)
  async acceptBooking(
    userId: number,
    bookingId: number,
    dto: AcceptBookingDto,
  ) {
    const booking = await this.getBookingForTutor(userId, bookingId);

    if (booking.status !== 'PENDING') {
      throw new BadRequestException(
        `Booking tidak bisa di-accept karena status saat ini: ${booking.status}`,
      );
    }

    booking.status = 'ACCEPTED';
    booking.location_or_link = dto.location_or_link;
    if (dto.schedule_date) {
      booking.schedule_date = new Date(dto.schedule_date);
    }
    return this.bookingRepo.save(booking);
  }

  // 5. Tutor reject booking
  async rejectBooking(userId: number, bookingId: number) {
    const booking = await this.getBookingForTutor(userId, bookingId);

    if (booking.status !== 'PENDING') {
      throw new BadRequestException(
        `Booking tidak bisa di-reject karena status saat ini: ${booking.status}`,
      );
    }

    booking.status = 'REJECTED';
    return this.bookingRepo.save(booking);
  }

  // 6. Tutor mark as complete -> trigger update tutor stats
  async completeBooking(userId: number, bookingId: number) {
    const booking = await this.getBookingForTutor(userId, bookingId);

    if (booking.status !== 'ACCEPTED') {
      throw new BadRequestException(
        `Booking belum bisa di-complete. Status saat ini: ${booking.status}`,
      );
    }

    booking.status = 'COMPLETED';
    return this.bookingRepo.save(booking);
  }

  // 7. Tutee cancel booking (hanya kalo masih PENDING)
  async cancelBooking(userId: number, bookingId: number) {
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking tidak ditemukan');
    }

    if (Number(booking.user_id) !== Number(userId)) {
      throw new ForbiddenException(
        'Kamu tidak bisa cancel booking orang lain',
      );
    }

    if (booking.status !== 'PENDING') {
      throw new BadRequestException(
        `Booking hanya bisa di-cancel kalau masih PENDING. Status saat ini: ${booking.status}`,
      );
    }

    booking.status = 'CANCELLED';
    return this.bookingRepo.save(booking);
  }

  // 8. Helper: get booking + cek ownership tutor
  private async getBookingForTutor(userId: number, bookingId: number) {
    const profile = await this.tutorProfileRepo.findOne({
      where: { user_id: userId },
    });
    if (!profile) {
      throw new ForbiddenException('Kamu bukan tutor');
    }

    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
    });
    if (!booking) {
      throw new NotFoundException('Booking tidak ditemukan');
    }

    if (Number(booking.tutor_profile_id) !== Number(profile.id)) {
      throw new ForbiddenException('Booking ini bukan punya kamu');
    }

    return booking;
  }

  // 9. Cek booking detail (buat review eligibility)
  async findOne(bookingId: number) {
    return this.bookingRepo.findOne({
      where: { id: bookingId },
      relations: ['tutorProfile', 'user'],
    });
  }
}
