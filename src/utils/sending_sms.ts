import Nexmo from 'nexmo';
import config from '../config/config';


const nexmo = new Nexmo({
    apiKey: config.SMS_API_KEY,
    apiSecret: config.SMS_API_SECRET
});


export default function sending_sms(toNumber:string, message:string){
    nexmo.message.sendSms(
        config.number, toNumber, message, {type: 'unicode'},
        (err, responseData) => {if (responseData) {console.log(responseData);}}
    );
}