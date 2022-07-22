"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const volantntary_history_1 = require("../models/volantntary_history");
const charity_1 = require("../models/charity");
const jwtParsing_1 = __importDefault(require("../utils/jwtParsing"));
const config_1 = __importDefault(require("../config/config"));
const secret = config_1.default.token;
const volanteer_obj = new volantntary_history_1.VolantntaryHistory();
const charity_obj = new charity_1.Charity();
//return all brands in database
async function index(req, res) {
    try {
        const result = await volanteer_obj.index();
        res.status(200).json(result);
    }
    catch (e) {
        res.status(400).json(`${e}`);
    }
}
//return only one brand from databse using id in request params
async function show(req, res) {
    try {
        const result = await volanteer_obj.show(req.params.id);
        if (result == undefined)
            return res.status(400).json('row not exist');
        res.status(200).json(result);
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
        console.log(us.user);
        const amount = req.body.amount;
        //if admin or super admin the changes will occure to the brand
        if (permession) {
            const c = {
                volanteer_id: us.user.id,
                amount: amount,
                charity_case_id: req.body.charity_case_id,
            };
            //console.log(c);
            //create new brand to the database and return new data
            const result = await volanteer_obj.create(c);
            const charity_exist = await charity_obj.show(req.body.charity_case_id);
            charity_exist.remaining = charity_exist.remaining - amount;
            await charity_obj.update(charity_exist);
            res.status(200).json(result);
        }
        else
            res.status(400).json('Not allowed this for you!!');
    }
    catch (e) {
        res.status(400).json(`${e}`);
    }
}
function mainRoutes(app) {
    app.get('/transactions', index);
    app.get('/transactions/:volantteer_id', show);
    app.post('/transactions', create);
}
exports.default = mainRoutes;
