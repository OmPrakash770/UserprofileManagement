import { IsEmail, IsNotEmpty, IsString, IsUUID } from "class-validator";



export class DeleteUserDto{
    
    @IsNotEmpty()
    @IsUUID()
    id:string;

}