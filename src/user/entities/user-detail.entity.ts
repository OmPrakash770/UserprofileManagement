import { Column, Entity,  JoinColumn,  OneToOne,  PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class UserDetail{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    firstName:string;
    
    @Column()
    lastName:string;

    @JoinColumn()
    @OneToOne(() => User,(user) =>user.userDetail,{
        nullable:false,
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
    })

    user:User;
    
}