import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedTutorController } from './saved-tutor.controller';
import { SavedTutorService } from './saved-tutor.service';
import { SavedTutor } from './entities/saved-tutor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SavedTutor])], 
  controllers: [SavedTutorController],
  providers: [SavedTutorService],
})
export class SavedTutorModule {}