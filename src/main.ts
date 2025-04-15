import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api/v',
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties without decorators
      forbidNonWhitelisted: false, // Throw error on unknown props
      forbidUnknownValues: false, // Prevents invalid DTO shapes
      transform: true, // Auto-transform payloads to DTO instances
    }),
  );

  await app.listen(3000);
}
bootstrap();
