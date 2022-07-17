"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const links_1 = require("../models/links");
//import { middelware } from '../service/middelware';
//import { brandSchema } from '../service/validation';
const jwtParsing_1 = __importDefault(require("../utils/jwtParsing"));
const links_obj = new links_1.Links();
//return all brands in database
async function index(req, res) {
    try {
        const result = await links_obj.index();
        res.status(200).json(result);
    }
    catch (e) {
        res.status(400).json(`${e}`);
    }
}
//return only one brand from databse using id in request params
async function show(req, res) {
    try {
        const result = await links_obj.show(req.params.id);
        if (result == undefined)
            return res.status(400).json('row not exist');
        res.status(200).json(result);
    }
    catch (e) {
        res.status(400).json(`${e}`);
    }
}
//update and return the brand with id in request params and data in request body
/* async function update(req: Request, res: Response) {
    const token = req.headers.token as unknown as string;
    
    
    try {
        const user = parseJwt(token).user;
        //if user it self the changes will occure
        if (parseInt(req.params.organization_id)== user.id) {
            const l = await links_obj.show(parseInt(req.params.id));
            if(l == undefined)
                return res.status(400).json('row not exist');
            if(req.body.name)
                l.link = req.body.link;
            
            //update new data to the database and return new data
            const result = await links_obj.update(l);
            res.status(200).json(result);
        } else res.status(400).json('Not allowed this for you!!');

    } catch (e) {
        res.status(400).json(`${e}`);
    }
} */
//create and return the brand with data in request body
/* async function create(req: Request, res: Response) {
   
    const token = req.headers.token as string;
    
    try {
        const user = parseJwt(token).user;
        //if user it self the changes will occure
        if (parseInt(req.params.id)== user.id && user.role == 'organization') {
            const l: links = {
                user_id: Number(req.params.organization_id),
                link:req.body.link
            };
            //create new brand to the database and return new data
            const result = await links_obj.create(l);
            res.status(200).json(result);
        } else res.status(400).json('Not allowed this for you!!');

    } catch (e) {
        res.status(400).json(`${e}`);
    }
} */
//delete and return deleted using id in request params
async function delete_(req, res) {
    const token = req.headers.token;
    try {
        const user = (0, jwtParsing_1.default)(token).user;
        //if user it self the changes will occure
        if (parseInt(req.params.organization_id) == user.id) {
            const result = await links_obj.delete(Number(req.params.id));
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
    app.get('/organization/:organization_id/links', index);
    app.get('/organization/:organization_id/links/:id', show);
    //app.post('/organization/:organization_id/links', create);
    //app.patch('/organization/:organization_id/links/:id', update);
    app.delete('/organization/:organization_id/links/:id', delete_);
}
exports.default = mainRoutes;
