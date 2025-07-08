import mongoose, { Schema } from "mongoose";

const playlistSchema = new Schema(
    {
        name: {
            type: String,
            required: true, // ensures that the name is provided
        },
        description: {
            type: String,
            required: true, // ensures that the description is provided
        },
        videos: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video", // references the Video model

            }
        ],
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User", // references the User model
            required: true, // ensures that the owner is provided
        },
        
    }, { timestamps: true }
)

export const Playlist = mongoose.model("Playlist", playlistSchema);