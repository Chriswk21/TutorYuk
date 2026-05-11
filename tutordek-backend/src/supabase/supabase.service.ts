import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from './supabase.constants';

@Injectable()
export class SupabaseService {
  constructor(
    @Inject(SUPABASE_CLIENT)
    private readonly supabase: SupabaseClient,
  ) {}

  async testConnection() {
    const { data, error } = await this.supabase
      .from('users')
      .select('id')
      .limit(1);

    if (error) {
      return { connected: false, error: error.message };
    }

    return { connected: true, sample: data };
  }

  async uploadFile(
    bucket: string,
    path: string,
    file: Buffer | Blob | string,
    contentType?: string,
  ) {
    return this.supabase.storage.from(bucket).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType,
    });
  }

  async createSignedUrl(bucket: string, path: string, expiresIn: number) {
    return this.supabase.storage.from(bucket).createSignedUrl(path, expiresIn);
  }
}
