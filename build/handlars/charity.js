"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const charity_1 = require("../models/charity");
const isAdmin_1 = __importDefault(require("../utils/isAdmin"));
//import { middelware } from '../service/middelware';
//import { brandSchema } from '../service/validation';
const charity_obj = new charity_1.Charity();
//return all brands in database
async function index(req, res) {
    try {
        const resault = await charity_obj.index();
        res.status(200).json(resault);
    }
    catch (e) {
        res.status(400).json(`${e}`);
    }
}
//return only one brand from databse using id in request params
async function show(req, res) {
    try {
        const resault = await charity_obj.show(req.params.id);
        if (resault == undefined)
            return res.status(400).json('row not exist');
        res.status(200).json(resault);
    }
    catch (e) {
        res.status(400).json(`${e}`);
    }
}
//update and return the brand with id in request params and data in request body
async function update(req, res) {
    const token = req.headers.token;
    try {
        //check if the user super admin or admin
        const isAdmin = (0, isAdmin_1.default)('', '', token);
        //if admin or super admin the changes will occure to the brand
        if (isAdmin) {
            const c = await charity_obj.show(parseInt(req.params.id));
            if (c == undefined)
                return res.status(400).json('row not exist');
            if (req.body.description)
                c.description = req.body.description;
            if (req.body.images)
                c.images = req.body.images;
            if (req.body.status)
                c.status = req.body.status;
            if (req.body.needy_id)
                c.needy_id = req.body.needy_id;
            if (req.body.volanteer_id)
                c.volanteer_id = req.body.volanteer_id;
            //update new data to the database and return new data
            const resault = await charity_obj.update(c);
            res.status(200).json(resault);
        }
        else
            res.status(400).json('Not allowed this for you!!');
    }
    catch (e) {
        res.status(400).json(`${e}`);
    }
}
//create and return the brand with data in request body
async function create(req, res) {
    const token = req.headers.token;
    try {
        //check if the user super admin or admin
        const isAdmin = (0, isAdmin_1.default)('', '', token);
        //if admin or super admin the changes will occure to the brand
        if (isAdmin) {
            const c = {
                images: req.body.images,
                description: req.body.description,
                needy_id: req.body.needy_id,
                volanteer_id: req.body.volanteer_id,
                status: req.body.status,
            };
            //create new brand to the database and return new data
            const resault = await charity_obj.create(c);
            res.status(200).json(resault);
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
        //check if the user super admin or admin
        const isAdmin = (0, isAdmin_1.default)('', '', token);
        //delete brand from the database and return deleted
        //if admin or super admin the changes will occure to the brand
        if (isAdmin) {
            const resault = await charity_obj.delete(Number(req.params.id));
            res.status(200).json(resault);
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
