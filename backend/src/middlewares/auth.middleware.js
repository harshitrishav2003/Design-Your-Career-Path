import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  // Extract token
  let token;

  if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  } else if (req.header("Authorization")) {
    const authHeader = req.header("Authorization");
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.replace("Bearer ", "").trim();
    }
  }

  // Validate presence
  if (!token) {
    throw new ApiError(401, "Unauthorized request: No token provided");
  }

  //  Verify
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    throw new ApiError(401, "Invalid or malformed access token");
  }

  // Lookup user
  const user = await User.findById(decodedToken?._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(401, "Invalid Access Token: User not found");
  }

  // Project custom fields if needed
  const UserDetails = await User.aggregate([
    { $match: { _id: user._id } },
    {
      $project: {
        email: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  req.user = UserDetails[0];
  next();
});
