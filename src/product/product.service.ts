import { Injectable } from "@nestjs/common";
import { CreateProductDto } from "./dtos/create-product.dto";
import { dataSource } from "src/main";
import { Product } from "./entities/product.entity";
import { ProductDetail } from "./entities/product-detail.entity";


@Injectable()
export class ProductService{
    
    async create({productName,productBrand,productCountry}:CreateProductDto){
    const queryRunner = dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try{
        const createProduct = new Product();

        createProduct.productName = productName;

        const saveProduct = await queryRunner.manager.save<Product>(createProduct);
    
        const createProductDetail = new ProductDetail();

        createProductDetail.productBrand = productBrand;
        createProductDetail.productCountry = productCountry;
        createProductDetail.product= saveProduct;

        await queryRunner.manager.save<ProductDetail>(createProductDetail);

        await queryRunner.commitTransaction();

        return {
            ok: true,
            error: false,
            message: 'Product created successfully',
            statusCode: 201
        }
    } catch(error: any) {
        await queryRunner.rollbackTransaction();

        return {
            ok: false,
            error: true,
            message: 'Something Went Wrong',
            statusCode: 500
        }
    } finally {
        await queryRunner.release();
    }
    }
}