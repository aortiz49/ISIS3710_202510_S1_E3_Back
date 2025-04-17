import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, QueryRunner, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/business-errors';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given email was not found',
        BusinessError.NOT_FOUND,
      );

    return user;
  }

  async create(
    user: Partial<UserEntity>,
    queryRunner: QueryRunner,
  ): Promise<UserEntity> {
    try {
      const newUser = queryRunner.manager.create(UserEntity, user);
      return await queryRunner.manager.save(UserEntity, newUser);
    } catch (error) {
      // Check for duplicate email error
      if (
        error instanceof QueryFailedError &&
        (error as any).code === '23505'
      ) {
        // For PostgreSQL Duplicate Key Error
        console.log('Duplicate key error detected!');
        throw new BusinessLogicException(
          'The user with the given email already exists!',
          BusinessError.BAD_REQUEST,
        );
      }
      throw error; // Rethrow other errors if needed
    }
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return user;
  }

  async update(
    id: string,
    updateUserDto: Partial<UserEntity>,
  ): Promise<UserEntity> {
    const existingUser = await this.userRepository.findOneBy({ id });

    if (!existingUser) {
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    // Merge the update fields into the existing user
    const updatedUser = this.userRepository.merge(existingUser, updateUserDto);

    return await this.userRepository.save(updatedUser);
  }

  async delete(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.userRepository.remove(user);
  }
}
