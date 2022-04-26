import { Application, Response, Request } from 'express';
//import { userSchema } from '../service/validation';
import nodemailer from 'nodemailer';
import { User, user } from '../models/users';
import parseJwt from '../utils/jwtParsing';
import isAdminFun from '../utils/isAdmin';
import jwt from 'jsonwebtoken';
//import {middelware} from '../service/middelware';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();
const secret: string = process.env.token as unknown as string;
const user_obj = new User();

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.user_email,
        pass: process.env.user_password
    }
});
  

//return a json data for all users in database [allowed only for admins]
async function index(req: Request, res: Response) {
    
    try {
        const resault = await user_obj.index();
        res.status(200).json(resault);
    } catch (e) {
        res.status(400).json(`${e}`);
    }
    
}
//return json data for a sungle user [allowed only for admins or user it self]
async function show(req: Request, res: Response) {
        
    try {
        const resault = await user_obj.show(parseInt(req.params.id));
        if(resault == undefined)
            return res.status(400).json('row not exist');
        return res.status(200).json(resault);
            
    } catch (e) {                
        return res.status(400).json(`${e}`);
    }
   
}
/*
return token for updated user [user can update all his data except (coupon_id, status), 
    super admin can update only(coupon_id,status),
    admins can update (coupon_id, status when not == admin)]
    */
async function update(req: Request, res: Response) {
    let user_type = 'user';

    const token = req.headers.token as unknown as string;
    const id = parseInt(req.params.id);

    try {
        const user_ = await user_obj.show(id);//get user from database with id in request params
        //console.log(user_);
        if(user_ == undefined)
            return res.status(400).json('row not exist');
        else if(token){//check the token if exist to know if admin or user want to update
            const permession = jwt.verify(token, secret);
            
            if(permession)
            {
                const user = parseJwt(token);
                if(user.user.status == 'admin')
                    user_type = 'admin'; 
                else if(id != user.user.id){
                    return res.status(200).json('not allowed this change');
                }
            }
        }
        
        //if user send the request
        if(user_type == 'user'){

            if(req.body.f_name)
                user_.f_name=req.body.f_name;
            if(req.body.l_name)
                user_.l_name=req.body.l_name;
            if(req.body.email)
                user_.email=req.body.email;
            if(req.body.password)
                user_.password=req.body.password;
            if(req.body.birthday)
                user_.birthday=req.body.birthday;
            if(req.body.phone)
                user_.phone=req.body.phone;
            if(req.body.city)
                user_.city=req.body.city;
            if(req.body.address)
                user_.address=req.body.address;
            if(req.body.rate)
                user_.rate=req.body.rate;
            if(req.body.images)
                user_.images=req.body.images;
            if(req.body.description)
                user_.description=req.body.description;
            
        }else { //if admin 

            if(req.body.status)
                user_.status = req.body.status;
            if(req.body.role){
                user_.role = req.body.role;
            }
            
        }
        
        //update and return the new token of updated user
        const resualt = await user_obj.update(user_);
        const new_token = jwt.sign({user:resualt},secret);
        res.status(200).json({user:resualt,token:new_token});

    } catch (e) {
        res.status(400).send(`${e}`);
    }
}
//create user by getting user data from request body
async function create(req: Request, res: Response) {
    
    //create type user with getting data to send to the database
    const u: user = {
        f_name:req.body.f_name, 
        l_name:req.body.l_name, 
        email:req.body.email, //required
        password:req.body.password, //required
        birthday:req.body.birthday, 
        phone:req.body.phone, 
        status:'active',//the default of status is active 
        city:req.body.city,
        address:req.body.address,
        type_id:req.body.type_id,
        admin_id:req.body.admin_id,
        role:req.body.role,
        rate:0,//default 0
        images:req.body.images,
        description:req.body.description,
    };
        //send user type to the database to create
    try {                
        const resault = await user_obj.create(u);
        const token = jwt.sign({ user: resault }, secret);
        res.status(200).json({user:resault,token});
    } catch (e) {
        res.status(400).json(`${e}`);
    }
    
}
//return deleted and delete user using id in request params [only user delete it self]
async function delete_(req: Request, res: Response) {
    const token = req.headers.token as unknown as string;
    const id = parseInt(req.params.id);
    let permession = false;
    if(token)
    {
        const per = jwt.verify(token,secret);
        if(per)
            permession = true; 
        else
            res.status(400).json('user not exist.');  
    }else
        res.status(400).json('login token required');

    //check if the request from super admin?
    if (permession && (id == parseInt(parseJwt(token).user.id))) {//if token exist and the request params.id == token user.id
        try {
            const resault = await user_obj.delete(id); //delete user from database by id
            res.status(200).json(resault); //return deleted
        } catch (e) {
            res.status(400).json(`${e}`);
        }
    } else 
        res.status(400).json('token required or id params wrong.');//else return error
}
//return token for user and login the user using email and password from request body
async function login(req: Request, res: Response) {
    
    const email = req.headers.email as unknown as string;//required
    const password = req.headers.password as unknown as string;//required
    
    try {

        //search in database by input data
        const resault = await user_obj.auth(email,password);
        
        if(resault){//if their is user in database with input data will return token for that uer

            const user_token = jwt.sign({user:resault},secret);
            res.status(200).json({user:resault,token:user_token});
            
        }
        else
            res.status(400).json('user not exist.');//else return failed
    } catch (e) {
        res.status(400).json(`${e}`);
    }
}
//send mail to the user which sending in request body
async function forget_password(req: Request, res: Response) {
    try {
        const { email } = req.body;
        //check for the user with sending email
        const resault = await user_obj.forget_password(email);
                
        //if user exist
        if(resault){
            if (resault.status!='suspended') {
                const token = jwt.sign({ user: resault }, secret);
                const url = ''; //url will provid from front end developer
                const mailOptions = {
                    from: process.env.user_email,
                    to: email,
                    subject: 'Reset Possword',
                    text:  `${url}?token=${token}`
                };

                //send url with token
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                        res.status(200).json('check your email.');
                    }
                });
            }else
                res.status(400).json('user suspended');
        }
        else res.status(400).json('user not exist.');
    } catch (e) {
        res.status(400).json(`${e}`);
    }
}
//return new token for updating user and the user inforamtion token and password required
async function reset_password(req: Request, res: Response) {
    try {
        const token = req.query.token as unknown as string;
        const new_password = req.body.new_password as unknown as string;
        const user = parseJwt(token).user;
        if(token){
            const permession = jwt.verify(token,secret);
            if(permession){
                const hash = bcrypt.hashSync(new_password + process.env.extra, parseInt(process.env.round as string));
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
//return token for user with id from request params [only for admins]
/* async function get_token(req: Request, res: Response) {
    
    const token = req.headers.token as unknown as string;
    const admin_email = req.headers.admin_email as unknown as string;
    const admin_password = req.headers.admin_password as unknown as string;

    try {

        //check if the request from super admin?
        const isAdmin = isAdminFun(admin_email,admin_password,token);
        if(isAdmin){//if request from admin user or super admin will return token for user with id of request id
            const res_user = await user_obj.show(parseInt(req.params.id));
            const res_token = jwt.sign({ user: res_user }, secret);
            res.status(200).json(res_token);
        }else throw new Error('not allowed.'); //else return not allowed        
        
    } catch (e) {
        res.status(400).json(`${e}`);
    }
} */
//main routes of user model
function mainRoutes(app: Application) {
    app.post('/auth/login', login);
    app.get('/auth/forget_password',forget_password);
    app.post('/auth/reset_password', reset_password);
    //
    app.get('/users', index);
    app.get('/users/:id', show);
    app.post('/users', create);
    // app.get('/users/:id/get_token', get_token);
    app.patch('/users/:id', update);
    app.delete('/users/:id', delete_);
}

export default mainRoutes;
