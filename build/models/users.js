"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const database_1 = __importDefault(require("../database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../config/config"));
class User {
    async index() {
        try {
            const conn = await database_1.default.connect();
            const sql = 'select * from users;';
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
            const sql = 'select * from users where id =($1);';
            const res = await conn.query(sql, [id]);
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
            const sql = 'insert into users (full_name, email, password, birthday, phone, status,created_at, city,address, id_image,role,profile_image) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)RETURNING*;';
            const res = await conn.query(sql, [u.full_name, u.email, hash, u.birthday, u.phone, u.status, new Date(), u.city, u.address, u.id_image, u.role, u.profile_image]);
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
            const sql = 'update users set full_name=($1), email=($2),birthday=($3),phone=($4),city=($5),address=($6), status=($8),password=($9),role=($10),id_image=($11),profile_image=($12) where id=($7)RETURNING*; ';
            const res = await conn.query(sql, [u.full_name, u.email, u.birthday, u.phone, u.city, u.address, u.id, u.status, hash, u.role, u.id_image, u.profile_image]);
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
            const sql = 'delete from users where id =($1) ;';
            await conn.query(sql, [id]);
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
            const sql = 'select * from users where email=($1);';
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
            const sql = 'select * from users where email=($1);';
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
exports.User = User;
