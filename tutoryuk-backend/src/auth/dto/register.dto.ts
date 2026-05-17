import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password minimal 6 karakter bro!' })
  password: string;

  @IsString()
  @IsNotEmpty()
  role: string;
}
