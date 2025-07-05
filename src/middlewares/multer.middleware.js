import multer from "multer"

// This middleware is used to handle file uploads using multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
        // Use the original file name for simplicity 
        // You can also modify the file name if needed 
        // For example, you could append a timestamp or a unique identifier
        cb(null, file.originalname)
    }
})

export const upload = multer({
    storage,
})