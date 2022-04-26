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
            const sql = 'insert into users (f_name, l_name, email, password, birthday, phone, status,created_at, city,address,type_id,admin_id,rate,role,images,description) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)RETURNING*;';
            const res = await conn.query(sql, [u.f_name, u.l_name, u.email, hash, u.birthday, u.phone, u.status, new Date(), u.city, u.address, u.type_id, u.admin_id, u.rate, u.role, u.images, u.description]);
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
            const sql = 'update users set f_name=($1), l_name=($2),email=($3),birthday=($4),phone=($5),city=($6),address=($7), status=($9),rate=($10),password=($11),type_id=($12),admin_id=($13),role=($14),images=($15),description=($16) where id=($8)RETURNING*; ';
            const res = await conn.query(sql, [u.f_name, u.l_name, u.email, u.birthday, u.phone, u.city, u.address, u.id, u.status, u.rate, hash, u.type_id, u.admin_id, u.role, u.images, u.description]);
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
                if (i) {
                    return res.rows[0];
                }
                else
                    throw new Error('email or password wrong.');
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
