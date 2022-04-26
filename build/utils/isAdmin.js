"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const jwtParsing_1 = __importDefault(require("./jwtParsing"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const admin_email = process.env.admin_email;
const admin_password = process.env.admin_password;
const secret = process.env.token;
//return true if the token or the email and passwrod for super admin or admin 
function isAdmin(email, password, token) {
    if (email == admin_email && password == admin_password) {
        return true;
    }
    else { //if token exist make sure that the token for an admin user
        try {
            const permession = jsonwebtoken_1.default.verify(token, secret);
            if (permession) {
                const user = (0, jwtParsing_1.default)(token);
                if (user.user.status == 'admin')
                    return true;
            }
        }
        catch (error) {
            throw new Error('token invalid.');
        }
    }
    return false;
}
exports.default = isAdmin;
