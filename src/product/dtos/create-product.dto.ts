import { IsNotEmpty, IsString,  } from "class-validator";

export class CreateProductDto{

    @IsNotEmpty()
    @IsString()
    productName:string;

    @IsNotEmpty()
    @IsString()
    productBrand:string;

    @IsNotEmpty()
    @IsString()
    productCountry:string;
    
}