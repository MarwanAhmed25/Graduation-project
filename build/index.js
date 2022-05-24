"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const auth_1 = __importDefault(require("./handlars/auth"));
const users_1 = __importDefault(require("./handlars/users"));
const types_1 = __importDefault(require("./handlars/types"));
const links_1 = __importDefault(require("./handlars/links"));
const comments_1 = __importDefault(require("./handlars/comments"));
const charity_1 = __importDefault(require("./handlars/charity"));
const admins_1 = __importDefault(require("./handlars/admins"));
dotenv_1.default.config();
//initial port and app
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
//usig middel ware cors and body parser
//app.use(cors());
app.use((0, cors_1.default)({ origin: '0.0.0.0:0' }));
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
//configre the server to listen to port and running it
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
app.get('/', (req, res) => {
    res.send('hello');
});
(0, users_1.default)(app);
(0, types_1.default)(app);
(0, links_1.default)(app);
(0, comments_1.default)(app);
(0, charity_1.default)(app);
(0, admins_1.default)(app);
(0, auth_1.default)(app);
//export the app to use when importing the file
exports.default = app;
