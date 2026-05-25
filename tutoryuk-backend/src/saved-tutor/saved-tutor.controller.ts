import { Controller, Post, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { SavedTutorService } from './saved-tutor.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('saved-tutors')
export class SavedTutorController {
  constructor(private readonly savedTutorService: SavedTutorService) {}

  @Post(':tutorProfileId')
  async saveTutor(@CurrentUser() user: any, @Param('tutorProfileId') tutorProfileId: string) {
    return this.savedTutorService.saveTutor(user.id, +tutorProfileId);
  }

  @Delete(':tutorProfileId')
  async unsaveTutor(@CurrentUser() user: any, @Param('tutorProfileId') tutorProfileId: string) {
    return this.savedTutorService.unsaveTutor(user.id, +tutorProfileId);
  }

  @Get()
  async getMySavedTutors(@CurrentUser() user: any) {
    return this.savedTutorService.getMySavedTutors(user.id);
  }
}
