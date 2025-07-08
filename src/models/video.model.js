import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const videoSchema = new Schema(
    {
        videoFile: {
            type : String,
            required: true,
            trim: true, // removes whitespace from both ends of the string
            unique: true, // ensures that the video file is unique
        },
        thubnail:{
            type:String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        duration: {
            type: String,
            required: true,
        },
        views: {
            type: Number,
            default: 0, // initializes views to 0
        },
        isPublished: {
            type: Boolean,
            default: false, // initializes isPublished to false
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User", // references the User model
            required: true, // ensures that the owner is provided
        },

    },
    {
        timestamps: true,
    }
);

videoSchema.plugin(mongooseAggregatePaginate);
 
export const Video = mongoose.model("Video", videoSchema);

