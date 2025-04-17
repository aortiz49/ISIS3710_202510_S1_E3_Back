import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])], // Import the TypeOrmModule for UserEntity
  controllers: [UserController],
  providers: [UserService], // Register UserService as a provider
  exports: [UserService], // Export UserService so it can be used in other modules like AuthModule
})
export class UserModule {}
