import { Controller, Put, Get, Body, UseGuards, Request, Param } from '@nestjs/common';
import { TutorProfileService } from './tutor-profile.service';
import { UpdateTutorProfileDto } from './dto/update-tutor-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tutor-profile')
export class TutorProfileController {
  constructor(private readonly tutorProfileService: TutorProfileService) {}

  @Get('public')
  async findAllPublic() {
    return this.tutorProfileService.findAllPublic();
  }

  @Get('public/:id')
  async findPublicById(@Param('id') id: string) {
    return this.tutorProfileService.findPublicById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateProfile(@Request() req, @Body() updateDto: UpdateTutorProfileDto) {
    // req.user.id didapat dari JWT token hasil decode di JwtStrategy
    const userId = req.user.id;
    return this.tutorProfileService.updateProfile(userId, updateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@Request() req) {
    const userId = req.user.id;
    return this.tutorProfileService.getProfile(userId);
  }
}
