import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user.service';
import { UserEntity } from '../user.entity';
import { CreateUserDto } from '../DTOs/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  async register(userDto: CreateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user: UserEntity = plainToInstance(UserEntity, userDto);
      const newUser = await queryRunner.manager.save(UserEntity, user);
      const payload = { sub: newUser.email, name: newUser.name }; // Add any necessary info to the payload
      const token = this.jwtService.sign(payload);
      await queryRunner.commitTransaction();

      // Return the user and token
      return { user: newUser, access_token: token };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async checkIfEmailExists(email: string) {
    const user = await this.userService.findByEmail(email);
    return user ? true : false; // Return true if user exists
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.findByEmail(email);

    const isValid = await user.validatePassword(password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user);
  }

  private generateToken(user: UserEntity): { access_token: string } {
    const payload = { sub: user.id, email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }
}
