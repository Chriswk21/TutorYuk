import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TutorRegistrationController } from './tutor-registration.controller';
import { TutorRegistrationService } from './tutor-registration.service';
import { TutorRegistration } from './entities/tutor-registration.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TutorRegistration])],
  controllers: [TutorRegistrationController],
  providers: [TutorRegistrationService],
})
export class TutorRegistrationModule {}
