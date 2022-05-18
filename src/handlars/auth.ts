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
            res.status(200).json({user:resault,token:user_token, role:'user'});
            
        }
        else
        {
            const resault = await admin_obj.auth(email,password);
            const user_token = jwt.sign({user:resault},secret);
            res.status(200).json({user:resault,token:user_token, role:'admin'});
            
        }
    } catch (e) {
        res.status(400).json(`${e}`);
    }
}
//send mail to the user which sending in request body
/* async function admin_forget_password(req: Request, res: Response) {
    try {
        const email = req.headers.email as unknown as string;
        //check for the user with sending email
        const resault = await user_obj.forget_password(email);
                
        //if user exist
        if(resault){
            if (resault.status!='suspended') {
                const token = jwt.sign({ user: resault }, secret);
                const url = ''; //url will provid from front end developer
                

                //send url with token
               
            }else
                res.status(400).json('user suspended');
        }
        else res.status(400).json('user not exist.');
    } catch (e) {
        res.status(400).json(`${e}`);
    }
}
//return new token for updating user and the user inforamtion token and password required
async function admin_reset_password(req: Request, res: Response) {
    try {
        const token = req.query.token as unknown as string;
        const new_password = req.body.new_password as unknown as string;
        const user = parseJwt(token).user;
        if(token){
            const permession = jwt.verify(token,secret);
            if(permession){
                const hash = bcrypt.hashSync(new_password + extra, round);
                user.password = hash;
                const result = user_obj.update(user);
                const newToken = jwt.sign({ user: result }, secret);
                res.status(200).json({user:user,token:newToken});
            }else
                res.status(400).json('user not exist');
        }else 
            res.status(400).json('token required.');
    } catch (e) {
        res.status(400).json(`${e}`);
    }
}
async function user_forget_password(req: Request, res: Response) {
    const user_obj = new User();
    try {
        const email = req.headers.email as unknown as string;
        //check for the user with sending email
        const resault = await user_obj.forget_password(email);
                
        //if user exist
        if(resault){
            if (resault.status!='suspended') {
                const token = jwt.sign({ user: resault }, secret);
                const url = ''; //url will provid from front end developer
                const mailOptions = {
                    from: config.user_email,
                    to: email,
                    subject: 'Reset Possword',
                    text:  `${url}?token=${token}`
                };

                //send url with token
                /////////////////////////
            }else
                res.status(400).json('user suspended');
        }
        else res.status(400).json('user not exist.');
    } catch (e) {
        res.status(400).json(`${e}`);
    }
}
//return new token for updating user and the user inforamtion token and password required
async function user_reset_password(req: Request, res: Response) {
    try {
        const token = req.query.token as unknown as string;
        const new_password = req.body.new_password as unknown as string;
        const user = parseJwt(token).user;
        if(token){
            const permession = jwt.verify(token,secret);
            if(permession){
                const hash = bcrypt.hashSync(new_password + config.extra, parseInt(config.round as string));
                user.password = hash;
                const result = user_obj.update(user);
                const newToken = jwt.sign({ user: result }, secret);
                res.status(200).json({user:user,token:newToken});
            }else
                res.status(400).json('user not exist');
        }else 
            res.status(400).json('token required.');
    } catch (e) {
        res.status(400).json(`${e}`);
    }
}


 */
//main routes of user model
function mainRoutes(app: Application) {
    app.post('/login', login);
    //app.get('/forget_password',forget_password);
    //app.post('/reset_password', reset_password);
    //
}

export default mainRoutes;

