import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';
import { TutorRegistrationModule } from './tutor-registration/tutor-registration.module';
import { SupabaseModule } from './supabase/supabase.module';
import { TutorProfileModule } from './tutor-profile/tutor-profile.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SavedTutorModule } from './saved-tutor/saved-tutor.module';
import { CategoryModule } from './category/category.module';
import { BookingModule } from './booking/booking.module';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        ssl: { rejectUnauthorized: false },
        entities: [User],
        synchronize: false,
        autoLoadEntities: true,
      }),
    }),
    SupabaseModule,
    AuthModule,
    TutorRegistrationModule,
    TutorProfileModule,
    SavedTutorModule,
    CategoryModule,
    BookingModule,
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
