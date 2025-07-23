import { Router } from "express";
import {
    changeCurrentPassword,
    getCurrentUser,
    logOutUser,
    loginUser,
    refreshAccessToken,
    registerUser,
    updateAccountDetails,
    getAllUsers,
    googleAuth
} from "../Controller/user.controller.js";
// import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser)
router.route("/google").post(googleAuth)
router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logOutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/all-users").get(verifyJWT, getAllUsers)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)

export default router