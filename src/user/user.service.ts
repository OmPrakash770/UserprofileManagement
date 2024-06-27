import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { dataSource } from 'src/main';
import { User } from './entities/user.entity';
import { UserDetail } from './entities/user-detail.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { DeleteUserDto } from './dtos/delete-user.dto';




@Injectable()
export class UserService {
    async create({ email, firstName, lastName }: CreateUserDto) {
        const queryRunner = dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            const createUser = new User();

            createUser.email = email;
            
            const saveUser = await queryRunner.manager.save<User>(createUser);

            const createUserDetail = new UserDetail();

            createUserDetail.firstName = firstName;
            createUserDetail.lastName = lastName;
            createUserDetail.user = saveUser;

            await queryRunner.manager.save<UserDetail>(createUserDetail);

            await queryRunner.commitTransaction();

            return {
                ok: true,
                error: false,
                message: 'User created successfully',
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

    async fetchAll() {
        try {
            const result = await dataSource.manager.find(User);

            return result;
        } catch (error: any) {
            console.log(error);
            return [];
        }
    }

    async fetchAllwithDetail() {
        try {
            const result = await dataSource.manager.createQueryBuilder(
                User,
                'u'
            )
            .leftJoinAndMapOne(
                'u.userDetail',
                UserDetail,
                'ur',
                'ur."userId"= u.id'
            )
            .getMany()
            
            return result;

        
        } catch (error: any) {
            console.log(error);
            return [];
        }
    }


    async fetchAllById(id){
        try {
            const result = await dataSource.manager.createQueryBuilder(
                User,
                'u'
            )
            .leftJoinAndMapOne(
                'u.userDetail',
                UserDetail,
                'ur',
                'ur."userId"= u.id'
            )
            .where('u.id =:id',{id})
            .getOne()
            
            return result;

        
        } catch (error: any) {
            console.log(error);
            return [];
        }
    }
     

    async update({email,firstName,id,lastName}: UpdateUserDto){
        
        const queryRunner = dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            
            
                const updateUser = new User();
                
                if(email) updateUser.email=email;
                    
                await queryRunner.manager.update(
                        User,{
                            id
                        },
                        updateUser
                    );
                

                const updateUserDetail = new UserDetail();

                if(firstName) updateUserDetail.firstName = firstName;
                if(lastName) updateUserDetail.lastName = lastName;

                await queryRunner.manager.update(
                    UserDetail,{
                        user:{
                            id
                            
                        }
                        
                    },updateUserDetail
                    
                  
                );
                 
                await queryRunner.commitTransaction();
            
            return {
                ok: true,
                error: false,
                message: 'user Updated Successfully',
                statusCode: 200
            }
        }
    
        

           catch (error:any) {
            
            await queryRunner.rollbackTransaction();
            return {
                ok: false,
                error: true,
                message: 'Something Went Wrong',
                statusCode: 500
            }

        } finally{
           
            await queryRunner.release();
        }

    }

    async delete({id}: DeleteUserDto){

        const queryRunner = dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

       try{

       

        const deleteUserDetailResult= await queryRunner.manager.delete(UserDetail,{
            user:{
                id
            }
        })


        const deleteUserResult = await queryRunner.manager.delete(User,{
            id
        }
        )

        if (deleteUserDetailResult.affected === 0 && deleteUserResult.affected === 0) {
            throw new Error('User not found');
        }

        return {
            ok: true,
            error: false,
            message: 'user Deleted Successfully',
            statusCode: 200
        }

       }catch(error:any){
         
        await queryRunner.rollbackTransaction();
        
        return {
            ok: false,
            error: true,
            message: error.message === 'User not found' ? 'User not found' : 'Something went wrong',
            statusCode: error.message === 'User not found' ? 404 : 500,
        };

       }finally{

          await queryRunner.release();
       } 
    }

}