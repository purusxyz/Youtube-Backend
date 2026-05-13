import { asyncHandler } from "../utils/asyncHandler.js";
import { APiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefreshTokens = async(userId) => {
   try {
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()
      
      user.refreshToken = refreshToken
      await user.save({validBeforeSave: false})

      return {accessToken, refreshToken}

   } catch (error) {
      throw new ApiError(500, "Something went wrong while generating Refresh and Access Token")
   }
}

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

 
 const existedUser = await User.findOne({
    $or: [{ username }, { email }]
});
 if (existedUser) {
    throw new APiError(409, 
      "User with email or username already exists")
 }

const avatarLocalPath = req.files?.avatar[0]?.path;
const coverImageLocalPath = req.files?.coverImage[0]?.path;

if (!avatarLocalPath) {
    throw new APiError(400, "Avatar file is required")
}

const avatar = await uploadToCloudinary(avatarLocalPath)
const coverImage = await uploadToCloudinary(coverImageLocalPath)

if(!avatar){
      throw new APiError(400, "Avatar file is required")
}

const user = await User.create({
   fullName,
   avatar: avatar.url,
   coverImage: coverImage?.url || "",
   email,
   username: username.toLowerCase(),
   password
})


const createdUser = await User.findById(user._id).select(
   "-password -refreshToken"
)

if(!createdUser){
   throw new APiError(500, "Something went wrong, user registration failed")
}

return res.status(201).json(
   new ApiResponse(200, createdUser, "User registered successfully")
)

})

export const loginUser = asyncHandler( async (req, res) => {
   // req body --> data
   // username or email
   // find the user
   // password check
   // access and refresh Token
   // send cookie 

   const { email, username, password } = req.body

   if(!username || !email) {
      throw new APiError(400, "username or email is required")
}

const user = await User.findOne({
   $or: [{username}, {email}]
})

if(!user) {
  throw new APiError(400, "User does not exist") 
}

const isPasswordValid = await user.comparePassword(password)


if(!isPasswordValid){
   throw new ApiError(401, "Invalid user credentials")
}

const {accessToken, refreshToken} = await
 generateAccessAndRefreshTokens(user._id)


 const loggedInUser = await User.findByIdAndUpdate(user._id).
 select("-password -refreshToken")

 const cookieOptions = {
    httpOnly: true,
    secure: true,
   
 }

 return res
 .status(200)
 .cookie("accessToken", accessToken, cookieOptions)
 .cookie("refreshToken", refreshToken, cookieOptions)
 .json(
   new ApiResponse(
      200,
      { 
        user: loggedInUser.accessToken.refreshToken
      },
      "User logged in successfully"
   ))


})

export const logoutUser = asyncHandler( async (req, res) => {
   




})