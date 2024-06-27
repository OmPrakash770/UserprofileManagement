import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";




export class UpdateUserDto{
    
    @IsNotEmpty()
    @IsUUID()
    id:string;

    @IsOptional()
    @IsEmail()
    email:string;

    @IsOptional()
    @IsString()
    firstName:string;

    @IsOptional()
    @IsString()
    lastName:string;
}