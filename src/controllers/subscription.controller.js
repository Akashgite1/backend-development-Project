import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    // TODO: toggle subscription

    // get the subscriberId from the request 
    // if the user is not authenticated, req.user will be undefined  
    const subscriberId = req.user?._id

    // check if the channelId and subscriberId are valid ObjectIds in MongoDB 
    if (!isValidObjectId(channelId) || !isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid channel ID")
    }

    // check if the user is trying to subscribe to their own channel
    if (subscriberId.tostring() === channelId.toString()) {
        throw new ApiError(401, "cannot subscribe to your own channel")
    }

    // check if the subscription already exists find the subscription by channelId and subscriberId in the Subscription model 
    const existingSubscription = await Subscription.findOne({
        channelId,
        subscriberId
    })

    // if the subscription exists, delete it
    if (existingSubscription) {
        await Subscription.findByIdAndDelete(existingSubscription._id)
        return res.status(200).json(new ApiResponse(200, "Unsubscribed successfully"))
    }
    // if the subscription does not exist, create a new subscription
    else {
        const newSubscription = await Subscription.create({
            channelId,
            subscriberId
        })
        return res.status(201).json(new ApiResponse(201, newSubscription, "Subscribed successfully"))
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if (!isValidObjectId(channelId)) throw new ApiError(400, "Invalid channel ID")

    const subscribers = await Subscription.find({ channel: channelId }).populate("subscriber", "username email")
    return res.status(200).json(new ApiResponse(200, subscribers))

})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if (!isValidObjectId(subscriberId)) throw new ApiError(400, "Invalid subscriber ID")
    
    // subscriptions is a list of subscriptions where the user is a subscriber amd desciription is populated with channel details
    const subscriptions = await Subscription.find({ subscriber : subscriberId}).populate("channel", "name description")

    // send response with status 200 and subscriptions
    return res.status(200).json(new ApiResponse(200, subscriptions, "Subscribed channels fetched successfully"))

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}