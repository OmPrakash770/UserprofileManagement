
import { DataSource } from "typeorm";
import 'dotenv/config';


export async function connectDatabase(entityArray: any) : Promise<any>{
 
    try{
    const dataSource = new DataSource({
        type:'postgres',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PW,
        database: process.env.DB_NAME,
        synchronize: true,
        logging: true,
        entities:entityArray,
        dropSchema:false
    });

    await dataSource.initialize();

    return dataSource;
}catch(error:any){

    console.log(error);
    return false
}


}