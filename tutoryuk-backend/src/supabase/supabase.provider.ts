import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from './supabase.constants';

export const supabaseProvider = {
  provide: SUPABASE_CLIENT,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): SupabaseClient => {
    const supabaseUrl =
      configService.get<string>('SUPABASE_URL') ||
      configService.get<string>('NEXT_PUBLIC_SUPABASE_URL');
    const supabaseKey =
      configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') ||
      configService.get<string>('SUPABASE_ANON_KEY') ||
      configService.get<string>('NEXT_PUBLIC_SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Missing Supabase configuration. Set SUPABASE_URL and SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
      );
    }

    return createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
    });
  },
};
