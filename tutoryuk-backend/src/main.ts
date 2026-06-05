import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { types } from 'pg';

// Konfigurasi driver pg untuk otomatis melakukan parsing bigint (INT8, OID 20) menjadi number di JavaScript
types.setTypeParser(20, (val) => parseInt(val, 10));

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap', err);
});