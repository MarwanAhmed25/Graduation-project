"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const comments_1 = require("../models/comments");
const jwtParsing_1 = __importDefault(require("../utils/jwtParsing"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const isAdmin_1 = __importDefault(require("../utils/isAdmin"));
//import {middelware} from '../service/middelware';
//import {commentSchema} from '../service/validation';
//********************************************************** */
const secret = config_1.default.token;
const comment_obj = new comments_1.Comment();
//return all comments for one product with id in request params from database
async function index(req, res) {
    try {
        const resault = await comment_obj.index(Number(req.params.charity_id));
        res.status(200).json(resault);
    }
    catch (e) {
        console.log(e);
        res.status(400).json(`${e}`);
    }
}
//return only one comment from databse using id and product_id in request params
async function show(req, res) {
    try {
        const resault = await comment_obj.show(Number(req.params.charity_id), Number(req.params.id));
        if (resault == undefined)
            return res.status(400).json('row not exist');
        res.status(200).json(resault);
    }
    catch (e) {
        console.log(e);
        res.status(400).json(`${e}`);
    }
}
//update and return the comment with id and product_id in request params and data in request body
async function update(req, res) {
    let isTrue = false;
    const token = req.headers.token;
    try {
        if (token) { //make sure that token is exist
            const permession = jsonwebtoken_1.default.verify(token, secret);
            if (permession) {
                isTrue = true;
            }
            else
                res.status(400).json('user not exist.');
        }
        else
            res.status(400).json('login required.');
        if (isTrue) {
            const user = (0, jwtParsing_1.default)(token).user;
            const c = await comment_obj.show(req.params.charity_id, req.params.id);
            if (c == undefined || user.id != c.user_id)
                return res.status(400).json('row not exist or not allowed for you.');
            if (req.body.message)
                c.message = req.body.message;
            //update and return new comment data
            const resault = await comment_obj.update(c);
            res.status(200).json(resault);
        }
        else
            res.status(400).json('user not exist.');
    }
    catch (e) {
        console.log(e);
        res.status(400).json(`${e}`);
    }
}
//create and return the comment with product_id in request params and data in request body
async function create(req, res) {
    let id, isTrue = false;
    const token = req.headers.token;
    //console.log(token);
    try {
        if (token) { //make sure that token is exist
            const user = (0, jwtParsing_1.default)(token);
            id = Number(user.user.id);
            // console.log(id);
            const permession = jsonwebtoken_1.default.verify(token, secret);
            if (permession) {
                isTrue = true;
            }
            else
                res.status(400).json('user not exist.');
        }
        else
            res.status(400).json('login required.');
        if (isTrue) {
            const c = {
                message: req.body.message,
                user_id: id,
                charity_id: Number(req.params.charity_id),
            };
            //update and return new comment data
            const resault = await comment_obj.create(c);
            res.status(200).json(resault);
        }
        else
            res.status(400).json('user not exist.');
    }
    catch (e) {
        console.log(e);
        res.status(400).json(`${e}`);
    }
}
//delete and return deleted using id and product_id in request params
async function delete_(req, res) {
    let isTrue = false;
    const token = req.headers.token;
    const admin_email = req.headers.admin_email;
    const admin_password = req.headers.admin_password;
    try {
        if (token) {
            const permession = jsonwebtoken_1.default.verify(token, secret);
            if (permession) {
                isTrue = true;
            }
            else
                return res.status(400).json('user not exist.');
        }
        else
            return res.status(400).json('login required.');
        const isA = (0, isAdmin_1.default)(admin_email, admin_password, token);
        const user = (0, jwtParsing_1.default)(token).user;
        //if token is exist will delete the comment with product_id and id in params
        if (isA || isTrue) {
            const resault = await comment_obj.delete(Number(user.id), Number(req.params.id));
            return res.status(200).json(resault);
        }
        else
            return res.status(400).json('user not exist.');
    }
    catch (e) {
        console.log(e);
        res.status(400).json(`${e}`);
    }
}
function mainRoutes(app) {
    app.get('/charity/:charity_id/comments', index);
    app.get('/charity/:charity_id/comments/:id', show);
    app.post('/charity/:charity_id/comments', create);
    app.patch('/charity/:charity_id/comments/:id', update);
    app.delete('/charity/:charity_id/comments/:id', delete_);
}
exports.default = mainRoutes;
