"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const database_1 = __importDefault(require("../database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../config/config"));
class Admin {
    async index() {
        try {
            const conn = await database_1.default.connect();
            const sql = 'select * from admins;';
            const res = await conn.query(sql);
            conn.release();
            return res.rows;
        }
        catch (e) {
            throw new Error(`${e}`);
        }
    }
    async show(admin_id) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'select * from admins where admin_id =($1);';
            const res = await conn.query(sql, [admin_id]);
            conn.release();
            return res.rows[0];
        }
        catch (e) {
            throw new Error(`${e}`);
        }
    }
    async create(u) {
        try {
            //hashin password using round and extra from .env file and password from request.body
            const hash = bcrypt_1.default.hashSync(u.password + config_1.default.extra, parseInt(config_1.default.round));
            const conn = await database_1.default.connect();
            const sql = 'insert into admins (full_name, email, password, birthday, phone, status,created_at, salary,address) values($1,$2,$3,$4,$5,$6,$7,$8,$9)RETURNING*;';
            const res = await conn.query(sql, [u.full_name, u.email, hash, u.birthday, u.phone, u.status, new Date(), u.salary, u.address]);
            conn.release();
            return res.rows[0];
        }
        catch (e) {
            throw new Error(`${e}`);
        }
    }
    async update(u) {
        try {
            //hashin password using round and extra from .env file and password from request.body
            const hash = bcrypt_1.default.hashSync(u.password + config_1.default.extra, parseInt(config_1.default.round));
            const conn = await database_1.default.connect();
            const sql = 'update admins set full_name=($1), email=($2),birthday=($3),phone=($4),salary=($5),address=($6),status=($8), password=($9) where admin_id=($7)RETURNING*; ';
            const res = await conn.query(sql, [u.full_name, u.email, u.birthday, u.phone, u.salary, u.address, u.admin_id, u.status, hash]);
            conn.release();
            return res.rows[0];
        }
        catch (e) {
            throw new Error(`${e}`);
        }
    }
    async delete(admin_id) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'delete from admins where admin_id =($1) ;';
            await conn.query(sql, [admin_id]);
            conn.release();
            return 'deleted';
        }
        catch (e) {
            throw new Error(`${e}`);
        }
    }
    async auth(email, password) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'select * from admins where email=($1);';
            const res = await conn.query(sql, [email]);
            if (res.rows.length > 0) {
                const i = await bcrypt_1.default.compare(password + config_1.default.extra, res.rows[0].password);
                if (i)
                    return res.rows[0];
            }
            else
                throw new Error('email or password wrong.');
        }
        catch (e) {
            throw new Error(`${e}`);
        }
    }
    async forget_password(email) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'select * from admins where email=($1);';
            const res = await conn.query(sql, [email]);
            if (res.rows.length) {
                return res.rows[0];
            }
            return null;
        }
        catch (e) {
            throw new Error(`${e}`);
        }
    }
}
exports.Admin = Admin;
