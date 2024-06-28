import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserProfile } from './userprofile.entity';


@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @OneToMany(() => UserProfile, userProfile => userProfile.user)
  profiles: UserProfile[];
}

