import { Application, Response, Request } from 'express';
import { Type, type } from '../models/types';
import isAdminFun from '../utils/isAdmin';
import { Charity } from '../models/charity';





const type_obj = new Type();
//return all brands in database
async function index(req: Request, res: Response) {
    
    try {
        const resault = await type_obj.index();
        res.status(200).json(resault);
    } catch (e) {
        res.status(400).json(`${e}`);
    }
}
//return only one brand from databse using id in request params
async function show(req: Request, res: Response) {
    try {
        const resault = await type_obj.show(req.params.id as unknown as number);
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
    
    
    try {
        //check if the user admin
        const isAdmin = isAdminFun('','',token);
        //if admin or super admin the changes will occure to the brand
        if (isAdmin) {
            const t = await type_obj.show(parseInt(req.params.id));
            if(t == undefined)
                return res.status(400).json('row not exist');
            if(req.body.name)
                t.type = req.body.name;
            
            if(req.body.description)
                t.description = req.body.description;
            if(req.body.image)
                t.image = req.body.image;
            //update new data to the database and return new data
            const resault = await type_obj.update(t);
            res.status(200).json(resault);
        } else res.status(400).json('Not allowed this for you!!');

    } catch (e) {
        res.status(400).json(`${e}`);
    }
}
//create and return the brand with data in request body
async function create(req: Request, res: Response) {
   
    const token = req.headers.token as string;
    
    try {
        //check if the user super admin or admin
        const isAdmin = isAdminFun('','',token);
        //if admin or super admin the changes will occure to the brand
        if (isAdmin) {
            const t: type = {
                type: req.body.type,
                description:req.body.description,
                image:req.body.image
            };
            //create new brand to the database and return new data
            const resault = await type_obj.create(t);
            res.status(200).json(resault);
        } else res.status(400).json('Not allowed this for you!!');

    } catch (e) {
        res.status(400).json(`${e}`);
    }
}
//delete and return deleted using id in request params
async function delete_(req: Request, res: Response) {
    const token = req.headers.token as unknown as string;
    const charity_obj = new Charity();
    const id = Number(req.params.id);
    try {
        //check if there is a needy case in the type.
        const charities = await charity_obj.index();
        const charities_with_type = charities.filter(ch => ch.type_id == id);

        if(charities_with_type.length){
            return res.status(400).json('can not delete the type. there is a needy case in it.');
        }
        //check if the user super admin or admin
        const isAdmin = isAdminFun('','',token);
        //delete brand from the database and return deleted
        //if admin or super admin the changes will occure to the brand
        if (isAdmin) {
            const resault = await type_obj.delete(id);
            res.status(200).json(resault);
        } else res.status(400).json('Not allowed for you.');

    } catch (e) {
        res.status(400).json(`${e}`);
    }
    
}

function mainRoutes(app: Application) {
    app.get('/types', index);
    app.get('/types/:id', show);
    app.post('/types', create);
    app.patch('/types/:id', update);
    app.delete('/types/:id', delete_);
}

export default mainRoutes;
 