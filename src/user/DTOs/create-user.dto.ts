import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsBoolean()
  admin?: boolean;

  @IsOptional()
  @IsBoolean()
  service_provider?: boolean;
}
