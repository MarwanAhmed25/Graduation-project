"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config/config"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: config_1.default.user_email,
        pass: config_1.default.user_password
    }
});
function send_mail(email, subject, message) {
    const mailOptions = {
        from: config_1.default.user_email,
        to: email,
        subject: subject,
        text: message
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Email sent: ' + info.response);
            return 'check your email.';
        }
    });
}
exports.default = send_mail;
