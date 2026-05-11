import { Controller, Get } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

@Controller('supabase')
export class SupabaseController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get('test')
  async testConnection() {
    return await this.supabaseService.testConnection();
  }
}
