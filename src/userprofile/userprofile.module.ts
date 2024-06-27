import { Module } from "@nestjs/common";
import { UserprofileService } from "./userprofile.service";
import { UserprofileController } from "./userprofile.controller";

@Module({
    providers: [UserprofileService],
    controllers: [UserprofileController]
})
export class UserprofileModule {}