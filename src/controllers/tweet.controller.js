import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

// create a new tweet
const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    // get the content of the tweet from the request body
    const { content } = req.body
    // get the userId from the request
    const userId = req.user?._id

    // check if the content exists and is not empty
    if(!content) {
        throw new ApiError(400, "Content is required")
    }
    
    // create a new tweet with the content and userId using the Tweet model in mongodb
    const tweet = await Tweet.create({
        content,
        user: userId
    })

    // return the created tweet with status 201
    return res.status(201).json(new ApiResponse(201, tweet, "Tweet created successfully"))

})

// get tweets of a specific user 
const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const { userId } = req.params

    // check if the userId is a valid ObjectId in MongoDB
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID")
    }
     
    // find the user by userId in the database 
    // tweets are list of tweets created by the user in descending order of creation time
    const tweets = await Tweet.find({ user: userId }).sort({createdAt: -1})

    // return the tweets with status 200
    return res.status(200).json(new ApiResponse(200, tweets, "User tweets fetched successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params
    const { content } = req.body
    const userId = req.user?._id

    // check if the tweetId is a valid ObjectId in MongoDB
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID")
    }
    
    // hold the tweet to be updated
    const tweet = await Tweet.findById(tweetId)

    if(!tweet) {
        throw new ApiError(404, "Tweet not found")
    }
    // check if the user is author of the tweet to modify it or not
    if(tweet.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to update this tweet")
    }

    // update the tweet content with user provided content
    tweet.content = content || tweet.content

    // save the updated tweet
    await tweet.save()

    // return the updated tweet with status 200
    return res.status(200).json(new ApiResponse(200, tweet, "Tweet updated successfully"))

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    // get the tweetId from the request parameters
    const { tweetId } = req.params
    // get the userId from the request
    const userId = req.user?._id

    // check if the exist 
    if(!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID")
    }

    // hold the tweet to be deleted
    const tweet = await Tweet.findById(tweetId)

    // check if the tweet exists
    if(!tweet) {
        throw new ApiError(404, "Tweet not found")
    }
    // check if the user is author of the tweet to delete it or not
    if(tweet.user.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to delete this tweet")
    }

    // delete the tweet
    await Tweet.findByIdAndDelete(tweetId)

    // return the response with status 200
    return res.status(200).json(new ApiResponse(200, null, "Tweet deleted successfully"))
    
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}