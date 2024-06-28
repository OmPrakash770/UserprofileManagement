// import 'dotenv/config'
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { DataSource } from 'typeorm';
// import { connectDatabase } from './utils/typeorm/connect.typeorm';
// import { NestExpressApplication } from '@nestjs/platform-express';
// import { entities } from './seeds/entities/seed.entity';
// import { ValidationPipe } from '@nestjs/common';


// export let dataSource: DataSource;
// async function bootstrap() {
//   let app:NestExpressApplication;
  
  
//   try
//   {
//     dataSource = await connectDatabase(entities);
//     if(!dataSource){
//       console.log('Database connection failed');
//       process.exit(1);
//     }

//     app = await NestFactory.create(AppModule);

//     app.useGlobalPipes(new ValidationPipe());

//     // await app.listen(3000);
//     await app.listen(3000, '0.0.0.0');
//   }catch(error:any){
//     if(app) app.close();
//       process.exit(1);
    
//   }
// }
// bootstrap();


import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { connectDatabase } from './utils/typeorm/connect.typeorm';
import { NestExpressApplication } from '@nestjs/platform-express';
import { entities } from './seeds/entities/seed.entity';
import { ValidationPipe } from '@nestjs/common';

export let dataSource: DataSource;

async function bootstrap() {
  let app: NestExpressApplication;

  const port = 3000;

  try {
    dataSource = await connectDatabase(entities);
    if (!dataSource) {
      console.log('Database connection failed');
      process.exit(1);
    }

    app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe());

    // Enable CORS with default settings
    app.enableCors({
      credentials: true,
      origin: ['http://localhost:3001', 'http://localhost:80'] // Whitelist the domains you want to allow
    });

    // Enable CORS with specific settings (uncomment and customize as needed)
    /*
    app.enableCors({
      origin: 'http://example.com', // Replace with your frontend URL
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });
    */
    

    await app.listen(port, '0.0.0.0', () => {
      console.log(`Server running at http://0.0.0.0:${port}/`);
     });
  
  } catch (error: any) {
    if (app) app.close();
    process.exit(1);
  }
}

bootstrap();
