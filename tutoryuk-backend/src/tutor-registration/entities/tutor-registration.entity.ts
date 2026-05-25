import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('tutor_registrations')
export class TutorRegistration {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'user_id', type: 'bigint', nullable: true })
  user_id: number;

  @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

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
