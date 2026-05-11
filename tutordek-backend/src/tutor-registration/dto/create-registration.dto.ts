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

  @IsUrl()
  @IsNotEmpty()
  cv_url: string;
}
