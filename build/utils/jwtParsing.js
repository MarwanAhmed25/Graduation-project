"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_decode_1 = __importDefault(require("jwt-decode"));
//convert the token to the source user data
function parseJwt(token) {
    const x = (0, jwt_decode_1.default)(token);
    const user = JSON.parse(JSON.stringify(x));
    return user;
}
exports.default = parseJwt;
