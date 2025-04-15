import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from './DTOs/create-user.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { UpdateUserDto } from './DTOs/update-user.dto';

@Controller('users')
@UseInterceptors(BusinessErrorsInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get('id/:userId')
  async findOneById(@Param('userId') userId: string) {
    return await this.userService.findOne(userId);
  }

  @Get('email/:email')
  async findOneByEmail(@Param('email') email: string) {
    return await this.userService.findByEmail(email);
  }

  @Post()
  async create(@Body() userDto: CreateUserDto) {
    try {
      console.log('Incoming DTO:', userDto); // 👀 See what's coming in
      const user: UserEntity = plainToInstance(UserEntity, userDto);
      return await this.userService.create(user);
    } catch (error) {
      console.error('Create user error:', error); // 🔥 Catch the real issue
      throw error;
    }
  }

  @Put(':userId')
  async updateUser(
    @Param('userId') id: string,
    @Body() userDto: UpdateUserDto,
  ) {
    const existingUser = await this.userService.findOne(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

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
