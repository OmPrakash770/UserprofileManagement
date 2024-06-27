import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateProfileLogDto {
    profile_id: number;
    action: string;
    timestamp?: Date;
  }
  