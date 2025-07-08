import mongoose, { Schema } from "mongoose";


const likeSchema = new Schema(
    {
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video", // references the Video model
        },
        Comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment", // references the Comment model
        },  
        tweet: {
            type: Schema.Types.ObjectId,
            ref: "Tweet", // references the Tweet model
        },
        likedBy: {
            type: Schema.Types.ObjectId,
            ref: "User", // references the User model
        }
    },{timestamps : true}

);

export const Like = mongoose.model("Like",likeSchema)