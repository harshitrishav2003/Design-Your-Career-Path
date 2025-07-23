// Import necessary modules and utilities
import { asyncHandler } from "../utils/asyncHandler.js"; //  asyncHandler utility for handling asynchronous operations
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { OAuth2Client } from 'google-auth-library'

// Function to generate access and refresh tokens for a user
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        // Find the user by ID
        const user = await User.findById(userId);

        // Generate access and refresh tokens for the user
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        // Update the user's refresh token in the database
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        // Return the generated tokens
        return { accessToken, refreshToken }

    } catch (error) {
        // If an error occurs, throw an ApiError with a 500 status code
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens")
    }
}

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = Jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken: newRefreshToken,
                    },
                    "Access token refreshed"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})


// Handler for user registration
const registerUser = asyncHandler(async (req, res) => {

    // Get user details from the request body
    const { email, password } = req.body
    console.log('email', email)

    // Validate that all required fields are present and not empty
    if (![email, password].every(field => field && field.trim() !== "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if user with the provided username or email already exists
    const existedUser = await User.findOne({
        $or: [{ email }]
    })

    if (existedUser) {
        throw new ApiError(409, "UserName or Email already exists")
    }

    // Create a new user in the database
    const user = await User.create({
        email: email.toLowerCase(),
        password,
    })

    // Fetch the created user from the database excluding sensitive fields
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    const createdUserDetails = await User.aggregate([
        {
            $match: {
                _id: createdUser._id
            }
        },
        {
            $project: {
                email: 1,
                createdAt: 1,
                updatedAt: 1,
            }
        }
    ]);

    // Return success response with the registered user details
    return res.status(200).json(
        new ApiResponse(200, createdUserDetails[0], "User registered Successfully")
    )
})



const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const googleAuth = asyncHandler(async (req, res) => {
    const { idToken } = req.body;
    if (!idToken) {
        return res.status(400).json({ message: "ID token is required" });
    }

    //  Verify Google ID token
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email } = payload;

    if (!email) {
        return res.status(400).json({ message: "Invalid Google token" });
    }

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
        user = await User.create({
            email,
            password: Math.random().toString(36), // dummy, hashed by pre-save hook
        });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    user.refreshToken = refreshToken;
    await user.save();

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const loggedInUserDetails = await User.aggregate([
        {
            $match: {
                _id: loggedInUser._id
            }
        },
        {
            $project: {
                email: 1,
                createdAt: 1,
                updatedAt: 1,
            }
        }
    ]);

    const options = {
        httpOnly: true,
        secure: true,
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUserDetails[0],
                    accessToken,
                    refreshToken
                },
                "Google Sign-In successful"
            )
        )
});


const loginUser = asyncHandler(async (req, res) => {
    console.log(req.body);

    // const {userName, password} = req.body
    const { email, password } = req.body

    console.log(req.body);
    if (!(password || email)) {
        throw new ApiError(400, "Username or password is required");
    }

    const user = await User.findOne({
        $or: [{ email }]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid User Credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const loggedInUserDetails = await User.aggregate([
        {
            $match: {
                _id: loggedInUser._id
            }
        },
        {
            $project: {
                email: 1,
                createdAt: 1,
                updatedAt: 1,
            }
        }
    ]);

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUserDetails[0],
                    accessToken,
                    refreshToken
                },
                "User Logged In Successfully"
            )
        )
})

const logOutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined,
            }
        },
        {
            new: true,
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
    }


    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                "User Log Out Successfully"
            )
        )
})



const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user?._id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Password Chnaged Successfully"
            )
        )
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            req.user,
            "Current User Fetched Successfully"
        ))
})

const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find();
        if (!users || users.length === 0) {
            throw new ApiError(404, "No user found");
        }

        const userDetails = await User.aggregate([
            {
                $lookup: {
                    from: "userroles",
                    localField: "user_role",
                    foreignField: "_id",
                    as: "userRoleDetails",
                },
            },
            {
                $addFields: {
                    userRole: {
                        $arrayElemAt: ["$userRoleDetails.role", 0]
                    }
                },
            },
            {
                $project: {
                    fullName: 1,
                    userName: 1,
                    email: 1,
                    gender: 1,
                    mobile_no: 1,
                    user_role: 1,
                    userRole: 1,
                    userRole: 1,
                    createdAt: 1,
                    updatedAt: 1,
                }
            }
        ]);

        return res.status(200).json(
            new ApiResponse(
                200,
                userDetails,
                "Users fetched successfully"
            )
        );
    } catch (error) {
        throw new ApiError(500, "Failed to fetch all users");
    }
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        { new: true }

    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            user,
            "Account details updated successfully"
        ))
})



export {
    registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    getAllUsers,
    googleAuth
}