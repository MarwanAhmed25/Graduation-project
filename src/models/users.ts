import Client from '../database';
import bcrypt from 'bcrypt';
import { type } from './types';
import config_ from '../config/config';
//users(id,f_name,l_name,email,rate,description,images,role,password,birthday,phone,status,created_at,city,admin_id,address,type_id );


export type user = {
  id?: number;
  f_name?: string;
  l_name?: string;
  email:string;
  description:string,
  images: Array<string>,
  role:string,
  rate:number,
  password: string;
  birthday?:Date;
  phone?:string;
  status:string;
  created_at?:Date;
  city?:string;
  address?:string;
  admin_id?:number;
  type_id?:type['id'];
};

export class User {
    async index(): Promise<user[]> {
        try {
            const conn = await Client.connect();
            const sql = 'select * from users;';
            const res = await conn.query(sql);
            conn.release();
            return res.rows;
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async show(id: number): Promise<user> {
        try {
            const conn = await Client.connect();
            const sql = 'select * from users where id =($1);';
            const res = await conn.query(sql, [id]);
            conn.release();
            return res.rows[0];
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async create(u: user): Promise<user> {
        try {

            //hashin password using round and extra from .env file and password from request.body
            const hash = bcrypt.hashSync(u.password + config_.extra, parseInt(config_.round as string));
            const conn = await Client.connect();
            const sql =
        'insert into users (f_name, l_name, email, password, birthday, phone, status,created_at, city,address,type_id,admin_id,rate,role,images,description) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)RETURNING*;';
            const res = await conn.query(sql, [u.f_name, u.l_name, u.email, hash, u.birthday, u.phone, u.status, new Date(), u.city,u.address,u.type_id,u.admin_id,u.rate,u.role,u.images,u.description]);
            conn.release();
            return res.rows[0];
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async update(u: user): Promise<user> {
        try {

            //hashin password using round and extra from .env file and password from request.body
            const hash = bcrypt.hashSync(u.password + config_.extra, parseInt(config_.round as string));
            const conn = await Client.connect();
            const sql =
        'update users set f_name=($1), l_name=($2),email=($3),birthday=($4),phone=($5),city=($6),address=($7), status=($9),rate=($10),password=($11),type_id=($12),admin_id=($13),role=($14),images=($15),description=($16) where id=($8)RETURNING*; ';
            const res = await conn.query(sql, [u.f_name, u.l_name, u.email, u.birthday, u.phone, u.city,u.address, u.id,u.status,u.rate,hash,u.type_id,u.admin_id,u.role,u.images,u.description]);
            conn.release();
            return res.rows[0];
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async delete(id: number): Promise<string> {
        try {
            const conn = await Client.connect();
            const sql = 'delete from users where id =($1) ;';
            await conn.query(sql, [id]);
            conn.release();
            
            return 'deleted';
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async auth(email: string,password:string): Promise<user|undefined> {
        try {
            const conn = await Client.connect();
            const sql = 'select * from users where email=($1);';
            const res = await conn.query(sql, [email]);
            
            if (res.rows.length > 0) {
                const i = await bcrypt.compare(password + config_.extra, res.rows[0].password);

                if(i)
                {                        
                    return res.rows[0];
                }else throw new Error('email or password wrong.');
                

            }else throw new Error('email or password wrong.');
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async forget_password(email: string): Promise<user|null> {
        try {
            const conn = await Client.connect();
            const sql = 'select * from users where email=($1);';
            const res = await conn.query(sql, [email]);
            if (res.rows.length) {
                return res.rows[0];
            }
            return null;
        } catch (e) {
            throw new Error(`${e}`);
        }
    }
}
