import { Controller, Put, Get, Body, UseGuards, Param, Query } from '@nestjs/common';
import { TutorProfileService } from './tutor-profile.service';
import { UpdateTutorProfileDto } from './dto/update-tutor-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('tutor-profile')
export class TutorProfileController {
  constructor(private readonly tutorProfileService: TutorProfileService) {}

  @Get('public')
  async findAllPublic(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('searchQuery') searchQuery?: string,
    @Query('minRating') minRating?: string,
  ) {
    return this.tutorProfileService.findAllPublic({
      page: +page,
      limit: +limit,
      searchQuery,
      minRating: minRating ? +minRating : undefined,
    });
  }

  @Get('public/:id')
  async findPublicById(@Param('id') id: string) {
    return this.tutorProfileService.findPublicById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateProfile(@CurrentUser() user: any, @Body() updateDto: UpdateTutorProfileDto) {
    return this.tutorProfileService.updateProfile(user.id, updateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@CurrentUser() user: any) {
    return this.tutorProfileService.getProfile(user.id);
  }
}
