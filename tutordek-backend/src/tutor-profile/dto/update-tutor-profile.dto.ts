import { IsString, IsOptional } from 'class-validator';

export class UpdateTutorProfileDto {
  @IsString()
  @IsOptional()
  phone_number?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  experience?: string;

  @IsString()
  @IsOptional()
  education?: string;

  @IsString()
  @IsOptional()
  profile_path?: string;

  @IsString()
  @IsOptional()
  teaching_preference?: string;
}
