import Client from '../database';
import bcrypt from 'bcrypt';
import config from '../config/config';

// admins(id , f_name,l_name , email, password ,birthday, phone ,status varchar(50), created_at );

export type admin = {
  admin_id?: number;
  full_name?: string;
  email:string;
  password: string;
  birthday?:Date;
  phone?:string;
  status:string;//suspended, active, deactive
  created_at?:Date;
  address?:string;
  salary:number
};

export class Admin {
    async index(): Promise<admin[]> {
        try {
            const conn = await Client.connect();
            const sql = 'select * from admins;';
            const res = await conn.query(sql);
            conn.release();
            return res.rows;
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async show(admin_id: number): Promise<admin> {
        try {
            const conn = await Client.connect();
            const sql = 'select * from admins where admin_id =($1);';
            const res = await conn.query(sql, [admin_id]);
            conn.release();
            return res.rows[0];
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async create(u: admin): Promise<admin> {
        try {

            //hashin password using round and extra from .env file and password from request.body
            const hash = bcrypt.hashSync(u.password + config.extra, parseInt(config.round as string));
            const conn = await Client.connect();
            const sql =
        'insert into admins (full_name, email, password, birthday, phone, status,created_at, salary,address) values($1,$2,$3,$4,$5,$6,$7,$8,$9)RETURNING*;';
            const res = await conn.query(sql, [u.full_name, u.email, hash, u.birthday, u.phone, u.status, new Date(), u.salary,u.address]);
            conn.release();
            return res.rows[0];
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async update(u: admin): Promise<admin> {
        try {

            //hashin password using round and extra from .env file and password from request.body
            const hash = bcrypt.hashSync(u.password + config.extra, parseInt(config.round as string));
            const conn = await Client.connect();
            const sql =
        'update admins set full_name=($1), email=($2),birthday=($3),phone=($4),salary=($5),address=($6),status=($8), password=($9) where admin_id=($7)RETURNING*; ';
            const res = await conn.query(sql, [u.full_name, u.email, u.birthday, u.phone, u.salary,u.address, u.admin_id,u.status, hash]);
            conn.release();
            return res.rows[0];
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async delete(admin_id: number): Promise<string> {
        try {
            const conn = await Client.connect();
            const sql = 'delete from admins where admin_id =($1) ;';
            await conn.query(sql, [admin_id]);
            conn.release();
            
            return 'deleted';
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async auth(email: string,password:string): Promise<admin|undefined> {
        try {
            const conn = await Client.connect();
            const sql = 'select * from admins where email=($1);';
            const res = await conn.query(sql, [email]);
            
            if (res.rows.length > 0) {
                const i = await bcrypt.compare(password + config.extra, res.rows[0].password);
                console.log(i);
                
                if(i)
                {                        
                    return res.rows[0];
                }else throw new Error('email or password wrong.');
                

            }else throw new Error('email or password wrong.');
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async forget_password(email: string): Promise<admin|null> {
        try {
            const conn = await Client.connect();
            const sql = 'select * from admins where email=($1);';
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
