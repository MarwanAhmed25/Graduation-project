"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const database_1 = __importDefault(require("../database"));
class Comment {
    async index(charity_id) {
        console.log();
        try {
            const conn = await database_1.default.connect();
            const sql = 'select * from comment where charity_id=($1);';
            const res = await conn.query(sql, [charity_id]);
            console.log(res.rows);
            conn.release();
            return res.rows;
        }
        catch (e) {
            throw new Error(`${e}`);
        }
    }
    async show(charity_id, id) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'select * from comment where id =($1) and charity_id=($2);';
            const res = await conn.query(sql, [id, charity_id]);
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
            const sql = 'insert into comment (message,created_time,user_id,charity_id, intro) values($1,$2,$3,$4,$5)RETURNING *;';
            const res = await conn.query(sql, [c.message, new Date(), c.user_id, c.charity_id, c.intro]);
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
            const sql = 'update comment set message=($1),charity_id=($3), intro=($5) where id=($4) and user_id=($2) RETURNING *; ';
            const res = await conn.query(sql, [c.message, c.user_id, c.charity_id, c.id, c.intro]);
            conn.release();
            return res.rows[0];
        }
        catch (e) {
            throw new Error(`${e}`);
        }
    }
    async delete(user_id, id) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'delete from comment where id =($1) and user_id=($2);';
            await conn.query(sql, [id, user_id]);
            conn.release();
            return 'deleted';
        }
        catch (e) {
            throw new Error(`${e}`);
        }
    }
}
exports.Comment = Comment;
