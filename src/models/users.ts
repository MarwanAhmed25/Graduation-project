import Client from '../database';
import bcrypt from 'bcrypt';
import config_ from '../config/config';
//users(id,f_name,l_name,email,rate,description,images,role,password,birthday,phone,status,created_at,city,admin_id,address,type_id );


export type user = {
  id?: number;
  full_name?: string;
  email:string;
  profile_image: string,
  role:string,// needy, volanteer
  password: string;
  birthday?:Date;
  phone?:string;
  status:string; // active, suspended, deactivated
  created_at?:Date;
  city?:string;
  address?:string;
  id_image: string //verified image for users
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
        'insert into users (full_name, email, password, birthday, phone, status,created_at, city,address, id_image,role,profile_image) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)RETURNING*;';
            const res = await conn.query(sql, [u.full_name, u.email, hash, u.birthday, u.phone, u.status, new Date(), u.city,u.address,u.id_image,u.role,u.profile_image]);
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
        'update users set full_name=($1), email=($2),birthday=($3),phone=($4),city=($5),address=($6), status=($8),password=($9),role=($10),id_image=($11),profile_image=($12) where id=($7)RETURNING*; ';
            const res = await conn.query(sql, [u.full_name, u.email, u.birthday, u.phone, u.city,u.address, u.id,u.status,hash,u.role,u.id_image,u.profile_image]);
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
                    return res.rows[0];
                    
            }
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
