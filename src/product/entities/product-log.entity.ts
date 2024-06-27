import { Column, Entity,  ManyToOne,  PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";


@Entity()
export class ProductLogs{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({nullable: true})
    date:Date;

    @ManyToOne( () => Product,(product) => product.productLogs)
    product:Product;

}