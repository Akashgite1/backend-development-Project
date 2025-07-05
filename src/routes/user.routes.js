import { Router } from "express"
import { registerUser, loginUser, logoutUser, refreshAccessToken, getCurrentUser, changeCurrentPassword, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory } from "../controllers/user.controller.js"

import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"


const router = Router()

// when the user hits the /register endpoint then we called the registerUser function from userController 
router.route("/register").post(
    upload.fields([
        {
            name: 'avatar',
            maxCount: 1
        },
        {
            name: 'coverImage',
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser) // at route /login the method loginuser runs

//! secured routes 
// before running logoutuser we run verifyJWT middleware 
// in req,rep,next so her next is use when the req and rep are done then excute next 
// middleware in this case logoutUser 
// we can add many as middlewares as we want before the route handler
// router.route("/logout").post(verifyJWT,anothermid, 2ndmid, 3rd, 4th ,logoutUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-usr").get(verifyJWT, getCurrentUser) // this is to get the current user details

//! router working explanation
router
.route("/update-account") // user browser will hit this endpoint to update account details
.patch(// patch is used to update the resource
    verifyJWT, // verifyJWT is a middleware that checks if the user is authenticated
    updateAccountDetails // updateAccountDetails is the controller function that handles the request and updates the user account details and sends the response with updated user details
)

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(verifyJWTm, upload.single("coverImage"), updateUserCoverImage)
router.route("/channel/:username").get(verifyJWT, getUserChannelProfile) // this is to get the user channel profile by username
router.route("/watch-history").get(verifyJWT, getWatchHistory) // this is to get the user's watch history with video owner details


export default router 
