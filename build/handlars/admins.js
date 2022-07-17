"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admins_1 = require("../models/admins");
const users_1 = require("../models/users");
const config_1 = __importDefault(require("../config/config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = config_1.default.token;
const admin_password_exist = config_1.default.admin_password;
const admin_email_exist = config_1.default.admin_email;
const admin_obj = new admins_1.Admin();
const user_obj = new users_1.User();
//return a json data for all users in database [allowed only for admins]
async function index(req, res) {
    const admin_email = req.headers.email;
    const admin_password = req.headers.password;
    //check if request from super admin 
    if (admin_email_exist === admin_email && admin_password_exist === admin_password) {
        try {
            const resault = await admin_obj.index();
            res.status(200).json({ admins: resault });
        }
        catch (e) {
            res.status(400).json(`${e}`);
        }
    }
    else
        res.status(400).json('not allowed for you.');
}
//return json data for a sungle user [allowed only for admins or user it self]
async function show(req, res) {
    const admin_email = req.headers.email;
    const admin_password = req.headers.password;
    //check if request from super admin 
    if (admin_email_exist === admin_email && admin_password_exist === admin_password) {
        try {
            const resault = await admin_obj.show(parseInt(req.params.id));
            if (resault == undefined)
                return res.status(400).json('row not exist');
            return res.status(200).json({ admin: resault, role: 'admin' });
        }
        catch (e) {
            return res.status(400).json(`${e}`);
        }
    }
    else
        res.status(400).json('not allowed for you.');
}
/*
return token for updated user [user can update all his data except (coupon_id, status),
    super admin can update only(coupon_id,status),
    admins can update (coupon_id, status when not == admin)]
    */
async function update(req, res) {
    const admin_email = req.headers.email;
    const admin_password = req.headers.password;
    const id = parseInt(req.params.id);
    try {
        const user_ = await admin_obj.show(id); //get user from database with id in request params
        if (user_ == undefined)
            return res.status(400).json('row not exist');
        //check if request from super admin 
        if (admin_email_exist == admin_email && admin_password_exist == admin_password) {
            if (req.body.full_name)
                user_.full_name = req.body.full_name;
            if (req.body.email) {
                user_.email = req.body.email;
            }
            if (req.body.birthday)
                user_.birthday = req.body.birthday;
            if (req.body.phone)
                user_.phone = req.body.phone;
            if (req.body.salary)
                user_.salary = req.body.salary;
            if (req.body.address)
                user_.address = req.body.address;
            if (req.body.status)
                user_.status = req.body.status;
            if (req.body.password)
                user_.password = req.body.password;
        }
        else
            return res.status(400).json('not allowed for you.');
        //update and return the new token of updated user
        const resualt = await admin_obj.update(user_);
        const new_token = jsonwebtoken_1.default.sign({ user: resualt }, secret);
        res.status(200).json({ admin: resualt, token: new_token });
    }
    catch (e) {
        res.status(400).send(`${e}`);
    }
}
//create user by getting user data from request body
async function create(req, res) {
    const admin_email = req.headers.email;
    const admin_password = req.headers.password;
    //create type user with getting data to send to the database
    const u = {
        full_name: req.body.full_name,
        email: req.body.email,
        password: req.body.password,
        birthday: req.body.birthday,
        address: req.body.address,
        phone: req.body.phone,
        status: 'active',
        created_at: new Date(),
        salary: Number(req.body.salary) //delete
    };
    //send user type to the database to create
    try {
        if (admin_email_exist === admin_email && admin_password_exist === admin_password) {
            const resault = await admin_obj.create(u);
            const token = jsonwebtoken_1.default.sign({ user: resault }, secret, { expiresIn: '7days' });
            res.status(200).json({ admin: resault, token });
        }
        else
            res.status(400).json('not allowed for you.');
    }
    catch (e) {
        res.status(400).json(`${e}`);
    }
}
//return deleted and delete user using id in request params [only user delete it self]
async function delete_(req, res) {
    const admin_email = req.headers.email;
    const admin_password = req.headers.password;
    //check if the request from super admin?
    if (admin_email_exist === admin_email && admin_password_exist === admin_password) { //if token exist and the request params.id == token user.id
        try {
            const result = await admin_obj.delete(Number(req.params.id)); //delete user from database by id
            res.status(200).json(result); //return deleted
        }
        catch (e) {
            res.status(400).json(`${e}`);
        }
    }
    else
        res.status(400).json('authentication required or id params wrong.'); //else return error
}
//main routes of user model
function mainRoutes(app) {
    app.get('/admins', index);
    app.get('/admins/:id', show);
    app.post('/admins', create);
    app.patch('/admins/:id', update);
    app.delete('/admins/:id', delete_);
}
exports.default = mainRoutes;
