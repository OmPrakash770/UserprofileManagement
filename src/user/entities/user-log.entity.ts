import { Column, Entity,  ManyToOne,  PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class UserLogs{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({nullable: true})
    date:Date;
    
    @ManyToOne ( () => User,(user)=>user.userLogs)
    user:User;
    
}