import { Router } from "express";
import {
    createNewResume,
    getUserResumes,
    getResumeById,
    updateResumeDetail,
    deleteResumeById,
    generateUserResume
} from "../Controller/userResume.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-user-resume").post(verifyJWT, createNewResume)
router.route("/user-resumes").get(verifyJWT, getUserResumes)
router.route("/get-user-resume/:id").get(verifyJWT, getResumeById)
router.route("/update-resume-details/:resumeId").patch(verifyJWT, updateResumeDetail);
router.route("/delete-resume/:resumeId").delete(verifyJWT, deleteResumeById);
router.route("/generate-resume").post(verifyJWT, generateUserResume)
export default router