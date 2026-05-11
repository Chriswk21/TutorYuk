import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' }) // Sesuai 'bigint' di SQL
  id: number;

  @Column({ type: 'varchar' }) // Sesuai 'character varying'
  name: string;

  @Column({ type: 'varchar', unique: true }) // Sesuai 'UNIQUE' di SQL
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  // Biar gak error sama role_type, kita suruh Postgres buat casting otomatis
  @Column({
    type: 'enum',
    enum: ['USER', 'TUTOR', 'ADMIN'], // Sesuaikan dengan isi role_type lo
    default: 'USER',
  })
  role: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'now()' }) // Sesuai SQL lo
  created_at: Date;
}
