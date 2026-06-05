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

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is listening on port: ${port}`);
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap', err);
});