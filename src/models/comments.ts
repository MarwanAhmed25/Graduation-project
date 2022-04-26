import Client from '../database';

//comment(id, message, created_time, user_id, charity_id);


export type comment = {
    id?: number;
    message:string;
    created_time?:Date;
    user_id?:number;
    charity_id?:number;
  };


export class Comment {
    async index(user_id:number): Promise<comment[]> {
        
        try {
            const conn = await Client.connect();
            const sql = 'select * from comment where user_id=($1);';
            const res = await conn.query(sql,[user_id]);
            console.log(res.rows);
            
            conn.release();
            return res.rows;
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async show(user_id: number, id:number): Promise<comment> {
        try {
            const conn = await Client.connect();
            const sql = 'select * from comment where id =($1) and product_id=($2);';
            const res = await conn.query(sql, [id,user_id]);
            conn.release();
            return res.rows[0];
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async create(c: comment): Promise<comment> {
        try {            
            const conn = await Client.connect();
            const sql = 'insert into comment (message,created_time,user_id,charity_id) values($1,$2,$3,$4)RETURNING *;';
            const res = await conn.query(sql, [c.message,new Date(),c.user_id,c.charity_id]);
            conn.release();
            return res.rows[0];
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async update(c: comment): Promise<comment> {
        try {
            const conn = await Client.connect();
            const sql = 'update comment set message=($1),charity_id=($3) where id=($4) and user_id=($2) RETURNING *; ';
            const res = await conn.query(sql, [c.message,c.user_id,c.charity_id, c.id]);
            conn.release();
            return res.rows[0];
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async delete(user_id:number,id: number): Promise<string> {
        try {
            const conn = await Client.connect();
            
            const sql = 'delete from comment where id =($1) and user_id=($2);';
            await conn.query(sql, [id,user_id]);
            conn.release();
                        
            return 'deleted';
        } catch (e) {
            throw new Error(`${e}`);
        }
    }
}
