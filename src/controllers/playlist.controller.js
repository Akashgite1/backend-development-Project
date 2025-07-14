import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist
    const user = req.user?._id

    if( !name) {
        throw new ApiError(400, "Name and description are required")
    }

    // create a new playlist 
    // playlist.create() is a mongoose method to create a new document
    // which takes name and description as parameters and link it to the user
    const playlist = await playlist.create({name , description, user})
    // send the response back to the client with the created playlist
    return res.status(201).json(new ApiResponse(201, playlist, "Playlist created successfully"))

})


const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    
    // isValidObjectId is a mongoose method Returns true if the given value is a Mongoose ObjectId
    if(!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID")
    }
    
    // Playlist.find() is a mongoose method to find all documents in the collection
    // populate is a mongoose method used for 
    const playlists = await Playlist.find({owner: userId}).populate("videos")

    // check if the playlist exists or not
    if(!playlists || playlists.length === 0) {
        throw new ApiError(404, "No playlists found for this user")
    }

    // send the response back to the client with the playlists
    return res.status(200).json(new ApiResponse(200, playlists, "Playlists fetched successfully"))
})

// get a playlist by id
const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    
    // isValidObjectId is a mongoose method Returns true if the given value is a Mongoose ObjectId
    if(!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID")
    }

    // Playlist.findById() is a mongoose method to find a document by id
    const playlist = await playlist.findById(playlistId).populate("videos")
    
    // send the response
    return res.status(200).json(new ApiResponse(200, playlist, "Playlist fetched successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    
    // check if the playlistId and videoId are valid ObjectIds
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist or video ID")
    }

    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }
    
    // check if the video already exists in the playlist
    // video.includes() is a method to check if the videoId is already in the playlist 
    if(playlist.videos.includes(videoId)){
        throw new ApiError(409, "video already exists in the playlist")
    }

    // if not then add the video to the playlist
    // add videoId in the playlist document 
    playlist.videos.push(videoId)
    // the the playlist document 
    await playlist.save()

    // send the response back to the client with the updated playlist
    return res.status(200).json(200, playlist, " Video Added Successfully ")
})

// remove video from playlist 
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

    // check if the playlistid and videoId are valid ObjectIds
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist or video ID")
    }
    
    const playlist = await playlist.findById(playlistId)
    // check if the playlist exists or not
    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }

    // if it exists then remove the video from the playlist
    // videoId is removed from the playlist.videos array
    playlist.videos = playlist.videos.filter(video => video.toString() !== videoId) 
    // save the playlist document
    await playlist.save()

    // send the response back to the client with the updated playlist
    return res.status(200).json(new ApiResponse(200, playlist, "Video removed from playlist successfully"))
})

// delete a playlist 
const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist

    // check if the playlistId is a valid ObjectId
    if(!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID")
    }

    const playlist = await Playlist.findByIdAndDelete(playlistId)

    // check if the playlist exists or not if not then throw an error
    if(!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    // send the response back to the client with the deleted playlist
    return res.status(200).json(new ApiResponse(200, playlist, "Playlist deleted successfully"))

})

// change the name and description of the playlist
const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body 
    //TODO: update playlist

    // check if the playlistId is a valid ObjectId
    if(!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID")
    }

    // hold the playlist document
    const playlist = await Playlist.findById(playlistId)

    // check if the playlist exists or not
    if(!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    // update the playlist name and description
    if(name) {
        playlist.name = name
    }
    // if it exists then update with user input new name and description
    if(description) {
        playlist.description = description
    }

    // save the playlist document
    await playlist.save()

    // send the response back to the client with the updated playlist
   return res.status(200).json(new ApiResponse(200, playlist,"Playlist updated successfully"))

})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}