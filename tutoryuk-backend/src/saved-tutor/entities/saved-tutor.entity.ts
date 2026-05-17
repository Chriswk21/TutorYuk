import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  ManyToOne, 
  JoinColumn, 
  Unique 
} from 'typeorm';
import { User } from '../../auth/entities/user.entity'; 
import { TutorProfile } from '../../tutor-profile/entities/tutor-profile.entity';

@Entity('saved_tutors')
@Unique(['user_id', 'tutor_profile_id'])
export class SavedTutor {
  // Tambahkan tanda seru (!) di sini
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: number;

  @Column({ type: 'bigint' })
  user_id!: number;

  @Column({ type: 'bigint' })
  tutor_profile_id!: number;

  @CreateDateColumn()
  created_at!: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => TutorProfile)
  @JoinColumn({ name: 'tutor_profile_id' })
  tutorProfile!: TutorProfile;
}