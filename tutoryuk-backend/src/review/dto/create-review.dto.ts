import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsInt({ message: 'Rating harus berupa angka' })
  @Min(1, { message: 'Rating minimal 1 bintang' })
  @Max(5, { message: 'Rating maksimal 5 bintang' })
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
