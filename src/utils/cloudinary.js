import cloudinaryPkg from "cloudinary";
import fs from "fs";

const { v2: cloudinary } = cloudinaryPkg;


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})


const uploadToCloudinary = async (localFilePath, folder) => {
    try {
        if (!localFilePath) return null
        // Upload the file to Cloudinary
         const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        // file has been uploaded successfully
        console.log("File uploaded to Cloudinary successfully:",
             response.url);
             return response;
        
    } catch (error) {
        // remove the locally saved temporary file as the upload failed
        fs.unlinkSync(localFilePath);
        console.error("Error uploading file to Cloudinary:", error);
    }
}
    
export { uploadToCloudinary }