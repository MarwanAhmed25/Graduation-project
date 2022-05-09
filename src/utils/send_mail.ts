import nodemailer from 'nodemailer';
import config from '../config/config';

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: config.user_email,
        pass: config.user_password
    }
});

export default function send_mail(email:string, subject:string, message:string){
    const mailOptions = {
        from: config.user_email,
        to: email,
        subject: subject,
        text:  message
    };
    
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            return 'check your email.';
        }
    });
}