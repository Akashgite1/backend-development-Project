// require('dotenv').config({path: './env.sample'}) --insted
import dotenv from "dotenv"
import connectDB  from "./db/index.js";
// use . dot for single directory and .. for double directory 

import { app } from "./app.js"; // ✅ Importing the already-configured app

dotenv.config({
    path : './.env'
})


connectDB()

.then(()=> {
    // app.listen(process.env.PORT || 8000);
    // console.log("mongodb connection successfull");

    //^ If you place the console.log inside the app.listen callback, it ensures that the message is logged only after the server successfully starts listening.
    //^ Here, console.log("MongoDB connection successful") executes immediately after calling app.listen, even if the server fails to start.
    app.listen(process.env.PORT || 8000, () => {
        console.log(`server is running on port :" ${ process.env.PORT}`);  
    });

    //Now, console.log runs only after the server starts successfully.
    // If app.listen fails, the message won’t be printed, preventing misleading logs.

})
.catch((err)=> {
    // printing the error if with the perticular error printing with the massage 
    console.log("mongodb connection failed", err); 
})



/* 

// import the express for creating the server 
import express from "express";
// import the mongoose for connecting the database 
import mongoose from "mongoose";

const app = express();  // Corrected syntax here

// Making an async IIFE (Immediately Invoked Function Expression)
(async () => {
    try {
        // Corrected MongoDB connection string (removed extra space)
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);

        // Corrected app initialization
        app.on("error", (error) => {
            console.log("ERROR: ", error);
            throw error;
        });

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        });

    } catch (error) {
        console.log("ERROR: ", error);
        throw error;
    }
})();

*/