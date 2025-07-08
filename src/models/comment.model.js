import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema(
    {
        content:{
            type: String,
            required: true, // ensures that the content is provided
        },
        video:{
            type: Schema.Types.ObjectId,
            ref: "Video", // references the Video model
        },
        owner:{
            type: Schema.Types.ObjectId,
            ref: "User", // references the User model
            required: true, 
        }
    }
)


commentSchema.plugin(mongooseAggregatePaginate); // Add pagination plugin to the schema

export const Comment = mongoose.model("Comment", commentSchema); // Export the Comment model
// This model can be used to interact with the comments collection in the MongoDB database.