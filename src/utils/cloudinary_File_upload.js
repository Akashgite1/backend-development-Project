import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'


// Configuration 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadFile = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        // upload the file to Cloudinary 
        const responce = await cloudinary.uploader.upload(localFilePath, {
           resource_type: 'auto',
        })
        // file uploaded successfully
        // console.log('File uploaded successfully', responce.url);
        //! remove the locally saved temporary file after upload
        fs.unlinkSync(localFilePath); // remove the locally saved temporary file
        // return the response from Cloudinary
        return responce;
    } catch (error) {
         fs.unlinkSync(localFilePath) // remove the locally saved temporary file upload is failed
        return null; 
    }
}

export { uploadFile };

// Example remote upload
// cloudinary.uploader.upload(
//     "https://res.cloudinary.com/demo/image/upload/sample.jpg",
//     { public_id: "olympic_flag" },
//     function (error, result) {
//         console.log(result, error);
//     }
// );