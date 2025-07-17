import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiErrors } from "../utils/APIErros.js";
import { ApiResponse } from "../utils/APiResponce.js"
import { asyncHandler } from "../utils/asyncHandler.js"



const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query // default pagination values means page 1 and 10 comments per page is assumed 


    const comments = await Comment.find({ video: videoId })
        .skip()((page - 1) * limit) // skip the first (page - 1) * limit comments 
        .limit(parseInt(limit)) // convert limit to integer
        .sort({ createdAt: -1 }) // sort by createdAt in descending order
        .populate("user", "username profilePicture") // populate user details

    // Check if comments exist if not throw an error 
    if (!comments) {
        throw new ApiErrors(404, "No comments found for this video")
    }

    // Return the comments in a paginated format
    return res
        .status(200)
        .json(new ApiResponse(200, comments, "Comments fetched successfully"))

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params // params give the videoId from the URL 
    const { content } = req.body // body gives the content of the comment text 

    if (!content) {
        throw new ApiErrors("Comment content is required", 400)
    }

    const comment = new Comment({
        content,
        video: videoId,
        user: req.user._id // assuming req.user is populated with the authenticated user's details
    })

    await comment.save() // save the comment to the database
    return res.status(200).json(new ApiResponse(200, comment, "Comment added successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params // get the commentId from the URL 
    const { content } = req.body // get the content of the comment from the body

    const comment = await Comment.findById(commentId) // find the comment by id

    if (!comment) {
        throw new ApiErrors(400, "Comment not found")
    }

    // Check if the user is authorized to update the comment by comparing the user id of the comment with the user id of the authenticated user
    if (comment.user.toString() !== req.user._id.toString()) {
        throw new ApiErrors(403, "You are not authorized to update this comment")
    }
    
    // Update the comment content
    comment.content = content // update the content of the comment
    
    // Save the updated comment in the database save() is function of mongoose model to 
    // save the updated comment to the database
    await comment.save() // save the updated comment to the database
    
    // Return the updated comment in the response 
    return res.status(200).json(new ApiResponse(200, comment, "Comment updated successfully"))

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params // get the commentId from the URL

    // Find the comment by id 
    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiErrors(400, "Comment not found connot be deleted")
    }

    // Check if the user is authorized to delete the comment by comparing the user id of the comment with the user id of the authenticated user
    if (comment.user.toString() !== req.user._id.toString()) {
        throw new ApiErrors(403, "You are not authorized to delete this comment")
    }

    // Delete the comment from the database using mongoose's deleteOne method
    // deleteOne is a mongoose method to delete a document from the database 
    await Comment.deleteOne();

    // Return a success message in the response
    return res.status(200).json(new ApiResponse(200, null, "Comment deleted successfully"))

})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}