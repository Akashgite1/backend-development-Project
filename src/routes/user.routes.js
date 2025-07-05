import { Router } from "express"
import { loginUser, logoutUser, registerUser, refreshAccessToken } from "../controllers/user.controller.js"
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

// secured routes 
// before running logoutuser we run verifyJWT middleware 
// in req,rep,next so her next is use when the req and rep are done then excute next 
// middleware in this case logoutUser 
// we can add many as middlewares as we want before the route handler
// router.route("/logout").post(verifyJWT,anothermid, 2ndmid, 3rd, 4th ,logoutUser);
router.route("/logout").post(verifyJWT,logoutUser);
router.route("refresh-token").post(refreshAccessToken);


export default router 
