import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { supabaseProvider } from './supabase.provider';
import { SupabaseService } from './supabase.service';
import { SupabaseController } from './supabase.controller';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [supabaseProvider, SupabaseService],
  exports: [SupabaseService],
  controllers: [SupabaseController],
})
export class SupabaseModule {}
