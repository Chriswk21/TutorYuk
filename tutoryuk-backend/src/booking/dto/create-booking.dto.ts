import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';

export class CreateBookingDto {
  @IsInt({ message: 'tutor_profile_id harus angka' })
  @IsNotEmpty()
  tutor_profile_id: number;

  @IsInt({ message: 'category_id harus angka' })
  @IsNotEmpty()
  category_id: number;

  @IsDateString({}, { message: 'schedule_date harus format tanggal yang valid' })
  schedule_date: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
