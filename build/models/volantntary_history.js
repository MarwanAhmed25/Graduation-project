"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolantntaryHistory = void 0;
const database_1 = __importDefault(require("../database"));
class VolantntaryHistory {
    async index() {
        try {
            const conn = await database_1.default.connect();
            const sql = 'select * from volantary_history;';
            const res = await conn.query(sql);
            conn.release();
            return res.rows;
        }
        catch (e) {
            throw new Error(`${e}`);
        }
    }
    async show(volanteer_id) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'select * from volantary_history where volanteer_id =($1);';
            const res = await conn.query(sql, [volanteer_id]);
            conn.release();
            return res.rows;
        }
        catch (e) {
            throw new Error(`${e}`);
        }
    }
    async show_one(volanteer_id, charity_case_id) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'select * from volantary_history where volanteer_id =($1) and charity_case_id=($2);';
            const res = await conn.query(sql, [volanteer_id, charity_case_id]);
            conn.release();
            return res.rows[0];
        }
        catch (e) {
            throw new Error(`${e}`);
        }
    }
    async create(t) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'insert into volantary_history (charity_case_id, amount, volanteer_id) values($1, $2, $3)RETURNING *;';
            const res = await conn.query(sql, [t.charity_case_id, t.amount, t.volanteer_id]);
            conn.release();
            return res.rows[0];
        }
        catch (e) {
            throw new Error(`${e}`);
        }
    }
    /*     async update(amount:number, volanteer_id:number, charity_case_id:number): Promise<volantntary_history> {
            
            try {
    
                const t = await this.show_one(volanteer_id, charity_case_id);
                if(t){
                    t.amount = t.total_he amount;
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
            'update volantntary_history set number_of_help=($2), total_help=($3) where id=($5) RETURNING *; ';
                const res = await conn.query(sql, [t.number_of_help, t.total_help, t.id]);
                conn.release();
                return res.rows[0];
            } catch (e) {
                throw new Error(`${e}`);
            }
        } */
    async delete(id) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'delete from volantary_history where id =($1);';
            await conn.query(sql, [id]);
            conn.release();
            return 'deleted';
        }
        catch (e) {
            throw new Error(`${e}`);
        }
    }
}
exports.VolantntaryHistory = VolantntaryHistory;
