"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Charity = void 0;
const database_1 = __importDefault(require("../database"));
class Charity {
    async index() {
        try {
            const conn = await database_1.default.connect();
            const sql = 'select * from charity_case;';
            const res = await conn.query(sql);
            conn.release();
            return res.rows;
        }
        catch (e) {
            throw new Error(`${e}`);
        }
    }
    async show(id) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'select * from charity_case where id =($1);';
            const res = await conn.query(sql, [id]);
            conn.release();
            return res.rows[0];
        }
        catch (e) {
            throw new Error(`${e}`);
        }
    }
    async create(c) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'insert into charity_case (description,status,images,needy_id,remaining, value_of_need,type_id, intro) values($1,$2,$3,$4,$5,$6,$7,$8)RETURNING *;';
            const res = await conn.query(sql, [c.description, c.status, c.images, c.needy_id, c.remaining, c.value_of_need, c.type_id, c.intro]);
            conn.release();
            return res.rows[0];
        }
        catch (e) {
            throw new Error(`${e}`);
        }
    }
    async update(c) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'update charity_case set description=($1),status=($2),images=($3),needy_id=($4),remaining=($6), value_of_need=($7),type_id=($8), intro=($9) where id=($5) RETURNING *;';
            const res = await conn.query(sql, [c.description, c.status, c.images, c.needy_id, c.id, c.remaining, c.value_of_need, c.type_id, c.intro]);
            conn.release();
            return res.rows[0];
        }
        catch (e) {
            throw new Error(`${e}`);
        }
    }
    async delete(id, needy_id) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'delete from charity_case where id =($1) and needy_id=($2);';
            await conn.query(sql, [id, needy_id]);
            conn.release();
            return 'deleted';
        }
        catch (e) {
            throw new Error(`${e}`);
        }
    }
}
exports.Charity = Charity;
