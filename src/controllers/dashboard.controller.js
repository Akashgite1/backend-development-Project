import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiErrors} from "../utils/APIErros.js"
import {ApiResponse} from "../utils/APiResponce.js"
import {asyncHandler} from "../utils/asyncHandler.js"



const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    
    // get user it from database 
    const userId = req.user._id;

    // count the total number of videos uploaded by the user
    const totalVideos = await Video.countDocuments({owner: userId})

    const videoStats = await Video.aggregate([
        // get the total views of all videos uploaded by the user
        //! objectId is now is old now new function called inputId by mongoose
        {$match : {owner: new mongoose.Types.inputId(userId)}},
        // group by null to get total views this will return an array with a single object containing total views like {totalViews: 1000}
        {$group:{_id : null, totalViews: {$sum: "$views"}}}
    ])

    // get the total view 
    const totalViews = videoStats[0]?.totalViews || 0;

    // get the total number of subscribers
    const totalSubscribers = await Subscription.countDocuments({channel : userId})
         

    const userVideos = await Video.find({owner: userId}).select("-id")// select all fields except id 
    const videosIds = userVideos.map(video => video._id) // get the ids of the videos uploaded by the user

    // get the total number of likes on the videos uploaded by the user
    const totalLikes = await Like.countDocuments({video:{$in: videoIds}}) // videoIds is an array of video ids used $in operator to match any of the video ids

    // send the response 
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,{
                // sending data 
                totalVideos,
                totalViews,
                totalSubscribers,
                totalLikes,
            }, // message
            "Channel stats fetched successfully"
        )
    )

})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const userId = req.user._id;

    // get all the videos uploaded by the user
    const videos = await Video.find({owner : userID})
    .sort({cretedat : -1}) // sort the videos by created at date in descending order
    .select("-__v") // select all fields except id

    // send the response 
    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            videos, // data
            "Channel videos fetched successfully" // message
        )
    )
})

export {
    getChannelStats, 
    getChannelVideos
}