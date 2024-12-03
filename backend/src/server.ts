import express , {Request, Response, NextFunction} from 'express';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import morgan from 'morgan';
import path from 'path';
import cors from 'cors';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import connect from './db/connect';
import errorHandler from './middleware/error';
import fs from "node:fs";
import authRoute from './routes/authRoute'
dotenv.config();

const app = express();

//test route

app.get('/',(req:Request,res: Response) =>{
    res.send("Hello from Task Manager!!!")
})

//middleware
if(process.env.NODE_ENV==="development"){
    app.use(morgan("dev"))
}
app.use(bodyParser.json({limit:"5mb"}))
app.use(
    bodyParser.urlencoded({
        limit: "5mb",
        extended: true
    })
);
app.use(cookieParser());
app.use(cors());
//prevent SQL injection
app.use(ExpressMongoSanitize());
//adding security headers
app.use(
    helmet.contentSecurityPolicy({
        useDefaults: true,
        directives:{
            'img-src': ["'self'","https: data:"]
        }
    })
)

//limit queries per 15mn
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15 mins
    max: 100, //limit each IP to 100 reqs per 'window' 
    standardHeaders: true, //return rate limit info in `RateLimit . * ` headers
    legacyHeaders: false, //disable x-RateLimit-* headers
});
app.use(limiter);

//routes middle ware

app.use('/api/v1', authRoute)
/** 
const routeFiles = fs.readdirSync("./routes");

routeFiles.forEach((file) => {
  // use dynamic import
  import(`./routes/${file}`)
    .then((route) => {
      app.use("/api/v1", route.default);
    })
    .catch((err) => {
      console.log("Failed to load route file", err);
    });
});
*/

//error middleware

app.use(errorHandler)
//listen to server
const port:number = parseInt(process.env.PORT as string) || 8000;

const server = async () =>{
    try {
        await connect();
        app.listen(port, ():void =>{
            console.log(`Server listening on port: ${port}`)
        })
    } catch (error:any) {
        console.log("Failed to strt server.....", error.message);
        process.exit(1);
    }
}
server();



