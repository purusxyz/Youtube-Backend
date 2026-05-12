import { asyncHandler } from "../utils/asyncHandler.js";
import { APiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


export const registerUser = asyncHandler(async (req, res) => {
 //get user details from frontend or req.body
 //validattion -- not empty
 //check if user already exists: username, email
 //check for images, check for avatar
 //upload them to cloudinary, avatar
 //create user object -- create entry in db
 //remove pasword and refresh token field from response
 //check for user creation
 //return response


 const { fullName, email, username, password } = req.body
 console.log("email: ", email);

 if(
    [fullName, email, username, password].some((field) => 
        field?.trim() ==="")
 ) {
    throw new APiError(400, "All fields are required")
 }

 
 const existedUser = User.findOne({
    $or: [{ username }, { email }]
});
 if (existedUser) {
    throw new APiError(409, 
      "User with email or username already exists")
 }

const avatarLocalPath = req.files?.avatar[0].path;
const coverImageLocalPath = req.files?.coverImage[0].path;

if (!avatarLocalPath) {
    throw new APiError(400, "Avatar file is required")
}

const avatar = await uploadToCloudinary(avatarLocalPath)
const coverImage = await uploadToCloudinary(coverImageLocalPath)

if(!avatar){
      throw new APiError(400, "Avatar file is required")
}

await User.create({
   fullName,
   avatar: avatar.url,
   coverImage: coverImage?.url || "",
   email,
   username: username.toLowerCase(),
   password
})


const user = await User.findById(user._id).select(
   "-password -refreshToken"
)

if(!createdUser){
   throw new APiError(500, "Something went wrong, user registration failed")
}

return res.status(201).json(
   new ApiResponse(200, createdUser, "User registered successfully")
)

})


