/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UserDto {
  @IsOptional() // Make it optional for updates
  @IsString()
  @IsNotEmpty()
  readonly name?: string;

  @IsOptional() // Make it optional for updates
  @IsString()
  @IsNotEmpty()
  readonly description?: string;

  @IsOptional() // Make it optional for updates
  @IsString()
  @IsNotEmpty()
  readonly address?: string;

  @IsOptional() // Make it optional for updates
  @IsString()
  @IsNotEmpty()
  readonly city?: string;
}
