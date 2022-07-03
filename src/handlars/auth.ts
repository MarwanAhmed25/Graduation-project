import { Application, Response, Request } from 'express';
import { Admin } from '../models/admins';
import { User } from '../models/users';
import parseJwt from '../utils/jwtParsing';
import config from '../config/config';
import jwt from 'jsonwebtoken';


const secret: string = config.token as unknown as string;
const admin_password_exist = config.admin_password;
const admin_email_exist = config.admin_email;
const admin_obj = new Admin();
const user_obj = new User();

//send mail to the user which sending in request body

//return token for user and login the user using email and password from request body
async function login(req: Request, res: Response) {
    
    const email:string = req.body.email as unknown as string;//required
    const password:string = req.body.password as unknown as string;//required
    

    //check if request from super admin want to login
    if(admin_email_exist === email && admin_password_exist === password){
        return res.status(200).json({role:'super_admin'});
    }

    
    try {

        //search in database by input data
        const resault = await user_obj.auth(email,password);
        
        if(resault){//if their is user in database with input data will return token for that uer

            const user_token = jwt.sign({user:resault},secret);
            return res.status(200).json({user:resault,token:user_token, role:'user'});
            
        }
        else
        {
            const resault = await admin_obj.auth(email,password);
            const user_token = jwt.sign({user:resault},secret);
            return res.status(200).json({user:resault,token:user_token, role:'admin'});
            
        }
        
    } catch (e) {
        res.status(400).json(`${e}`);
    }
    
}
//main routes of user model
function mainRoutes(app: Application) {
    app.post('/login', login);
    //app.get('/forget_password',forget_password);
    //app.post('/reset_password', reset_password);
    //
}

export default mainRoutes;

