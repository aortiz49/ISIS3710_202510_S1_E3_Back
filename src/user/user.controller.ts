/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserDto } from './user.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';

@Controller('users')
@UseInterceptors(BusinessErrorsInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':userId')
  async findOne(@Param('userId') userId: string) {
    return await this.userService.findOne(userId);
  }

  @Post()
  async create(@Body() userDto: UserDto) {
    const user: UserEntity = plainToInstance(UserEntity, userDto);
    return await this.userService.create(user);
  }

  @Put(':userId')
  async updateUser(@Param('userId') id: string, @Body() userDto: UserDto) {
    const logger = new Logger('UserController'); // Logger for debugging

    const existingUser = await this.userService.findOne(id);
    if (!existingUser) {
      logger.error('User not found for id:', id);
      throw new Error('User not found');
    }

    logger.debug('Existing user:', existingUser);

    // Only update the fields that are provided in the userDto
    // Update the existing user with the provided fields, keeping the rest intact
    const updatedUser = Object.assign(existingUser, userDto);

    const savedUser = await this.userService.update(id, updatedUser);

    return savedUser;
  }

  @Delete(':userId')
  @HttpCode(204)
  async delete(@Param('userId') userId: string) {
    return await this.userService.delete(userId);
  }
}
