// require('dotenv').config({path: './env.sample'}) --insted
import dotenv from "dotenv"
import connectDB  from "./db/index.js";
// use . dot for single directory and .. for double directory 

dotenv.config({
    path : './env'
})


connectDB()





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