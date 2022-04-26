import Client from '../database';

//types (id, type , description);


export type type = {
    id?: number;
    type: string;
    description?: string;
  };

export class Type {
    async index(): Promise<type[]> {
        try {
            const conn = await Client.connect();
            const sql = 'select * from types;';
            const res = await conn.query(sql);
            conn.release();
            return res.rows;
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async show(id: number): Promise<type> {
        try {
            const conn = await Client.connect();
            const sql = 'select * from types where id =($1);';
            const res = await conn.query(sql, [id]);
            conn.release();
            return res.rows[0];
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async create(t: type): Promise<type> {
        try {
            const conn = await Client.connect();
            const sql =
        'insert into types (type, description) values($1, $2)RETURNING *;';
            const res = await conn.query(sql, [t.type, t.description]);
            conn.release();
            return res.rows[0];
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async update(t: type): Promise<type> {
        try {
            const conn = await Client.connect();
            const sql =
        'update brand set type=($1), description=($2) where id=($3) RETURNING *; ';
            const res = await conn.query(sql, [t.type, t.description, t.id]);
            conn.release();
            return res.rows[0];
        } catch (e) {
            throw new Error(`${e}`);
        }
    }
    
    async delete(id: number): Promise<string> {
        try {
            const conn = await Client.connect();
            const sql = 'delete from brand where id =($1);';
            await conn.query(sql, [id]);
            conn.release();
            return 'deleted';
        } catch (e) {
            throw new Error(`${e}`);
        }
    }
}
