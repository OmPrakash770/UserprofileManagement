import { Column, Entity,  JoinColumn,  OneToMany,  OneToOne,  PrimaryGeneratedColumn } from "typeorm";
import { UserDetail } from "./user-detail.entity";
import { UserLogs } from "./user-log.entity";

@Entity()
export class User{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    email:string;

    
    @OneToOne(() => UserDetail,(userDetail) =>userDetail.user)
    userDetail:UserDetail;

    @OneToMany(() => UserLogs,(userLogs) =>userLogs.user)
    userLogs:UserLogs[];
}