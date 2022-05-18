import { Application, Response, Request } from 'express';
import { Admin, admin } from '../models/admins';
import { User } from '../models/users';
import config from '../config/config';
import jwt from 'jsonwebtoken';


const secret: string = config.token as unknown as string;
const admin_password_exist = config.admin_password;
const admin_email_exist = config.admin_email;
const admin_obj = new Admin();
const user_obj = new User();


  

//return a json data for all users in database [allowed only for admins]
async function index(req: Request, res: Response) {
    const admin_email = req.headers.email as unknown as string;
    const admin_password = req.headers.password as unknown as string;

    //check if request from super admin 
    if(admin_email_exist === admin_email && admin_password_exist === admin_password){
        try {
            const resault = await admin_obj.index();
            res.status(200).json(resault);
        } catch (e) {
            res.status(400).json(`${e}`);
        }
    }else res.status(400).json('not allowed for you.');
}
    

//return json data for a sungle user [allowed only for admins or user it self]
async function show(req: Request, res: Response) {
    const admin_email = req.headers.email as unknown as string;
    const admin_password = req.headers.password as unknown as string;

    //check if request from super admin 
    if(admin_email_exist === admin_email && admin_password_exist === admin_password){
        try {
            const resault = await admin_obj.show(parseInt(req.params.id));
            if(resault == undefined)
                return res.status(400).json('row not exist');
            return res.status(200).json({user:resault, role:'admin'});
                
        } catch (e) {                
            return res.status(400).json(`${e}`);
        }
    }else res.status(400).json('not allowed for you.');
}
   

/*
return token for updated user [user can update all his data except (coupon_id, status), 
    super admin can update only(coupon_id,status),
    admins can update (coupon_id, status when not == admin)]
    */
async function update(req: Request, res: Response) {
   

    const admin_email = req.headers.email as unknown as string;
    const admin_password = req.headers.password as unknown as string;
    const id = parseInt(req.params.id);

    try {
        const user_ = await admin_obj.show(id);//get user from database with id in request params
        
        if(user_ == undefined)
            return res.status(400).json('row not exist');

        //check if request from super admin 
        if(admin_email_exist == admin_email && admin_password_exist == admin_password){

            if(req.body.full_name)
                user_.full_name=req.body.full_name;
            if(req.body.email)
            {
                user_.email=req.body.email;
            }
            if(req.body.birthday)
                user_.birthday=req.body.birthday;
            if(req.body.phone)
                user_.phone=req.body.phone;
            if(req.body.salary)
                user_.salary=req.body.salary;
            if(req.body.address)
                user_.address=req.body.address;
            if(req.body.status)
                user_.status = req.body.status;
            if(req.body.password)
                user_.password=req.body.password;
            
        }
        else return res.status(400).json('not allowed for you.');

        //update and return the new token of updated user
        const resualt = await admin_obj.update(user_);
        const new_token = jwt.sign({user:resualt},secret);
        res.status(200).json({user:resualt,token:new_token});

    } catch (e) {
        res.status(400).send(`${e}`);
    }
}
//create user by getting user data from request body
async function create(req: Request, res: Response) {

    const admin_email = req.headers.email as unknown as string;
    const admin_password = req.headers.password as unknown as string;
    //create type user with getting data to send to the database
    const u: admin = {
        full_name: req.body.full_name,
        email: req.body.email,
        password: req.body.password,
        birthday: req.body.birthday,
        address: req.body.address,
        phone: req.body.phone,
        status: 'active', //default value when create is active
        created_at: new Date(), //default value when create is date now
        salary: Number(req.body.salary) //delete
    };
        //send user type to the database to create
    try {    
        if(admin_email_exist === admin_email && admin_password_exist === admin_password){            
            const resault = await admin_obj.create(u);
            const token = jwt.sign({ user: resault }, secret,{expiresIn: '7days'});
            res.status(200).json({user:resault,token});
        }else res.status(400).json('not allowed for you.');
    } catch (e) {
        res.status(400).json(`${e}`);
    }
    
}
//return deleted and delete user using id in request params [only user delete it self]
async function delete_(req: Request, res: Response) {

    const admin_email = req.headers.email as unknown as string;
    const admin_password = req.headers.password as unknown as string;

    //check if the request from super admin?

    if (admin_email_exist === admin_email && admin_password_exist === admin_password) {//if token exist and the request params.id == token user.id
        try {
            const resault = await admin_obj.delete(Number(req.params.id)); //delete user from database by id
            res.status(200).json(resault); //return deleted
        } catch (e) {
            res.status(400).json(`${e}`);
        }
    } else 
        res.status(400).json('authentication required or id params wrong.');//else return error
}

//main routes of user model
function mainRoutes(app: Application) {
    
    app.get('/admins', index);
    app.get('/admins/:id', show);
    app.post('/admins', create);
    app.patch('/admins/:id', update);
    app.delete('/admins/:id', delete_);
}

export default mainRoutes;

