import { IsEmail, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateRegistrationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsString()
  @IsNotEmpty()
  education: string;

  @IsUrl() // Memastikan format CV adalah link/URL storage
  cv_url: string;
}
