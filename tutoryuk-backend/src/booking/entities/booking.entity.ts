import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { TutorProfile } from '../../tutor-profile/entities/tutor-profile.entity';
import { Category } from '../../category/entities/category.entity';

export type BookingStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'COMPLETED'
  | 'CANCELLED';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  user_id: number; // tutee yg request

  @Column({ type: 'bigint' })
  tutor_profile_id: number;

  @Column({ type: 'bigint' })
  category_id: number;

  @Column({ type: 'timestamp' })
  schedule_date: Date;

  @Column({ type: 'varchar', nullable: true })
  location_or_link: string;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING',
  })
  status: BookingStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'now()' })
  created_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => TutorProfile)
  @JoinColumn({ name: 'tutor_profile_id' })
  tutorProfile: TutorProfile;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
