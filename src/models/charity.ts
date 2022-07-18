import Client from '../database';

//charity (id, images, status, description, needy_id, volanteer_id);


export type charity = {
    id?: number;
    images:Array<string>;
    status:string,//pendding, complete
    description:string,
    intro:string,
    needy_id:number,
    type_id: number,
    value_of_need: number,
    remaining: number
  };


export class Charity {
    async index(): Promise<charity[]> {
        try {
            const conn = await Client.connect();
            const sql = 'select * from charity_case;';
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
            const sql = 'select * from charity_case where id =($1);';
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
            const sql = 'insert into charity_case (description,status,images,needy_id,remaining, value_of_need,type_id, intro) values($1,$2,$3,$4,$5,$6,$7,$8)RETURNING *;';
            const res = await conn.query(sql, [c.description, c.status, c.images,c.needy_id, c.remaining, c.value_of_need,c.type_id, c.intro]);
            conn.release();
            return res.rows[0];
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async update(c: charity): Promise<charity> {
        
        try {
            const conn = await Client.connect();
            const sql = 'update charity_case set description=($1),status=($2),images=($3),needy_id=($4),remaining=($6), value_of_need=($7),type_id=($8), intro=($9) where id=($5) RETURNING *;';
            const res = await conn.query(sql, [c.description, c.status, c.images,c.needy_id,c.id,c.remaining, c.value_of_need,c.type_id, c.intro]);
            conn.release();
            return res.rows[0];
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async delete(id: number, needy_id:number): Promise<string> {
        try {
            const conn = await Client.connect();
            const sql = 'delete from charity_case where id =($1) and needy_id=($2);';
            await conn.query(sql, [id, needy_id]);
            conn.release();
            return 'deleted';
        } catch (e) {
            throw new Error(`${e}`);
        }
    }
}
