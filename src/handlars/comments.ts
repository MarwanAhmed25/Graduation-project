import { Application, Response, Request } from 'express';
import { Comment, comment } from '../models/comments';
import parseJwt from '../utils/jwtParsing';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import isAdmin from '../utils/isAdmin';
//import {middelware} from '../service/middelware';
//import {commentSchema} from '../service/validation';

const secret = config.token;
const comment_obj = new Comment();
//return all comments for one product with id in request params from database
async function index(req: Request, res: Response) {
    try {
        const resault = await comment_obj.index(Number(req.params.charity_id));
        res.status(200).json(resault);
    } catch (e) {
        console.log(e);

        res.status(400).json(`${e}`);
    }
}
//return only one comment from databse using id and product_id in request params
async function show(req: Request, res: Response) {
    try {
        const resault = await comment_obj.show(Number(req.params.charity_id),Number(req.params.id));
        if(resault == undefined)
            return res.status(400).json('row not exist');
        res.status(200).json(resault);
    } catch (e) {
        console.log(e);

        res.status(400).json(`${e}`);
    }
}

//update and return the comment with id and product_id in request params and data in request body
async function update(req: Request, res: Response) {
    let isTrue = false;
    const token = req.headers.token as unknown as string;
    

    try {
        if(token){//make sure that token is exist
            const permession = jwt.verify(token, secret as string);
            if(permession){
                isTrue = true;
            }else res.status(400).json('user not exist.');
        }else res.status(400).json('login required.');

        if (isTrue) {
            const user = parseJwt(token).user;
            const c = await comment_obj.show(req.params.charity_id as unknown as number, req.params.id as unknown as number);
            if(c == undefined || user.id != c.user_id)
                return res.status(400).json('row not exist or not allowed for you.');
            
            if(req.body.message)  
                c.message = req.body.message;

            //update and return new comment data
            const resault = await comment_obj.update(c);
            res.status(200).json(resault);
        } else res.status(400).json('user not exist.');
    } catch (e) {
        console.log(e);

        res.status(400).json(`${e}`);
    }
    
}
//create and return the comment with product_id in request params and data in request body
async function create(req: Request, res: Response) {
    
    let id,isTrue = false;
    const token = req.headers.token as unknown as string;
    //console.log(token);
    
    try {
        if(token){//make sure that token is exist
            const user = parseJwt(token);
            
            id = Number(user.user.id);
            // console.log(id);
            
            const permession = jwt.verify(token, secret as string);
            if(permession){
                isTrue = true;
            }else res.status(400).json('user not exist.');

        }else res.status(400).json('login required.');

        if (isTrue) {
            const c: comment = {
                message:req.body.message,
                user_id:id,
                charity_id:Number(req.params.charity_id),
            };
            //update and return new comment data
            const resault = await comment_obj.create(c);
            res.status(200).json(resault);
        } else res.status(400).json('user not exist.');
    } catch (e) {
        console.log(e);

        res.status(400).json(`${e}`);
    }
    
}
//delete and return deleted using id and product_id in request params
async function delete_(req: Request, res: Response) {
    let isTrue = false;
    const token = req.headers.token as unknown as string;

    try {
        if(token){
            const permession = jwt.verify(token, secret as string);
            if(permession){
                isTrue = true;
            } else return res.status(400).json('user not exist.');

        } else return res.status(400).json('login required.');

        const isA = isAdmin('','',token);
        
        const user = parseJwt(token).user;
        //if token is exist will delete the comment with product_id and id in params
        if (isA || isTrue) {
            const resault = await comment_obj.delete(Number(user.id),Number(req.params.id));
            return res.status(200).json(resault);
        } else return res.status(400).json('user not exist.');
    } catch (e) {
        console.log(e);
        
        res.status(400).json(`${e}`);
    }
        
    
}

function mainRoutes(app: Application) {
    
    app.get('/charity/:charity_id/comments', index);
    app.get('/charity/:charity_id/comments/:id', show);
    app.post('/charity/:charity_id/comments', create);
    app.patch('/charity/:charity_id/comments/:id', update);
    app.delete('/charity/:charity_id/comments/:id', delete_);


}

export default mainRoutes;
 