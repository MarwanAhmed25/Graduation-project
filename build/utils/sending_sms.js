"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nexmo_1 = __importDefault(require("nexmo"));
const config_1 = __importDefault(require("../config/config"));
const nexmo = new nexmo_1.default({
    apiKey: config_1.default.SMS_API_KEY,
    apiSecret: config_1.default.SMS_API_SECRET
});
function sending_sms(toNumber, message) {
    nexmo.message.sendSms(config_1.default.number, toNumber, message, { type: 'unicode' }, (err, responseData) => { if (responseData) {
        console.log(responseData);
    } });
}
exports.default = sending_sms;
