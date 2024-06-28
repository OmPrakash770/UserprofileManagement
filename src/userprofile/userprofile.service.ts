import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateUsersDto } from "./dtos/create-users.dto";
import { dataSource } from "src/main";
import { Users } from "./entities/users.entity";
import { CreateUserProfileDto } from "./dtos/create-userprofile.dto";
import { UserProfile } from "./entities/userprofile.entity";
import { ProfileLog } from "./entities/Profilelog.entity";

@Injectable()
export class UserprofileService{
    async register({username,password}:CreateUsersDto){
        const queryRunner = dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            const createUsers = new Users();

            createUsers.username = username;
            createUsers.password = password;
            
            const saveUser = await queryRunner.manager.save<Users>(createUsers);

            await queryRunner.commitTransaction();

            return {
                ok: true,
                error: false,
                message: 'User registered successfully',
                statusCode: 201
            }
        } catch(error: any) {
            await queryRunner.rollbackTransaction();
            if (error.code === '23505') {
                // PostgreSQL error code for unique violation
                return {
                    ok: false,
                    error: true,
                    message: 'Username already exists. Please choose a different username.',
                    statusCode: 500
                }
              }
              

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

    async login({ username, password }: CreateUsersDto) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            const user = await queryRunner.manager.findOne(Users, { where: { username } });

            if (!user) {
                return {
                    ok: false,
                    error: true,
                    message: 'User not found',
                    statusCode: 404,
                };
            }

            // Here you should hash the password and compare it with the stored hashed password
            // For simplicity, assuming plain text password comparison
            if (user.password !== password) {
                return {
                    ok: false,
                    error: true,
                    message: 'Invalid password',
                    statusCode: 401,
                };
            }

            return {
                ok: true,
                error: false,
                message: 'Login successful',
                statusCode: 200,
            };
        } catch (error: any) {
            return {
                ok: false,
                error: true,
                message: 'Something Went Wrong',
                statusCode: 500,
            };
        } finally {
            await queryRunner.release();
        }
    }

    

    async createProfile(createUserProfileDto: CreateUserProfileDto, file: Express.Multer.File, username: string) {
      const queryRunner = dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
          const { name, preferred_role, project, education, address, phone_no, linkedin_profile } = createUserProfileDto;
          const image = file ? file.buffer : null;
  
          if (!username) {
              throw new BadRequestException('Username cannot be empty');
          }
  
          if (!phone_no) {
              throw new BadRequestException('Phone No cannot be empty');
          }
  
          // Step 1: Check if user exists based on username
          let user = await queryRunner.manager.findOne(Users, { where: { username } });
  
          if (!user) {
              // User doesn't exist, create new user
              // user = new Users();
              // user.username = username;
              // user = await queryRunner.manager.save(user);
              throw new BadRequestException('User info not found');
          }
  
          // Check if user already has a profile
          const existingProfile = await queryRunner.manager.findOne(UserProfile, { where: { user_id: user.id } });
  
          if (existingProfile) {
              throw new BadRequestException('User already has a profile');
          }
  
          // Step 2: Insert into user_profiles with user_id
          const newProfile = new UserProfile();
          newProfile.user_id = user.id;
          newProfile.name = name;
          newProfile.preferred_role = preferred_role;
          newProfile.project = project;
          newProfile.education = education;
          newProfile.address = address;
          newProfile.phone_no = phone_no;
          newProfile.linkedin_profile = linkedin_profile;
          newProfile.image = image;
  
          const savedProfile = await queryRunner.manager.save(newProfile);
  
          // Log the creation of the profile
          const newLog = new ProfileLog();
          newLog.profile_id = savedProfile.id;
          newLog.action = 'Created';
          await queryRunner.manager.save(newLog);
  
          await queryRunner.commitTransaction();
  
          return {
              ok: true,
              error: false,
              message: 'Profile created successfully',
              statusCode: 201,
              id: savedProfile.id,
          };
      } catch (error: any) {
          await queryRunner.rollbackTransaction();
          throw error;
      } finally {
          await queryRunner.release();
      }
  }
  

      async getUserProfileByUsername(username: string) {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
          // Step 1: Find the user by username
          const user = await queryRunner.manager.findOne(Users, { where: { username } });
    
          if (!user) {
            throw new NotFoundException('User profile not found');
          }
    
          // Step 2: Find the profile by user_id
          const profile = await queryRunner.manager.findOne(UserProfile, { where: { user_id: user.id } });
    
          if (!profile) {
            throw new NotFoundException('User profile not found');
          }
    
          // Create a new response object
          const profileResponse = {
            ...profile,
            image: profile.image ? profile.image.toString('base64') : null
          };
    
          return profileResponse;
        } catch (error) {
          throw error;
        } finally {
          await queryRunner.release();
        }
      }



  async updateProfile(
    username: string,
    updateProfileDto: { 
      name?: string;
      preferred_role?: string;
      project?: string;
      education?: string;
      address?: string;
      phone_no?: string;
      linkedin_profile?: string;
      image?: Buffer;
    }
  ) {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { name, preferred_role, project, education, address, phone_no, linkedin_profile, image } = updateProfileDto;

      // Step 1: Find the user by username
      const user = await queryRunner.manager.findOne(Users, { where: { username } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Step 2: Find the profile by user_id
      const profile = await queryRunner.manager.findOne(UserProfile, { where: { user_id: user.id } });

      if (!profile) {
        throw new NotFoundException('Profile not found');
      }

      // Step 3: Update the profile with the provided details
      profile.name = name ?? profile.name;
      profile.preferred_role = preferred_role ?? profile.preferred_role;
      profile.project = project ?? profile.project;
      profile.education = education ?? profile.education;
      profile.address = address ?? profile.address;
      profile.phone_no = phone_no ?? profile.phone_no;
      profile.linkedin_profile = linkedin_profile ?? profile.linkedin_profile;
      profile.image = image ?? profile.image;

      await queryRunner.manager.save(profile);
      await queryRunner.commitTransaction();

      return {
        ok: true,
        error: false,
        message: 'Profile updated successfully',
        statusCode: 200,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }



  async deleteProfile(username: string) {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Step 1: Find the user by username
      const user = await queryRunner.manager.findOne(Users, { where: { username } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Step 2: Find the profile by user_id
      const profile = await queryRunner.manager.findOne(UserProfile, { where: { user_id: user.id } });

      if (!profile) {
        throw new NotFoundException('Profile not found');
      }

      // Step 3: Delete the profile
      await queryRunner.manager.remove(profile);
      await queryRunner.commitTransaction();

      return {
        ok: true,
        error: false,
        message: 'Profile deleted successfully',
        statusCode: 200,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }




  async deleteUser(username: string) {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Find the user by username
      const user = await queryRunner.manager.findOne(Users, { where: { username } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const userId = user.id;

      console.log("User_ID:",userId);

      // Delete profile logs associated with the user's profiles
      const deleteProfileLogsQuery = `DELETE FROM profile_log WHERE profile_id IN (SELECT id FROM user_profile WHERE user_id = $1 )`;
      // const deleteProfileLogsQuery = `select * FROM profile_log WHERE profile_id IN (SELECT id FROM user_profile WHERE user_id = $1 )`;

      await queryRunner.query(deleteProfileLogsQuery, [userId]);

      console.log("deleteProfileLogsQuery:",deleteProfileLogsQuery);

      // Delete user profiles associated with the user
      const deleteProfilesQuery = 'DELETE FROM user_profile WHERE user_id = $1';
      await queryRunner.query(deleteProfilesQuery, [userId]);

      // // // Delete the user
      const deleteUserQuery = 'DELETE FROM users WHERE id = $1';
      await queryRunner.query(deleteUserQuery, [userId]);

      await queryRunner.commitTransaction();

      return {
        ok: true,
        error: false,
        message: 'User and related data deleted successfully',
        statusCode: 200,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }



  async logout(username: string) {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
        const user = await queryRunner.manager.findOne(Users, { where: { username } });

        if (!user) {
            return {
                ok: false,
                error: true,
                message: 'User not found',
                statusCode: 404,
            };
        }

        // Assuming you have a session or token management mechanism
        // Invalidate the user's session or token here
        // For example, if using JWT, you might blacklist the token

        return {
            ok: true,
            error: false,
            message: 'Logout successful',
            statusCode: 200,
        };
    } catch (error: any) {
        return {
            ok: false,
            error: true,
            message: 'Something Went Wrong',
            statusCode: 500,
        };
    } finally {
        await queryRunner.release();
    }
}


    }
    


   
