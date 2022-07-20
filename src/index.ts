import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import auth from './handlars/auth';
import usersRoutes from './handlars/users';
import typesRoutes from './handlars/types';
import linksRoutes from './handlars/links';
import commentsRoutes from './handlars/comments';
import charityRoutes from './handlars/charity';
import adminsRoutes from './handlars/admins';
import paymentRoute from './handlars/volanteer_history';
dotenv.config();

//initial port and app
const PORT = process.env.PORT ||5000;
const app = express();
//usig middel ware cors and body parser
//app.use(cors());
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

//configre the server to listen to port and running it
app.listen(PORT, (): void => {
    console.log(`server running on port ${PORT}`);
});

app.get('/',(req,res)=>{
    res.send('hello');
});

usersRoutes(app);
typesRoutes(app);
linksRoutes(app);
commentsRoutes(app);
charityRoutes(app);
adminsRoutes(app);
paymentRoute(app);
auth(app);
//export the app to use when importing the file
export default app;
