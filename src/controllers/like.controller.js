import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video

    const userId = req.user._id;

    // check if user has already liked the video
    const exitstngLike = await Like.findOne({video : videoId, likedBy: userId})

    if(exitstngLike) {
        // if the like exists, remove it
        await Like.deleteOne({video: videoId, likedBy: userId})
        return res.status(200).json(new ApiResponse(200, {}, "Like removed successfully")) 
    }

    // else create a new like
    const like = await Like.create({video : videoId, likedBy: userId})

    // return the response
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,{like}, // sending the like object
            "Like added successfully" // message
        )
    )

})


const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    
    // get the user id from the request
    const userId = req.user._id; 

    const exitstngLike = await Like.findOne({Commnet: commentId, likedBy: userId})// check if the user has already liked the comment 
    
    // if the like exists, remove it
    if(exitstngLike) {
        await existingLike.delteOne();
        return res.sttus(200).json(new ApiResponse(200, null, "comment like removed successfully"))
    }

    // else create a new like
    const like = await Like.create({Comment: commentId, likedBy: userId})

    // return the response
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            like,
            "Comment like added successfully" // message
        )
    )

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    
    // get the user id from the request
    const userId = req.user._id
    
    // hold the existing like if it exists in variable existingLike
    const existingLike = await Like.findOne({tweet: tweetId, likedBy: userId})

    // check if the like exists 
    if(existingLike) {
        // if the like exists, remove it
        await existingLike.deleteOne();
        // send response that the like has been removed
        return res.status(200).json(new ApiResponse(200, null, "Tweet like removed successfully"))
    }

    // if not then create a new like for the tweet
    const like = await Like.create({tweet: tweetId, likedBy: userId})

    // return the response
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            like,
            "Tweet like added successfully" // message
        )
    )

})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    // get the user id from the request
    const userId = req.user._id;

    // find all liked by user that are related to videos 
    const likes = await Like.find({likedBy: userId, video: {$ne : null}})
    .populate("video") // Get full video details 
    .select("video -_id") // select only video field and exclude _id (-) used to exclude the fields example -video so this will exclude the video field

    const likedVideo = likes.map(like => like.video)

    // return the response
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            likedVideo, // data
            "Liked videos fetched successfully" // message
        )
    )

})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}