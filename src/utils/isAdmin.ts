import dotenv from 'dotenv';
import parseJwt from './jwtParsing';
import jwt from 'jsonwebtoken';
import config_ from '../config/config';

dotenv.config();
const admin_email = config_.admin_email as unknown as string;
const admin_password = config_.admin_password as unknown as string;
const secret = config_.token as unknown as string;


//return true if the token or the email and passwrod for super admin or admin 
function isAdmin(email:string, password:string, token:string):boolean{
   
    if(email == admin_email && password == admin_password){
        return true;
    }else {//if token exist make sure that the token for an admin user
        try {
            const permession = jwt.verify(token, secret as string);

            if(permession ){
                const user = parseJwt(token);
                //console.log(user.user);
                
                if(user.user.admin_id)
                    return true;
            }
        } catch (error) {
            throw new Error('token invalid.');
        }
        
    }
    return false;
}

export default isAdmin;