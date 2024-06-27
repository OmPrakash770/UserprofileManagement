import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Put, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { UserprofileService } from "./userprofile.service";
import { CreateUsersDto } from "./dtos/create-users.dto";
import {Response} from 'express';
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateUserProfileDto } from "./dtos/create-userprofile.dto";

@Controller('v1/api')
export class UserprofileController {

    constructor(private readonly userprofileService:UserprofileService){}

    @Post('/user/register')
    async register(@Body() createUserDto: CreateUsersDto,@Res() res:Response){

        const result = await this.userprofileService.register(createUserDto);
    
        return res.status(result.statusCode).send(result);

    }

    @Post('/user/login')
    async login(@Body() createUserDto: CreateUsersDto,@Res() res:Response){

        const result = await this.userprofileService.login(createUserDto);
    
        return res.status(result.statusCode).send(result);

    }

  
      

      @Post('/userprofile/:username')
      @UseInterceptors(FileInterceptor('file'))
     async createProfile(
      @Param('username') username: string,
      @Body() createUserProfileDto: CreateUserProfileDto,
      @UploadedFile() file: Express.Multer.File,
      @Res() res: Response,) 
       {
      try {
        const newProfile = await this.userprofileService.createProfile(createUserProfileDto, file, username);
        return res.status(HttpStatus.CREATED).json({
            msg: 'Profile created successfully',
            id: newProfile.id,
        });
       } catch (error) {
        if (error instanceof BadRequestException) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                msg: error.message,
            });
        }
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            msg: 'Something went wrong',
            error: error.message,
        });
    }
}




      @Get('/userprofile/:username')
      async getUserProfileByUsername(
        @Param('username') username: string,
        @Res() res: Response,
      ) {
        try {
          const profile = await this.userprofileService.getUserProfileByUsername(username);
          return res.status(HttpStatus.OK).json(profile);
        } catch (error) {
          if (error instanceof NotFoundException) {
            return res.status(HttpStatus.NOT_FOUND).json({ msg: error.message });
          }
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            msg: 'Something went wrong',
            error: error.message,
          });
        }
      }
    

  @Put('/userprofile/:username')
  @UseInterceptors(FileInterceptor('image'))
  async updateProfile(
    @Param('username') username: string,
    @Body() updateProfileDto: {
      name?: string;
      preferred_role?: string;
      project?: string;
      education?: string;
      address?: string;
      phone_no?: string;
      linkedin_profile?: string;
    },
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    try {
      const updatedProfile = await this.userprofileService.updateProfile(username, {
        ...updateProfileDto,
        image: file ? file.buffer : undefined,
      });
      return res.status(HttpStatus.OK).json(updatedProfile);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        return res.status(HttpStatus.NOT_FOUND).json({ msg: error.message });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        msg: 'Something went wrong',
        error: error.message,
      });
    }
  }
       
  @Delete('/userprofile/:username')
  async deleteProfile(
    @Param('username') username: string,
    @Res() res: Response,
  ) {
    try {
      const deleteResult = await this.userprofileService.deleteProfile(username);
      return res.status(HttpStatus.OK).json(deleteResult);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({ msg: error.message });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        msg: 'Something went wrong',
        error: error.message,
      });
    }
  }
    

  // @Delete('/user/:username')
  // async deleteUser(
  //   @Param('username') username: string,
  //   @Res() res: Response,
  // ) {
  //   try {
  //     const deleteResult = await this.userprofileService.deleteUser(username);
  //     return res.status(HttpStatus.OK).json(deleteResult);
  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       return res.status(HttpStatus.NOT_FOUND).json({ msg: error.message });
  //     }
  //     return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
  //       msg: 'Something went wrong',
  //       error: error.message,
  //     });
  //   }
  // }

  @Delete('/user/:username')
  async deleteUser(
    @Param('username') username: string,
    @Res() res: Response,
  ) {
    try {
      const deleteResult = await this.userprofileService.deleteUser(username);
      return res.status(HttpStatus.OK).json(deleteResult);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).json({ msg: error.message });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        msg: 'Something went wrong',
        error: error.message,
      });
    }
  }



  @Post('/logout/:username')
  async logout(
    @Param('username') username: string,
    @Res() res: Response,
  ) {
    try {
      const logoutResult = await this.userprofileService.logout(username);
      return res.status(logoutResult.statusCode).json(logoutResult);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        msg: 'Something went wrong',
        error: error.message,
      });
    }
  }

    }
    