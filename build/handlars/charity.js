"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const charity_1 = require("../models/charity");
const jwtParsing_1 = __importDefault(require("../utils/jwtParsing"));
const config_1 = __importDefault(require("../config/config"));
const secret = config_1.default.token;
const charity_obj = new charity_1.Charity();
//return all brands in database
async function index(req, res) {
    try {
        const result = await charity_obj.index();
        res.status(200).json(result);
    }
    catch (e) {
        res.status(400).json(`${e}`);
    }
}
//return only one brand from databse using id in request params
async function show(req, res) {
    try {
        const result = await charity_obj.show(req.params.id);
        if (result == undefined)
            return res.status(400).json('row not exist');
        res.status(200).json(result);
    }
    catch (e) {
        res.status(400).json(`${e}`);
    }
}
//update and return the brand with id in request params and data in request body
async function update(req, res) {
    const token = req.headers.token;
    try {
        if (token) {
            const permession = jsonwebtoken_1.default.verify(token, secret);
            const us = (0, jwtParsing_1.default)(token);
            //console.log(us); 
            const c = await charity_obj.show(parseInt(req.params.id));
            if (c == undefined)
                return res.status(400).json('row not exist');
            //if admin or super admin the changes will occure to the brand
            if ((c.needy_id == us.user.id) && permession) {
                if (req.body.description)
                    c.description = req.body.description;
                if (req.body.intro)
                    c.intro = req.body.intro;
                if (req.body.images)
                    c.images = req.body.images;
                if (req.body.type_id)
                    c.type_id = req.body.type_id;
            }
            else
                res.status(400).json('Not allowed this for you!!');
            //update new data to the database and return new data
            const result = await charity_obj.update(c);
            res.status(200).json(result);
        }
        else
            return res.status(400).json('login required.');
    }
    catch (e) {
        res.status(400).json(`${e}`);
    }
}
//create and return the brand with data in request body
async function create(req, res) {
    const token = req.headers.token;
    try {
        const permession = jsonwebtoken_1.default.verify(token, secret);
        const us = (0, jwtParsing_1.default)(token);
        //console.log(us.user);
        //if admin or super admin the changes will occure to the brand
        if (permession) {
            const c = {
                images: req.body.images,
                intro: req.body.intro,
                description: req.body.description,
                needy_id: Number(us.user.id),
                status: 'pendding',
                type_id: req.body.type_id,
                value_of_need: req.body.value_of_need,
                remaining: req.body.value_of_need
            };
            //console.log(c);
            //create new brand to the database and return new data
            const result = await charity_obj.create(c);
            res.status(200).json(result);
        }
        else
            res.status(400).json('Not allowed this for you!!');
    }
    catch (e) {
        res.status(400).json(`${e}`);
    }
}
//delete and return deleted using id in request params
async function delete_(req, res) {
    const token = req.headers.token;
    try {
        const permession = jsonwebtoken_1.default.verify(token, secret);
        const us = (0, jwtParsing_1.default)(token);
        //delete brand from the database and return deleted
        //if admin or super admin the changes will occure to the brand
        if (permession) {
            const result = await charity_obj.delete(Number(req.params.id), us.user.id);
            res.status(200).json(result);
        }
        else
            res.status(400).json('Not allowed for you.');
    }
    catch (e) {
        res.status(400).json(`${e}`);
    }
}
function mainRoutes(app) {
    app.get('/charity', index);
    app.get('/charity/:id', show);
    app.post('/charity', create);
    app.patch('/charity/:id', update);
    app.delete('/charity/:id', delete_);
}
exports.default = mainRoutes;
