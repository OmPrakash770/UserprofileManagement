import { Body, Controller, Post, Res } from "@nestjs/common";
import { CreateProductDto } from "./dtos/create-product.dto";
import { ProductService } from "./product.service";
import {Response} from 'express';

@Controller('v1/api/product')
export class ProductController{

    constructor(private readonly productService:ProductService){}
    
    @Post()
    async create(@Body() createProductDto:CreateProductDto,@Res() res:Response){

        const result = await this.productService.create(createProductDto);

        return res.status(result.statusCode).send(result);
    }
    
}