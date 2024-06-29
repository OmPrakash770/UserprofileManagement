import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserProfile } from './userprofile.entity';

@Entity()
export class ProfileLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  profile_id: number;

  @Column({ type: 'varchar', length: 50 })
  action: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @ManyToOne(() => UserProfile, userProfile => userProfile.logs, { onDelete: 'CASCADE' })
  userProfile: UserProfile;
}




