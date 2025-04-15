import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/business-errors';
import { DUPLICATE_KEY } from 'src/shared/errors/psql-errors';

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

  async create(user: Partial<UserEntity>): Promise<UserEntity> {
    try {
      const newUser = this.userRepository.create(user);
      return await this.userRepository.save(newUser);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as any).code === DUPLICATE_KEY
      ) {
        throw new BusinessLogicException(
          'The user with the given email already exists',
          BusinessError.BAD_REQUEST,
        );
      }

      throw error;
    }
  }

  async update(id: string, user: Partial<UserEntity>): Promise<UserEntity> {
    const persistedUser = await this.userRepository.findOne({
      where: { id },
    });

    if (!persistedUser) {
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    const updatedUser = { ...persistedUser, ...user };
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
