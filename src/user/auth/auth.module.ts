import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Ensure your environment variable is properly set
      signOptions: { expiresIn: '1d' }, // Set the token expiration time
    }),
    ConfigModule.forRoot(), // Load environment variables
    UserModule, // Import UserModule here
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService], // Export AuthService so it can be used in other modules if necessary
})
export class AuthModule {}
