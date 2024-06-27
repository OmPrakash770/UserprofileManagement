import { Body, Controller, Delete, Get,  Param,  Post, Put, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import {Response} from 'express';
import { UpdateUserDto } from './dtos/update-user.dto';
import { DeleteUserDto } from './dtos/delete-user.dto';


@Controller('v1/api/user')
export class UserController {

    constructor(private readonly userService:UserService){}

    @Post()
    async create(@Body() createUserDto: CreateUserDto,@Res() res:Response){

        const result = await this.userService.create(createUserDto);
    
        return res.status(result.statusCode).send(result);

    }

    @Get()
    async fetchAll(){
       return this.userService.fetchAll()

    }

    @Get('user-detail')
    async fetchAllwithDetail(){
       return this.userService.fetchAllwithDetail();

    }
    
    @Get('fetch-by-id/:id')
    async fetchById(@Param('id') id:string){
        return this.userService.fetchAllById(id);
    }
    
    @Put()
    async update(@Body() updateUserDto:UpdateUserDto,@Res() res:Response){
        const result = await this.userService.update(updateUserDto);
        return res.status(result.statusCode).send(result);
    }
    
    @Delete()
    async delete(@Body() deleteUserDto:DeleteUserDto,@Res() res:Response){
        const result = await this.userService.delete(deleteUserDto);
        return res.status(result.statusCode).send(result);

    }
    
    
}


