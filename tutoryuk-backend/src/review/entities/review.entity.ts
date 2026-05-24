import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', unique: true })
  booking_id: number;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'now()' })
  created_at: Date;

  @OneToOne(() => Booking)
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;
}
