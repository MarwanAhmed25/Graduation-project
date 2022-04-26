import { Pool } from 'pg';
import config_ from './config/config';


//const { db_host, db_user, db_password, db_name } = process.env;
//const { test_db_host, test_db_user, test_db_password, test_db_name } = process.env;

//const environment = process.env.environment ||'production'; 


//let Client:Pool ;
//test db connection
/* if(environment === 'development'){
    console.log(environment);
    
    Client= new Pool({
        host: test_db_host,
        database: test_db_name,
        user: test_db_user,
        password: test_db_password,
        port:5432
    });

}else{//the main db connection
    console.log(environment);

    Client= new Pool({
        host: db_host,
        database: db_name,
        user: db_user,
        password: db_password,
        port:5432,
        ssl:true
    });

} */


const Client = new Pool({
    connectionString: config_.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

export default Client;