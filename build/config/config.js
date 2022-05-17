"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config_ = {
    PORT: process.env.PORT || 5000,
    DATABASE_URL: process.env.DATABASE_URL || 'postgres://yaeobcniqomegb:77ed86befd3929c5ec5bab3e5a3d13b0082ed1e58243b4a15e34a27a1836558a@ec2-52-18-116-67.eu-west-1.compute.amazonaws.com:5432/d4c0lbm1rr34tg',
    admin_email: process.env.admin_email || 'marwan@gmail.com',
    admin_password: process.env.admin_password || 'marwan',
    extra: process.env.extra || 'marwan',
    round: process.env.round || 5,
    token: process.env.token || 'lkdfg',
    user_email: process.env.user_email || 'marooa305@gmail.com',
    user_password: process.env.user_password || 'Marooo4125881',
    SMS_API_KEY: '4f5c46bd',
    SMS_API_SECRET: 'tWSf7jTvFba51QN2',
    number: '01282783116'
};
exports.default = config_;
