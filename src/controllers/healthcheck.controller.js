import {ApiErrors} from "../utils/APIErros.js"
import {ApiResponse} from "../utils/APiResponce.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const healthcheck = asyncHandler(async (req, res) => {
    // DONE 
    //TODO: build a healthcheck response that simply returns the OK status as json with a message
    return res
    .status(200)
    .json(
        new ApiResponse
        ("OK", "Service is healthy")
        .toJSON()
    )
})

export {
    healthcheck
}
    