import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductDetail } from "./product-detail.entity";
import { ProductLogs } from "./product-log.entity";

@Entity()
export class Product{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    productName:string;

    @OneToOne(() => ProductDetail,(productDetail) => productDetail.product)
    productDetail:ProductDetail;

    @OneToMany(() => ProductLogs,(productLogs) => productLogs.product)
    productLogs:ProductLogs[];

}