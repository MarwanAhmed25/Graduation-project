import Client from '../database';

//links(id, link, user_id);


export type links = {
    id?: number;
    link: string;
    user_id: number;
  };

export class Links {
    async index(): Promise<links[]> {
        try {
            const conn = await Client.connect();
            const sql = 'select * from links;';
            const res = await conn.query(sql);
            conn.release();
            return res.rows;
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async show(user_id: number): Promise<links> {
        try {
            const conn = await Client.connect();
            const sql = 'select * from links where user_id =($1);';
            const res = await conn.query(sql, [user_id]);
            conn.release();
            return res.rows[0];
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async create(l: links): Promise<links> {
        try {
            const conn = await Client.connect();
            const sql =
        'insert into links (link, user_id) values($1, $2)RETURNING *;';
            const res = await conn.query(sql, [l.link, l.user_id]);
            conn.release();
            return res.rows[0];
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async update(l: links): Promise<links> {
        try {
            const conn = await Client.connect();
            const sql =
        'update links set link=($1) where id=($3) and user_id=($2) RETURNING *; ';
            const res = await conn.query(sql, [l.link, l.user_id, l.id]);
            conn.release();
            return res.rows[0];
        } catch (e) {
            throw new Error(`${e}`);
        }
    }
    
    async delete(id: number): Promise<string> {
        try {
            
            const conn = await Client.connect();
            const sql = 'delete from links where id =($1);';
            await conn.query(sql, [id]);
            conn.release();
            return 'deleted';
        } catch (e) {
            throw new Error(`${e}`);
        }
    }
}
