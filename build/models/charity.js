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
            const sql = 'select * from charity;';
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
            const sql = 'select * from charity where id =($1);';
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
            const sql = 'insert into charity (description,status,images,needy_id,volanteer_id) values($1,$2,$3,$4,$5)RETURNING *;';
            const res = await conn.query(sql, [c.description, c.status, c.images, c.needy_id, c.volanteer_id]);
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
            const sql = 'update charity set description=($1),status=($2),images=($3),needy_id=($4),volanteer_id=($5) where id=($6) RETURNING *;';
            const res = await conn.query(sql, [c.description, c.status, c.images, c.needy_id, c.volanteer_id, c.id]);
            conn.release();
            return res.rows[0];
        }
        catch (e) {
            throw new Error(`${e}`);
        }
    }
    async delete(id) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'delete from charity where id =($1);';
            await conn.query(sql, [id]);
            conn.release();
            return 'deleted';
        }
        catch (e) {
            throw new Error(`${e}`);
        }
    }
}
exports.Charity = Charity;
