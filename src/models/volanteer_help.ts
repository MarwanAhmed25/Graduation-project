import Client from '../database';

// volanteer_rate (id , number_of_help , total_help , volanteer_id , charity_case_id )



export type volant = {
    id?: number;
    number_of_help: number;
    volanteer_id: number;
    total_help:number;
    charity_case_id:number;
  };

export class Rate {
    async index(): Promise<volant[]> {
        try {
            const conn = await Client.connect();
            const sql = 'select * from volanteer_rate;';
            const res = await conn.query(sql);
            conn.release();
            return res.rows;
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async show(volanteer_id: number): Promise<volant> {
        try {
            const conn = await Client.connect();
            const sql = 'select * from volanteer_rate where volanteer_id =($1);';
            const res = await conn.query(sql, [volanteer_id]);
            conn.release();
            return res.rows[0];
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async create(t: volant): Promise<volant> {
        try {
            const conn = await Client.connect();
            const sql =
        'insert into volanteer_rate (charity_case_id, number_of_help, total_help, volanteer_id) values($1, $2, $3,$4)RETURNING *;';
            const res = await conn.query(sql, [t.charity_case_id, t.number_of_help, t.total_help, t.volanteer_id]);
            conn.release();
            return res.rows[0];
        } catch (e) {
            throw new Error(`${e}`);
        }
    }

    async update(amount:number, volanteer_id:number, charity_case_id:number): Promise<volant> {
        
        try {

            const t = await this.show(volanteer_id);
            if(t){
                t.number_of_help = t.number_of_help + 1;
                t.total_help = t.total_help + amount;
            }else{
                const t_create:volant ={
                    number_of_help: 1,
                    volanteer_id: volanteer_id,
                    total_help: amount,
                    charity_case_id: charity_case_id
                }; 
                return this.create(t_create);
            }

            const conn = await Client.connect();
            const sql =
        'update volanteer_rate set number_of_help=($2), total_help=($3) where id=($5) RETURNING *; ';
            const res = await conn.query(sql, [t.number_of_help, t.total_help, t.id]);
            conn.release();
            return res.rows[0];
        } catch (e) {
            throw new Error(`${e}`);
        }
    }
    
    async delete(id: number): Promise<string> {
        try {
            const conn = await Client.connect();
            const sql = 'delete from volanteer_rate where id =($1);';
            await conn.query(sql, [id]);
            conn.release();
            return 'deleted';
        } catch (e) {
            throw new Error(`${e}`);
        }
    }
}
