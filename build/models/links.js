"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Links = void 0;
const database_1 = __importDefault(require("../database"));
class Links {
    async index() {
        try {
            const conn = await database_1.default.connect();
            const sql = 'select * from links;';
            const res = await conn.query(sql);
            conn.release();
            return res.rows;
        }
        catch (e) {
            throw new Error(`${e}`);
        }
    }
    async show(user_id) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'select * from links where user_id =($1);';
            const res = await conn.query(sql, [user_id]);
            conn.release();
            return res.rows[0];
        }
        catch (e) {
            throw new Error(`${e}`);
        }
    }
    async create(link, user_id) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'insert into links (link, user_id) values($1, $2)RETURNING *;';
            const res = await conn.query(sql, [link, user_id]);
            conn.release();
            return res.rows[0];
        }
        catch (e) {
            throw new Error(`${e}`);
        }
    }
    async update(link, user_id) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'update links set link=($1) where user_id=($2) RETURNING *; ';
            const res = await conn.query(sql, [link, user_id]);
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
            const sql = 'delete from links where id =($1);';
            await conn.query(sql, [id]);
            conn.release();
            return 'deleted';
        }
        catch (e) {
            throw new Error(`${e}`);
        }
    }
}
exports.Links = Links;
