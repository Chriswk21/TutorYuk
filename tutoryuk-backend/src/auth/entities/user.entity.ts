import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column({ type: 'varchar' })
  password!: string;

  @Column({
    type: 'enum',
    enum: ['USER', 'TUTOR', 'ADMIN'],
    default: 'USER',
  })
  role!: string;

  // Tambahan: phone_number untuk fitur WA reveal
  @Column({ type: 'varchar', nullable: true })
  phone_number!: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'now()' })
  created_at!: Date;
}
