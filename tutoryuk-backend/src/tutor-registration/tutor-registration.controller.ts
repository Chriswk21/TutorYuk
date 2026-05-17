import { Controller, Post, Get, Patch, Body, Param } from '@nestjs/common';
import { TutorRegistrationService } from './tutor-registration.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';

@Controller('tutor-registration')
export class TutorRegistrationController {
  constructor(private readonly service: TutorRegistrationService) {}

  @Post()
  async create(@Body() dto: CreateRegistrationDto) {
    return await this.service.register(dto);
  }

  @Get()
  async getAll() {
    return await this.service.findAll();
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return await this.service.updateStatus(+id, status);
  }
}
