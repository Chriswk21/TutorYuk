import { Controller, Post, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { TutorRegistrationService } from './tutor-registration.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('tutor-registration')
export class TutorRegistrationController {
  constructor(private readonly service: TutorRegistrationService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@CurrentUser() user: any, @Body() dto: CreateRegistrationDto) {
    return await this.service.register(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-status')
  async getMyStatus(@CurrentUser() user: any) {
    return await this.service.findMyRegistration(user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  async getAll() {
    return await this.service.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return await this.service.updateStatus(+id, status);
  }
}
