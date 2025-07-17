import express from 'express'; 
// importing cors and cookie-parser 
// cors help to connect the frontend and backend by allowing the request from the frontend 
import cors from 'cors';
import cookieParser from 'cookie-parser';

// creating the express app or the variable
const app = express(); 

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// get the data from the frontend 
// wen can also set the limit for the data 
app.use(express.json({limit: '16kb'})); 
// get the data from url 
app.use(express.urlencoded({ extended: true , limit : '16kb'})); 
app.use(express.static('public'));
app.use(cookieParser()); 

// importing the routes
import userRoutes from './routes/user.routes.js'
import healthcheckRouter from './routes/healthcheck.route.js';
import commentRouter from './routes/comment.route.js'
import dashboardRouter from './routes/dashboard.route.js';
import playlistRouter from './routes/playlist.route.js';
import videoRouter from './routes/video.route.js';
import tweetRouter from './routes/tweet.route.js';
import SubscriptionRouter from './routes/subscription.route.js' 


// routes declaration with the prefix /api/v1/user is a standard practice 
// to version the API and keep it organized
app.use("/api/v1/user" , userRoutes);
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/video", videoRouter);
app.use("/api/v1/tweet", tweetRouter);
app.use("/api/v1/subscription", SubscriptionRouter);


// http://localhost:5000/api/v1/user/register
export {app}