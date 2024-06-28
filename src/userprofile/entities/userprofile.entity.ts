import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Users } from './users.entity';
import { ProfileLog } from './profilelog.entity';


@Entity()
export class UserProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  user_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  preferred_role: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  project: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  education: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 15, unique: true, nullable: true })
  phone_no: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  linkedin_profile: string;

  @Column({ type: 'bytea', nullable: true })
  image: Buffer;

  @ManyToOne(() => Users, user => user.profiles, { onDelete: 'CASCADE' })
  user: Users;

  @OneToMany(() => ProfileLog, profileLog => profileLog.userProfile)
  logs: ProfileLog[];
}

