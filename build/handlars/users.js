"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const users_1 = require("../models/users");
const jwtParsing_1 = __importDefault(require("../utils/jwtParsing"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const isAdmin_1 = __importDefault(require("../utils/isAdmin"));
const config_1 = __importDefault(require("../config/config"));
const links_1 = require("../models/links");
const secret = config_1.default.token;
const user_obj = new users_1.User();
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: config_1.default.user_email,
        pass: config_1.default.user_password
    }
});
//return a json data for all users in database [allowed only for admins]
async function index(req, res) {
    const token = req.headers.token;
    let isAdmin = false;
    try {
        if (token) {
            isAdmin = (0, isAdmin_1.default)('', '', token);
        }
        else
            return res.status(400).json('login required.');
        if (isAdmin) {
            const resault = await user_obj.index();
            res.status(200).json(resault);
        }
    }
    catch (e) {
        res.status(400).json(`${e}`);
    }
}
//return json data for a sungle user [allowed only for admins or user it self]
async function show(req, res) {
    const token = req.headers.token;
    let isAdmin = false;
    try {
        if (token) {
            isAdmin = (0, isAdmin_1.default)('', '', token);
        }
        else
            return res.status(400).json('login required.');
        if (isAdmin) {
            const resault = await user_obj.show(parseInt(req.params.id));
            if (resault == undefined)
                return res.status(400).json('row not exist');
            return res.status(200).json(resault);
        }
    }
    catch (e) {
        return res.status(400).json(`${e}`);
    }
}
/*
return token for updated user [user can update all his data except (coupon_id, status),
    super admin can update only(coupon_id,status),
    admins can update (coupon_id, status when not == admin)]
    */
async function update(req, res) {
    let user_type = 'user';
    const token = req.headers.token;
    const id = parseInt(req.params.id);
    try {
        const user_ = await user_obj.show(id); //get user from database with id in request params
        //console.log(user_);
        if (user_ == undefined)
            return res.status(400).json('row not exist');
        else if (token) { //check the token if exist to know if admin or user want to update
            const permession = jsonwebtoken_1.default.verify(token, secret);
            if (permession) {
                const user = (0, jwtParsing_1.default)(token);
                if (user.user.admin_id)
                    user_type = 'admin';
                else if (id != user.user.id) {
                    return res.status(200).json('not allowed this change');
                }
            }
        }
        //if user send the request
        if (user_type == 'user') {
            if (req.body.full_name)
                user_.full_name = req.body.full_name;
            if (req.body.email)
                user_.email = req.body.email;
            if (req.body.password)
                user_.password = req.body.password;
            if (req.body.birthday)
                user_.birthday = req.body.birthday;
            if (req.body.phone)
                user_.phone = req.body.phone;
            if (req.body.city)
                user_.city = req.body.city;
            if (req.body.address)
                user_.address = req.body.address;
            if (req.body.id_image)
                user_.id_image = req.body.id_image;
            if (req.body.profile_image)
                user_.profile_image = req.body.profile_image;
        }
        else { //if admin 
            if (req.body.status)
                user_.status = req.body.status;
        }
        //update and return the new token of updated user
        const resualt = await user_obj.update(user_);
        const new_token = jsonwebtoken_1.default.sign({ user: resualt }, secret);
        const link_obj = new links_1.Links();
        if (resualt.role == 'organization') {
            const link_ = (await link_obj.update(req.body.link, Number(resualt.id))).link;
            return res.status(200).json({ user: { resualt, link_ }, token });
        }
        res.status(200).json({ user: resualt, token: new_token });
    }
    catch (e) {
        res.status(400).send(`${e}`);
    }
}
//create user by getting user data from request body
async function create(req, res) {
    const role = req.body.role;
    const link_obj = new links_1.Links();
    //create type user with getting data to send to the database
    const u = {
        full_name: req.body.full_name,
        email: req.body.email,
        password: req.body.password,
        birthday: req.body.birthday,
        phone: req.body.phone,
        status: 'active',
        city: req.body.city,
        address: req.body.address,
        id_image: req.body.id_image,
        role: role,
        profile_image: req.body.profile_image,
    };
    //send user type to the database to create
    try {
        const resault = await user_obj.create(u);
        const token = jsonwebtoken_1.default.sign({ user: resault }, secret, { expiresIn: '7days' });
        if (role == 'organization') {
            const link_ = (await link_obj.create(req.body.link, Number(resault.id))).link;
            return res.status(200).json({ user: { resault, link_ }, token });
        }
        res.status(200).json({ user: resault, token });
    }
    catch (e) {
        res.status(400).json(`${e}`);
    }
}
//return deleted and delete user using id in request params [only user delete it self]
async function delete_(req, res) {
    const token = req.headers.token;
    const id = parseInt(req.params.id);
    let permession = false;
    if (token) {
        const per = jsonwebtoken_1.default.verify(token, secret);
        if (per)
            permession = true;
        else
            res.status(400).json('user not exist.');
    }
    else
        res.status(400).json('login token required');
    //check if the request from super admin?
    if (permession && (id == parseInt((0, jwtParsing_1.default)(token).user.id))) { //if token exist and the request params.id == token user.id
        try {
            const resault = await user_obj.delete(id); //delete user from database by id
            res.status(200).json(resault); //return deleted
        }
        catch (e) {
            res.status(400).json(`${e}`);
        }
    }
    else
        res.status(400).json('token required or id params wrong.'); //else return error
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
                const hash = bcrypt_1.default.hashSync(new_password + config_1.default.extra, parseInt(config_1.default.round));
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
//main routes of user model
function mainRoutes(app) {
    app.get('/users', index);
    app.get('/users/:id', show);
    app.post('/users', create);
    // app.get('/users/:id/get_token', get_token);
    app.patch('/users/:id', update);
    app.delete('/users/:id', delete_);
}
exports.default = mainRoutes;
