import { IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';

export class AcceptBookingDto {
  // Lokasi atau link Zoom/GMeet, wajib pas accept
  @IsString()
  @IsNotEmpty({ message: 'Lokasi atau link harus diisi' })
  location_or_link: string;

  // Optional: tutor bisa ubah tanggal kalo udah nego beda dari preferensi tutee
  @IsOptional()
  @IsDateString({}, { message: 'schedule_date harus format tanggal yang valid' })
  schedule_date?: string;
}
