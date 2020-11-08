import express from 'express';
import http from 'http';
import {connect} from './websocket';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv'; 

import environment from './environment';
import userRoute from './route/user';
import chatRoute from './route/chat';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = connect(server);

mongoose.connect(
  `mongodb+srv://martrohel:${process.env.MONGODB_PASS}@cluster0-sutr8.gcp.mongodb.net/chatApp?retryWrites=true&w=majority`,
  { useUnifiedTopology: true, useNewUrlParser: true }
);
app.use(cors({
  origin: 'https://chitty-app.vercel.app',
  credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
    res.status(200).json({
        message: "get request succeffully made"
    });
})

app.use('/user', userRoute);
app.use('/chat', chatRoute);

const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`The server is running on port ${port}`));