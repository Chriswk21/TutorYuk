import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('tutor_profiles')
export class TutorProfile {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', unique: true })
  user_id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar' })
  phone_number: string;

  @Column({ type: 'text' })
  bio: string;

  @Column({ type: 'text' })
  experience: string;

  @Column({ type: 'varchar' })
  education: string;

  @Column({ type: 'varchar', nullable: true })
  profile_path: string;

  @Column({ type: 'text', nullable: true })
  teaching_preference: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'now()' })
  created_at: Date;
}
