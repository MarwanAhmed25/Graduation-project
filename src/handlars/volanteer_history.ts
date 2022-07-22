import { Application, Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import { volantntary_history, VolantntaryHistory } from '../models/volantntary_history';
import { Charity } from '../models/charity';
import parseJwt from '../utils/jwtParsing';
import config_ from '../config/config';


const secret: string = config_.token as unknown as string;
const volanteer_obj = new VolantntaryHistory();
const charity_obj = new Charity();
//return all brands in database
async function index(req: Request, res: Response) {
    
    try {
        const result = await volanteer_obj.index();
        res.status(200).json(result);
    } catch (e) {
        res.status(400).json(`${e}`);
    }
}
//return only one brand from databse using id in request params
async function show(req: Request, res: Response) {
    try {
        const result = await volanteer_obj.show(req.params.id as unknown as number);
        if(result == undefined)
            return res.status(400).json('row not exist');
        res.status(200).json(result);
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
        console.log(us.user);
        const amount = req.body.amount;
        //if admin or super admin the changes will occure to the brand
        if (permession) {
            const c: volantntary_history = {
                volanteer_id: us.user.id,
                amount: amount,
                charity_case_id: req.body.charity_case_id,
            };

            //console.log(c);
            
            //create new brand to the database and return new data
            const result = await volanteer_obj.create(c);


            const charity_exist = await charity_obj.show(req.body.charity_case_id);
            charity_exist.remaining = charity_exist.remaining - amount;
            if(charity_exist.remaining <= 0)
                charity_exist.status = 'compelete';
            await charity_obj.update(charity_exist);

            res.status(200).json(result);
        } else res.status(400).json('Not allowed this for you!!');

    } catch (e) {
        res.status(400).json(`${e}`);
    }
}


function mainRoutes(app: Application) {
    app.get('/transactions', index);
    app.get('/transactions/:volantteer_id', show);
    app.post('/transactions', create);
}

export default mainRoutes;
