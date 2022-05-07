import { Application, Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import { Charity, charity } from '../models/charity';
import isAdminFun from '../utils/isAdmin';
import parseJwt from '../utils/jwtParsing';
import config_ from '../config/config';
//import { middelware } from '../service/middelware';
//import { brandSchema } from '../service/validation';


const secret: string = config_.token as unknown as string;
const charity_obj = new Charity();
//return all brands in database
async function index(req: Request, res: Response) {
    
    try {
        const resault = await charity_obj.index();
        res.status(200).json(resault);
    } catch (e) {
        res.status(400).json(`${e}`);
    }
}
//return only one brand from databse using id in request params
async function show(req: Request, res: Response) {
    try {
        const resault = await charity_obj.show(req.params.id as unknown as number);
        if(resault == undefined)
            return res.status(400).json('row not exist');
        res.status(200).json(resault);
    } catch (e) {
        res.status(400).json(`${e}`);
    }
}

//update and return the brand with id in request params and data in request body
async function update(req: Request, res: Response) {
    const token = req.headers.token as unknown as string;
    let us, permession;
    try {
        
        if(token){
            permession = jwt.verify(token,secret);
            us = parseJwt(token);
        }else
            return res.status(400).json('login required.');
        

        const isAd = isAdminFun('','',token);
        const c = await charity_obj.show(parseInt(req.params.id));
        if(c == undefined)
            return res.status(400).json('row not exist');
        //if admin or super admin the changes will occure to the brand
        if ((c.needy_id == us.user.id) && permession) {
            
            if(req.body.description)
                c.description = req.body.description;
            if(req.body.images)
                c.images = req.body.images;
        }
        else if(isAd){
            if(req.body.status)
                c.status = req.body.status;           
            
        } else res.status(400).json('Not allowed this for you!!');


        //update new data to the database and return new data
        const resault = await charity_obj.update(c);
        res.status(200).json(resault);

    } catch (e) {
        res.status(400).json(`${e}`);
    }
}
//create and return the brand with data in request body
async function create(req: Request, res: Response) {
   
    const token = req.headers.token as string;
    
    try {
        const permession = jwt.verify(token,secret);
        const us = parseJwt(token);
        //if admin or super admin the changes will occure to the brand
        if (permession) {
            const c: charity = {
                images: req.body.images,
                description:req.body.description,
                needy_id: Number(us.user.id),
                status: 'pendding',
            };
            //create new brand to the database and return new data
            const resault = await charity_obj.create(c);
            res.status(200).json(resault);
        } else res.status(400).json('Not allowed this for you!!');

    } catch (e) {
        res.status(400).json(`${e}`);
    }
}
//delete and return deleted using id in request params
async function delete_(req: Request, res: Response) {
    const token = req.headers.token as unknown as string;
    
    try {
        const permession = jwt.verify(token,secret);
        const us = parseJwt(token);
        //delete brand from the database and return deleted
        //if admin or super admin the changes will occure to the brand
        if (permession) {
            const resault = await charity_obj.delete(Number(req.params.id),us.user.id);
            res.status(200).json(resault);
        } else res.status(400).json('Not allowed for you.');

    } catch (e) {
        res.status(400).json(`${e}`);
    }
    
}

function mainRoutes(app: Application) {
    app.get('/charity', index);
    app.get('/charity/:id', show);
    app.post('/charity', create);
    app.patch('/charity/:id', update);
    app.delete('/charity/:id', delete_);
}

export default mainRoutes;
