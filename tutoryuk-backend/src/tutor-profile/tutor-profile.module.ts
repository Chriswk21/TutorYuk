import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TutorProfile } from './entities/tutor-profile.entity';
import { TutorProfileController } from './tutor-profile.controller';
import { TutorProfileService } from './tutor-profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([TutorProfile])],
  controllers: [TutorProfileController],
  providers: [TutorProfileService],
})
export class TutorProfileModule {}
