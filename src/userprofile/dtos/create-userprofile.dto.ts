import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateUserProfileDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  preferred_role?: string;

  @IsString()
  @IsOptional()
  project?: string;

  @IsString()
  @IsOptional()
  education?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsNotEmpty()
  phone_no: string;

  @IsString()
  @IsOptional()
  linkedin_profile?: string;
}

