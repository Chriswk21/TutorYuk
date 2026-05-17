import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('tutor_registrations')
export class TutorRegistration {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone_number: string;

  @Column()
  education: string;

  @Column()
  cv_url: string; // Nanti di Vue lo upload ke Supabase Storage, simpan URL-nya di sini

  @Column({ type: 'varchar', default: 'PENDING' })
  status: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
