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
//send mail to the user which sending in request body
//return token for user and login the user using email and password from request body
async function login(req, res) {
    const email = req.body.email; //required
    const password = req.body.password; //required
    //check if request from super admin want to login
    if (admin_email_exist === email && admin_password_exist === password) {
        return res.status(200).json({ role: 'super_admin' });
    }
    try {
        //search in database by input data
        const resault = await user_obj.auth(email, password);
        if (resault) { //if their is user in database with input data will return token for that uer
            const user_token = jsonwebtoken_1.default.sign({ user: resault }, secret);
            return res.status(200).json({ user: resault, token: user_token, role: 'user' });
        }
        else {
            const resault = await admin_obj.auth(email, password);
            const user_token = jsonwebtoken_1.default.sign({ user: resault }, secret);
            return res.status(200).json({ user: resault, token: user_token, role: 'admin' });
        }
    }
    catch (e) {
        res.status(400).json(`${e}`);
    }
}
//main routes of user model
function mainRoutes(app) {
    app.post('/login', login);
    //app.get('/forget_password',forget_password);
    //app.post('/reset_password', reset_password);
    //
}
exports.default = mainRoutes;
