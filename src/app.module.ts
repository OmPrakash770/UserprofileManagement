import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { UserprofileModule } from './userprofile/userprofile.module';

@Module({
  imports: [UserModule,ProductModule,UserprofileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
