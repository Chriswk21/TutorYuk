import { Controller, Post, Delete, Get, Param, UseGuards, Request } from '@nestjs/common';
import { SavedTutorService } from '../services/saved-tutor.service';
import { JwtAuthGuard } from './../../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('saved-tutors')
export class SavedTutorController {
  constructor(private readonly savedTutorService: SavedTutorService) {}

  @Post(':tutorProfileId')
  async saveTutor(@Request() req, @Param('tutorProfileId') tutorProfileId: string) {
    return this.savedTutorService.saveTutor(req.user.id, +tutorProfileId);
  }

  @Delete(':tutorProfileId')
  async unsaveTutor(@Request() req, @Param('tutorProfileId') tutorProfileId: string) {
    return this.savedTutorService.unsaveTutor(req.user.id, +tutorProfileId);
  }

  @Get()
  async getMySavedTutors(@Request() req) {
    return this.savedTutorService.getMySavedTutors(req.user.id);
  }
}