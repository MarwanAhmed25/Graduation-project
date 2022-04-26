"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import { userSchema } from '../service/validation';
const nodemailer_1 = __importDefault(require("nodemailer"));
const admins_1 = require("../models/admins");
const jwtParsing_1 = __importDefault(require("../utils/jwtParsing"));
const config_1 = __importDefault(require("../config/config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//import {middelware} from '../service/middelware';
const bcrypt_1 = __importDefault(require("bcrypt"));
const secret = config_1.default.token;
const extra = config_1.default.extra;
const round = config_1.default.round;
const admin_password_exist = config_1.default.admin_password;
const admin_email_exist = config_1.default.admin_email;
const user_obj = new admins_1.Admin();
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: config_1.default.user_email,
        pass: config_1.default.user_password
    }
});
//return a json data for all users in database [allowed only for admins]
async function index(req, res) {
    const admin_email = req.headers.admin_email;
    const admin_password = req.headers.admin_password;
    //check if request from super admin 
    if (admin_email_exist === admin_email && admin_password_exist === admin_password) {
        try {
            const resault = await user_obj.index();
            res.status(200).json(resault);
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
    const admin_email = req.headers.admin_email;
    const admin_password = req.headers.admin_password;
    //check if request from super admin 
    if (admin_email_exist === admin_email && admin_password_exist === admin_password) {
        try {
            const resault = await user_obj.show(parseInt(req.params.id));
            if (resault == undefined)
                return res.status(400).json('row not exist');
            return res.status(200).json(resault);
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
    const admin_email = req.headers.admin_email;
    const admin_password = req.headers.admin_password;
    const id = parseInt(req.params.id);
    try {
        const user_ = await user_obj.show(id); //get user from database with id in request params
        console.log(user_);
        if (user_ == undefined)
            return res.status(400).json('row not exist');
        //check if request from super admin 
        if (admin_email_exist == admin_email && admin_password_exist == admin_password) {
            if (req.body.f_name)
                user_.f_name = req.body.f_name;
            if (req.body.l_name)
                user_.l_name = req.body.l_name;
            if (req.body.email)
                user_.email = req.body.email;
            if (req.body.birthday)
                user_.birthday = req.body.birthday;
            if (req.body.phone)
                user_.phone = req.body.phone;
            if (req.body.address)
                user_.address = req.body.address;
            if (req.body.status)
                user_.status = req.body.status;
        }
        else
            return res.status(400).json('not allowed for you.');
        //update and return the new token of updated user
        const resualt = await user_obj.update(user_);
        const new_token = jsonwebtoken_1.default.sign({ user: resualt }, secret);
        res.status(200).json({ user: resualt, token: new_token });
    }
    catch (e) {
        res.status(400).send(`${e}`);
    }
}
//create user by getting user data from request body
async function create(req, res) {
    const admin_email = req.headers.admin_email;
    const admin_password = req.headers.admin_password;
    //create type user with getting data to send to the database
    const u = {
        f_name: req.body.f_name,
        l_name: req.body.l_name,
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
            const resault = await user_obj.create(u);
            const token = jsonwebtoken_1.default.sign({ user: resault }, secret);
            res.status(200).json({ user: resault, token });
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
    const admin_email = req.headers.admin_email;
    const admin_password = req.headers.admin_password;
    //check if the request from super admin?
    if (admin_email_exist === admin_email && admin_password_exist === admin_password) { //if token exist and the request params.id == token user.id
        try {
            const resault = await user_obj.delete(Number(req.params.id)); //delete user from database by id
            res.status(200).json(resault); //return deleted
        }
        catch (e) {
            res.status(400).json(`${e}`);
        }
    }
    else
        res.status(400).json('authentication required or id params wrong.'); //else return error
}
//return token for user and login the user using email and password from request body
async function login(req, res) {
    const email = req.headers.email; //required
    const password = req.headers.password; //required
    try {
        //search in database by input data
        const resault = await user_obj.auth(email, password);
        if (resault) { //if their is user in database with input data will return token for that uer
            const user_token = jsonwebtoken_1.default.sign({ user: resault }, secret);
            res.status(200).json({ user: resault, token: user_token });
        }
        else
            res.status(400).json('user not exist.'); //else return failed
    }
    catch (e) {
        res.status(400).json(`${e}`);
    }
}
//send mail to the user which sending in request body
async function forget_password(req, res) {
    try {
        const email = req.headers.email;
        //check for the user with sending email
        const resault = await user_obj.forget_password(email);
        //if user exist
        if (resault) {
            if (resault.status != 'suspended') {
                const token = jsonwebtoken_1.default.sign({ user: resault }, secret);
                const url = ''; //url will provid from front end developer
                const mailOptions = {
                    from: config_1.default.user_email,
                    to: email,
                    subject: 'Reset Possword',
                    text: `${url}?token=${token}`
                };
                //send url with token
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log('Email sent: ' + info.response);
                        res.status(200).json('check your email.');
                    }
                });
            }
            else
                res.status(400).json('user suspended');
        }
        else
            res.status(400).json('user not exist.');
    }
    catch (e) {
        res.status(400).json(`${e}`);
    }
}
//return new token for updating user and the user inforamtion token and password required
async function reset_password(req, res) {
    try {
        const token = req.query.token;
        const new_password = req.body.new_password;
        const user = (0, jwtParsing_1.default)(token).user;
        if (token) {
            const permession = jsonwebtoken_1.default.verify(token, secret);
            if (permession) {
                const hash = bcrypt_1.default.hashSync(new_password + extra, round);
                user.password = hash;
                const result = user_obj.update(user);
                const newToken = jsonwebtoken_1.default.sign({ user: result }, secret);
                res.status(200).json({ user: user, token: newToken });
            }
            else
                res.status(400).json('user not exist');
        }
        else
            res.status(400).json('token required.');
    }
    catch (e) {
        res.status(400).json(`${e}`);
    }
}
//return token for user with id from request params [only for admins]
/* async function get_token(req: Request, res: Response) {
    
    const token = req.headers.token as unknown as string;
    const admin_email = req.headers.admin_email as unknown as string;
    const admin_password = req.headers.admin_password as unknown as string;

    try {

        //check if the request from super admin?
        const isAdmin = isAdminFun(admin_email,admin_password,token);
        if(isAdmin){//if request from admin user or super admin will return token for user with id of request id
            const res_user = await user_obj.show(parseInt(req.params.id));
            const res_token = jwt.sign({ user: res_user }, secret);
            res.status(200).json(res_token);
        }else throw new Error('not allowed.'); //else return not allowed
        
    } catch (e) {
        res.status(400).json(`${e}`);
    }
} */
//main routes of user model
function mainRoutes(app) {
    app.get('/admins/auth/login', login);
    app.get('/admins/auth/forget_password', forget_password);
    app.post('/admins/auth/reset_password', reset_password);
    //
    app.get('/admins', index);
    app.get('/admins/:id', show);
    app.post('/admins', create);
    //app.get('/admins/:id/get_token', get_token);
    app.patch('/admins/:id', update);
    app.delete('/admins/:id', delete_);
}
exports.default = mainRoutes;
