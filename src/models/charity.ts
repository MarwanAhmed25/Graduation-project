import Client from '../database';

//charity (id, images, status, description, needy_id, volanteer_id);


export type charity = {
    id?: number;
    images:Array<string>;
    status:string,
    description:string,
    needy_id:number,
    volanteer_id:number
  };


export class Charity {
    async index(): Promise<charity[]> {
        try {
            const conn = await Client.connect();
            const sql = 'select * from charity;';
            const res = await conn.query(sql);
            conn.release();
            return res.rows;
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async show(id: number): Promise<charity> {
        try {
            const conn = await Client.connect();
            const sql = 'select * from charity where id =($1);';
            const res = await conn.query(sql, [id]);
            conn.release();
            return res.rows[0];
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async create(c: charity): Promise<charity> {
        try {
            const conn = await Client.connect();
            const sql = 'insert into charity (description,status,images,needy_id,volanteer_id) values($1,$2,$3,$4,$5)RETURNING *;';
            const res = await conn.query(sql, [c.description, c.status, c.images,c.needy_id,c.volanteer_id]);
            conn.release();
            return res.rows[0];
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async update(c: charity): Promise<charity> {
        try {
            const conn = await Client.connect();
            const sql = 'update charity set description=($1),status=($2),images=($3),needy_id=($4),volanteer_id=($5) where id=($6) RETURNING *;';
            const res = await conn.query(sql, [c.description, c.status, c.images,c.needy_id,c.volanteer_id,c.id]);
            conn.release();
            return res.rows[0];
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async delete(id: number): Promise<string> {
        try {
            const conn = await Client.connect();
            const sql = 'delete from charity where id =($1);';
            await conn.query(sql, [id]);
            conn.release();
            return 'deleted';
        } catch (e) {
            throw new Error(`${e}`);
        }
    }
}
