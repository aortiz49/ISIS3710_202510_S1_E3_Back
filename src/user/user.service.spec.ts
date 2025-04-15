/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

import { faker } from '@faker-js/faker'; // Changed this line
import { TypeOrmTestingConfig } from '../testing-utils/typeorm-testing-config';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<UserEntity>;
  let usersList: UserEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    usersList = [];
    for (let i = 0; i < 5; i++) {
      const user: UserEntity | null = await repository.save({
        name: faker.person.firstName(),
        description: faker.lorem.sentence(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
      });
      usersList.push(user);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all users', async () => {
    const users: UserEntity[] = await service.findAll();
    expect(users).not.toBeNull();
    expect(users).toHaveLength(usersList.length);
  });

  it('findOne should return a user by id', async () => {
    const storedUser: UserEntity = usersList[0];
    const user: UserEntity = await service.findOne(storedUser.id);
    expect(user).not.toBeNull();
    expect(user.name).toEqual(storedUser.name);
    expect(user.description).toEqual(storedUser.description);
    expect(user.address).toEqual(storedUser.address);
    expect(user.city).toEqual(storedUser.city);
  });

  it('findOne should throw an exception for an invalid user', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('create should return a new user', async () => {
    const user: UserEntity = {
      id: '',
      name: faker.person.fullName(),
      description: faker.lorem.sentence(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      created_at: faker.date.past(),
      updated_at: new Date(),
      last_seen_at: new Date(),
      phone_number: faker.phone.number(),
    };

    const newUser: UserEntity = await service.create(user);
    expect(newUser).not.toBeNull();

    const storedUser = await repository.findOne({
      where: { id: newUser.id },
    });
    expect(storedUser).not.toBeNull();
    expect(storedUser?.name).toEqual(newUser.name);
    expect(storedUser?.description).toEqual(newUser.description);
    expect(storedUser?.address).toEqual(newUser.address);
    expect(storedUser?.city).toEqual(storedUser?.city);
  });

  it('update should modify a user', async () => {
    const user: UserEntity = usersList[0];
    user.name = 'New name';
    user.address = 'New address';

    const updatedUser: UserEntity = await service.update(user.id, user);
    expect(updatedUser).not.toBeNull();

    const storedUser = await repository.findOne({
      where: { id: user.id },
    });
    expect(storedUser).not.toBeNull();
    expect(storedUser?.name).toEqual(user.name);
    expect(storedUser?.address).toEqual(user.address);
  });

  it('update should throw an exception for an invalid user', async () => {
    let user: UserEntity = usersList[0];
    user = {
      ...user,
      name: 'New name',
      address: 'New address',
    };
    await expect(() => service.update('0', user)).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it('delete should remove a user', async () => {
    const user: UserEntity = usersList[0];
    await service.delete(user.id);

    const deletedUser = await repository.findOne({
      where: { id: user.id },
    });
    expect(deletedUser).toBeNull();
  });

  it('delete should throw an exception for an invalid user', async () => {
    const user: UserEntity = usersList[0];
    await service.delete(user.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });
});
