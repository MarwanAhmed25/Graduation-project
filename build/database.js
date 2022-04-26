"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const config_1 = __importDefault(require("./config/config"));
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
const Client = new pg_1.Pool({
    connectionString: config_1.default.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
exports.default = Client;
