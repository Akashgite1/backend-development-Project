import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiErrors } from '../utils/APIErros.js';
import { User } from '../models/user.model.js';
import { uploadFile } from '../utils/cloudinary_File_upload.js';
import { ApiResponse } from '../utils/APiResponce.js';
import jwt from 'jsonwebtoken';
import { application } from 'express';
import mongoose from 'mongoose';


// creating methods for genarating access token and refresh token 
const generateAccessAndRefreshTokens = async (userId) => {
    // this function will generate access token and refresh token for the user
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiErrors(404, "User not found");
        }
        // generate access token
        const accessToken = user.generateAccessToken();
        // generate refresh token
        const refreshToken = user.generateRefreshToken();

        // save the refresh token in the user document add in database 
        // so we dont have to generate new refresh token every time user logs in
        user.refreshToken = refreshToken;
        // save the user document with the new refresh token
        // this will update the user document with the new refresh token
        await user.save({ validateBeforeSave: false });

        // return the tokens
        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiErrors(500, "Error generating tokens");
    }
}


// use export direct her to export the function for other files 
const registerUser = asyncHandler(async (req, res) => {
    // Logic for registering a user
    // get the user details from frontend 
    // validatation - not empty
    // check if the user already exists : username or email
    // check for image , check for avatar 
    // upload the image to cloudinary 
    // create the user object - create entry in the database 
    // remove the password and refresh token filed from response 
    // check for user creation 
    // return response 

    // req.body // this is the body of the request from the frontend
    const { fullName, email, userName, password } = req.body;
    console.log("email : ", email);
    console.log(req.body);

    // check if the user details are not empty
    // if any of the field is empty then throw an error with status code 400
    if ([fullName, email, userName, password].some(field => !field)) {
        throw new ApiErrors(400, "All fields are required");
    }

    // check if the user already exists in the database
    // $ or is used to check multiple conditions her we are checking if the username or email already exists
    const exitUser = await User.findOne({
        $or: [{ userName }, { email }]
    })
    console.log("exitUser : ", exitUser);


    // condition using 
    if (exitUser) {
        throw new ApiErrors(400, "User already exists with this username or email");
    }
    console.log("req.files : ", req.files);

    // 1️⃣   Make sure files exist if not then throw an error with status code 400
    if (!req.files || !req.files.avatar || req.files.avatar.length === 0) {
        throw new ApiErrors(400, "Avatar file is required");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path // this is the path of the cover image uploaded by the user 


    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }


    // upload the avatar image to cloudinary
    const avatar = await uploadFile(avatarLocalPath);
    // upload the cover image to cloudinary
    const coverImage = await uploadFile(coverImageLocalPath);

    if (!avatar) {
        throw new ApiErrors(400, "Avatar image upload failed");
    }

    // make an object to create the database entry 
    const user = await User.create({
        fullName,
        avatar: avatar.url, // this is the url of the avatar image uploaded to cloudinary
        coverImage: coverImage?.url || "", // this is the url of the cover image uploaded to cloudinary
        email,
        password, // this will be hashed in the user model
        userName: userName.toLowerCase(), // this will be converted to lowercase 

    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" // this will remove the password and refreshToken fields from the response
    )

    // check if the user is created successfully
    if (!createdUser) {
        throw new ApiErrors(500, "User creation failed");
    }

    // return the response with status code 201
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

})


// create an object to export the function so we have to
// import the object userController in the routes file then
// if we have to use this function registerUser then we can use it like
// userController.registerUser first the name of the object then the function name


// create login for user 
const loginUser = asyncHandler(async (req, res) => {
    // writing to_do for login user 
    // username or email
    // find the user in the database
    // check if the password is correct
    // generate the access token and refresh token
    // send cookies to the browser


    // get the user details from frontend
    const { email, userName, password } = req.body;

    if (!(userName || email)) {
        throw new ApiErrors(400, "Username and password is required");
    }

    // check if the user exists in the database username or email exists
    // if the user exists then we will get the user object otherwise it will be null
    const user = await User.findOne({
        // passing array inside the object for OR operator
        $or: [{ userName }, { email }]
    })

    if (!user) {
        throw new ApiErrors(400, "User not found with this username or email");
    }
    // check if the password is correct
    // user is local variable and User is given by mongoose
    const isPasswordValid = await user.isPasswordCorrect(password); // true or false

    if (!isPasswordValid) {
        throw new ApiErrors(401, "Invalid password");
    }

    // get access token and refresh token from the declared function 
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)


    const loggedInUser = await User.findById(user._id).select("-password -refreshToken") // this will remove the password and refreshToken fields from the response

    // send the access token and refresh token as cookies 
    const cookieOptions = {
        httpOnly: true, // this will make the cookie inaccessible to JavaScript's Document.cookie API
        secure: process.env.NODE_ENV === 'production', // this will make the cookie secure in production environment
        //    sameSite: 'strict', // this will prevent CSRF attacks
        //    maxAge: 24 * 60 * 60 * 1000, // this will set the cookie to expire in 24 hours
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("freshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200, {
                loggedInUser, accessToken, refreshToken
            },
                "User logged in successfully"
            )
        )

})

// writing logout for the user
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            // set is used to update the document provided by the mongoose
            // or use unset to mark the field as empty 
            $unset: {
                refreshToken: 1 // this will set the refresh token to empty string
            }
        },
        {
            new: true, // this will return the updated document
        }
    )

    // clear the cookies from the browser
    const cookieOptions = {
        httpOnly: true, // this will make the cookie inaccessible to JavaScript's Document.cookie API
        secure: process.env.NODE_ENV === 'production', // this will make the cookie secure in production environment
        //    sameSite: 'strict', // this will prevent CSRF attacks
        //    maxAge: 24 * 60 * 60 * 1000, // this will set the cookie to expire in 24 hours
    }

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("freshToken", cookieOptions)
        .json((new ApiResponse(200, null, "User logged out successfully"))
        )

})

// update the user acess token using refresh token
// this will be used when the access token is expired and we need to generate a new access
// token using the refresh token
const refreshAccessToken = asyncHandler(async (req, res) => {

    // get the refresh token from the cookies if anyone is using mobile then we use 
    // || and use req.body to get the refresh normally we get from cookies
    const icomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!icomingRefreshToken) {
        throw new ApiErrors(401, "Unauthorized, request");
    }

    // incoming token is now converted into decoded token
    // this will verify the token and return the decoded token if the token is valid
    try {
        const decodedToken = jwt.verify(icomingRefreshToken, REFRESH_TOKEN_SECRET)

        // find the user by id from the decoded token
        // besically providing the decoded user id so we can check user details in the database
        const user = await User.findById(decodedToken?._id)

        // if the user does not found in the database then its not registered at first place
        // so we can not generate a new access token so we throw an error
        if (!user) {
            throw new ApiErrors(404, "User not found");
        }

        // match the imcoming refresh token with the user refresh token
        if (user.refreshToken !== icomingRefreshToken) {
            throw new ApiErrors(401, "Refresh token is expired or used ");
        }

        // if both match then we generate a new access token
        const cookieOptions = {
            httpOnly: true, // this will make the cookie inaccessible to JavaScript's Document.cookie API
            secure: true, // this will make the cookie secure in production environment
        }

        // get the access and refresh tokens using the function we created earlier
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

        return res
            .status(200)
            // pass the access token and refresh token as cookies
            // so that the browser can store them and use them for future requests
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("freshToken", newrefreshToken, cookieOptions)
            .json(new ApiResponse
                (200,  // response code
                    {
                        accessToken, refreshToken: newrefreshToken // data
                    }, "Access token refreshed successfully" // msg
                )
            )
    }
    catch (error) {
        throw new ApiErrors(401, error?.message || "invalid refresh token");
    }

})

// change the current user password
const changeCurrentPassword = asyncHandler(async (req, res) => {

    // get the old and new password from user using req.body
    const { oldPassword, newPassword } = req.body;

    // find the user by id from the request object
    const user = await User.findById(req.user._id);

    // check the password using the isPasswordCorrect method
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    // if return true then we can change the password else we throw an error
    if (!isPasswordCorrect) {
        throw new ApiErrors(401, "Old password is incorrect");
    }

    // change the password
    user.password = newPassword; // this will hash the password in the user model

    // save the password in the database 
    await user.save({ validateBeforeSave: false })

    // return res.status(200).json(
    return res.status(200).json(
        new ApiResponse(200, null, "Password changed successfully")
    )

})

// get the current user details
const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, req.user, "Current user fetched successfully")
    )
})

const updateAccountDetails = asyncHandler(async (req, res) => {

    // update information get from user by req.body
    const { fullName, email } = req.body

    // check if the files are empty
    if (!fullName || !email) {
        throw new ApiErrors(400, "All fields are required");
    }

    // update the user details in the database
    User.findById(
        req.user?._id,
        {
            $set: {
                fullName: fullName,
                email: email,
            }

        },
        {
            new: true // this will return the updated document
        }).select("-password")
    // ? marks is optional chaining operator, it will return undefined if user is not defined

    return res.status(200).json(
        new ApiResponse(200, req.user, "User details updated successfully")
    )
})

// Update The User Avatar Image
const updateUserAvatar = asyncHandler(async (req, res) => {

    // this is the path of the avatar image uploaded by the user
    const avatarLocalPath = req.files?.path

    // check if the avatar image is uploaded
    if (!avatarLocalPath) {
        throw new ApiErrors(400, "Avatar image is required");
    }

    // upload the avatar image to cloudinary
    const avatar = await uploadFile(avatarLocalPath);

    // check if the avatar image is uploaded successfully
    if (!avatar.url) {
        throw new ApiErrors(400, "Error while uploading avatar image");
    }

    // TODO: after updating image remove the old image from cloudinary


    // update the user avatar in the database
    // find the user by id from the request object
    // just updating the avatar url in the database user documenet 
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: { // $set is mongoose method to update the document
                avatar: avatar.url // this will update the avatar url in the user document
            }
        },
        {
            new: true, // this will return the updated document
        }
    ).select("-password") // this will not update the password field in the response

    return res.status(200).json(
        new ApiResponse(200, user, "Avatar image updated successfully")
    )

})

// Update the user cover Image 
const updateUserCoverImage = asyncHandler(async (req, res) => {
    // this is the path of the cover image uploaded by the user
    const coverImageLocalPath = req.files?.path;

    // check if the cover image is uploaded
    if (!coverImageLocalPath) {
        throw new ApiErrors(400, "Cover image is required");
    }

    // upload the cover image to cloudinary
    const coverImage = await uploadFile(coverImageLocalPath);

    // check if the cover image is uploaded successfully
    if (!coverImage.url) {
        throw new ApiErrors(400, "Error while uploading cover image");
    }

    // Update the user cover image in the database
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                coverImage: coverImage.url // this will update the cover image url in the user document
            }
        },
        {
            new: true, // this will return the updated document
        }
    ).select("-password") // this will not update the password field in the response

    return res.status(200).json(
        new ApiResponse(200, user, "Cover image updated successfully")
    )
})

// Use of Aggregation Pipeline To Get The User Channel Profile

// this will get the user profile with the subscribers and subscriptions count
const getUserChannelProfile = asyncHandler(async (req, res) => {
    // get the user id from the request params
    // param is a part of the url that is used to identify a resource
    const { username } = req.params;

    if (!username?.trim()) { // check if the userName is empty or not provided
        throw new ApiErrors(400, "User name is missing");
    }

    // using aggregation pipeline to get the user channel profile
    // we will use the User model to aggregate the data
    //! it takes array of objects as input 
    // each object is a stage in the pipeline user.aggregate([ARR{objects}])
    const channel = await User.aggregate([
        {
            $set: {
                username: username.toLowerCase() // convert the username to lowercase
            },
        },
        {
            $lookup: {
                from: "Subscription", // this is the collection name in the database  
                localField: "_id", // this is the field in the user collection
                foreignField: "channel", // this is the field in the subscription collection
                as: "subscriber", // this is the field in the output document
            }

        },
        {
            $lookup: {
                from: "Subscription", // this is the collection name in the database  
                localField: "_id", // this is the field in the user collection
                foreignField: "subscriber", // this is the field in the subscription collection
                as: "SubscribedTo", // this 
            }
        },
        {
            // add additional fields to the output document with privious fields
            $addFields: {
                subscribersCount: {
                    $size: "$subscriber" // this will get the count of subscribers
                },
                ChannelSubscribedToCount: {
                    $size: "$SubscribedTo" // this will get the count of channels subscribed to
                },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$SubscribedTo.subscribers"] }, // check if the user is subscribed to the channel
                        then: true, // if true then user is subscribed to the channel
                        else: false // if false then user is not subscribed to the channel
                    }
                }
            }
        },
        {
            $project: { // this will project the fields that we want to return in the response
                // for retrun values we use      fieald : 1
                _id: 1,
                fullName: 1,
                userName: 1,
                avatar: 1,
                coverImage: 1,
                subscribersCount: 1,
                ChannelSubscribedToCount: 1,
                isSubscribed: 1,
                email: 1,
                createdAt: 1,
            }
        }

    ])

    // check if the channel is found or not
    if (!channel || channel.length === 0) {
        throw new ApiErrors(404, "Channel does not exist");
    }

    // print the values of channel
    console.log("channel : ", channel);

    // return the channel profile
    return res.status(200).json(
        // return channel[0] because we are getting only one channel profile
        // channel[0] is the first element of the channel array
        new ApiResponse(200, channel[0], "User channel profile fetched successfully")
    )

})


// Get The Watch History of The User
const getWatchHistory = asyncHandler(async (req, res) => {

    const user = await User.aggregate([ // this will aggregate the data from the user collection
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id) // match the user id from the request object
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory", // this is the field in the user collection
                foreignField: "_id", // this is the field in the videos collection
                as: "watchHistoryVideos", // this is the field in the output document
                //! add further pipeline called Nested pipeline inside one another
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            // Nested pipeline to get the owner details
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        userName: 1,
                                        avatar: 1
                                    }

                                }
                            ]
                        }
                    },
                    {   // this will add the owner field to the output document
                        // $addFields is used to add new fields to the output document  
                        $addFields: {
                            owner: {
                                $first: "$owner" // this will get the first element of the owner array
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user[0]?.watchHistoryVideos, // if user[0] is undefined then return empty array
                "User watch history fetched successfully" // message    

            )
        )

})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    changeCurrentPassword,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory,

}