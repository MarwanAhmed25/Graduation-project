"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Type = void 0;
const database_1 = __importDefault(require("../database"));
class Type {
    async index() {
        try {
            const conn = await database_1.default.connect();
            const sql = 'select * from types;';
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
            const sql = 'select * from types where id =($1);';
            const res = await conn.query(sql, [id]);
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
            const sql = 'insert into types (type, description, image) values($1, $2, $3)RETURNING *;';
            const res = await conn.query(sql, [t.type, t.description, t.image]);
            conn.release();
            return res.rows[0];
        }
        catch (e) {
            throw new Error(`${e}`);
        }
    }
    async update(t) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'update brand set type=($1), description=($2), image=($4) where id=($3) RETURNING *; ';
            const res = await conn.query(sql, [t.type, t.description, t.id, t.image]);
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
            const sql = 'delete from brand where id =($1);';
            await conn.query(sql, [id]);
            conn.release();
            return 'deleted';
        }
        catch (e) {
            throw new Error(`${e}`);
        }
    }
}
exports.Type = Type;
