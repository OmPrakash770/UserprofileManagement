import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class ProductDetail{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    productBrand:string;

    @Column()
    productCountry:string;

    @JoinColumn()
    @OneToOne(() => Product,(product) =>product.productDetail,{
        nullable:false,
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
    })

    product:Product;


}