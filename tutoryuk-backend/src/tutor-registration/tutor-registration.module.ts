import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TutorRegistrationController } from './tutor-registration.controller';
import { TutorRegistrationService } from './tutor-registration.service';
import { TutorRegistration } from './entities/tutor-registration.entity';
import { TutorProfile } from '../tutor-profile/entities/tutor-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TutorRegistration, TutorProfile])],
  controllers: [TutorRegistrationController],
  providers: [TutorRegistrationService],
})
export class TutorRegistrationModule {}
