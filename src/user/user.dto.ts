/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsOptional, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class UserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly description?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly address?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly city?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;
}
