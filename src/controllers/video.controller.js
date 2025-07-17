import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiErrors} from "../utils/APIErros.js"
import {ApiResponse} from "../utils/APiResponce.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadFile} from "../utils/cloudinary_File_upload.js"



const getAllVideos = asyncHandler(async (req, res) => {
    // get query parameters for pagination, sorting, and filtering
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    
    const filter = {
        title:{ $regex: query, $options: "i"}
    }

    if(userId && isValidObjectId(userId)) {
        filter.user = userId
    }
    

    const videos = await Video.find(filter)
        .sort({ [sortBy]: sortType === "asc" ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))

    // send response with status 200 and videos
    return res.status(200).json(new ApiResponse(200, videos, "Videos fetched successfully"))    
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    const ownerId = req.user?._id

    // check if they exist
    if(!req.file || !req.files.video) {
        throw new ApiErrors(400, "Video file is required")
    }

    // upload video to cloudinary
    const videoUrl = await uploadFile(req.files.video.tempFilePath, "video")

    //check if the videoUrl is valid
    if(!videoUrl) {
        throw new ApiErrors(500, "Failed to upload video")
    }

    // create a new video document
    let thumbnailUrl = null
    if(req.files.thumbnail){
        const thumbnailUpload = await uploadFile(req.files.thumbnail.tempFilePath, "image")
        thumbnailUrl = thumbnailUpload?.url || null
    }

    const newVideo = await Video.create({
        title,
        description,
        videoUrl ,
        thumbnailUrl,
        duration: req.body.duration || 0, // duration can be optional
        user: ownerId
    })

    // send the response with status 201 and the new video
    return res.status(201).json(new ApiResponse(201, newVideo, "Video published successfully"))
})

// get video by id
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    if(!isValidObjectId(videoId)) {
        throw new ApiErrors(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId).populate("user", "username email avatar")

    if(!video) {
        throw new ApiErrors(404, "Video not found")
    }
    
    // send response with status 200 and video
    return res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    
    const userId = req.user?._id; 

    if(!isValidObjectId(videoId)) {
        throw new ApiErrors(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId); 
    if(!video) {
        throw new ApiErrors(404, "Video not found")
    }

    // check if the user is user is authorized to update the video or not by comparing userId with video.user
    if(video.user.toString() !== userId.toString()) {
        throw new ApiErrors(403, "You are not authorized to update this video")
    }
    
    // get the thing that user wants to update
    const { title, description} = req.body

    // update the video
    if(title) {
        video.title = title
    }
    if(description) {
        video.description = description
    }
    if(req.files?.thumbnail) {
        const thumbnailUpload = await uploadFile(req.files.thumbnail.tempFilePath, "image")
        video.thumbnailUrl = thumbnailUpload?.url || null
    }
    
    // save the video
    await video.save()

    // send response with status 200 and updated video
    return res.status(200).json(new ApiResponse(200, video, "Video updated successfully")) 

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    const userId = req.user?._id;

    if(!isValidObjectId(videoId)) {
        throw new ApiErrors(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId);
    if(!video) {
        throw new ApiErrors(404, "Video not found")
    }

    // check if the user is authorized to delete the video or not by comparing userId with video.user
    if(video.user.toString() !== userId.toString()) {
        throw new ApiErrors(403, "You are not authorized to delete this video")
    }

    // delete the video
    await Video.findByIdAndDelete(videoId)

    // send response with status 200 and success message
    return res.status(200).json(new ApiResponse(200, null, "Video deleted successfully"))

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const userId = req.user?._id;

    if(!isValidObjectId(videoId)) {
        throw new ApiErrors(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId);

    if(!video) {
        throw new ApiErrors(404, "Video not found")
    }

    // check if the user is authorized to toggle publish status or not by comparing userId with video.user
    if(video.user.toString() !== userId.toString()) {
        throw new ApiErrors(403, "You are not authorized to toggle publish status of this video")
    }

    // toggle the publish status
    video.isPublished = !video.isPublished
    // save the video
    await video.save()

    // send response with status 200 and updated video
    return res.status(200).json(new ApiResponse(200, video, `Video ${video.isPublished ? "published" : "unpublished"} successfully`))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}