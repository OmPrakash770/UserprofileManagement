
import { DataSource } from "typeorm";
// import 'dotenv/config';


export async function connectDatabase(entityArray: any) : Promise<any>{

    // const password = process.env.DB_PW ? process.env.DB_PW : undefined;
    // const password = process.env.DB_PW ? process.env.DB_PW : ''; // provide an empty string as default password
 
    try{
    const dataSource = new DataSource({

        
        type:'postgres',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PW ,
        // password: process.env.DB_PW || undefined, 
        // password: process.env.DB_PW || 'default_password', 
        // password: password,
        database: process.env.DB_NAME,
        synchronize: true,
        logging: true,
        entities:entityArray,
        dropSchema:false
        
    });

    await dataSource.initialize();
    
    // console.log("host:",process.env.DB_HOST);
    // console.log("host:",process.env.DB_PORT);
    // console.log("host:",process.env.DB_USER);
    // console.log("host:",process.env.DB_PW);
    // console.log("host:",process.env.DB_NAME);
    // console.log("host:",process.env.DB_HOST);
    // console.log("datasource:",dataSource);

    return dataSource;
}catch(error:any){

    console.log(error);
    return false
}


}