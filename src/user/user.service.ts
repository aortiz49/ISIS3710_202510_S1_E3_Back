import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
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
    const newUser = this.userRepository.create(user);
    return await this.userRepository.save(newUser);
  }
  async update(id: string, user: UserEntity): Promise<UserEntity> {
    const persistedUser = await this.userRepository.findOne({
      where: { id },
    });
    if (!persistedUser)
      throw new BusinessLogicException(
        'The user with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return await this.userRepository.save({ ...persistedUser, ...user });
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
