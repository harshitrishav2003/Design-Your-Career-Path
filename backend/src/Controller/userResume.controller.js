import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { UserResume } from "../models/userResume.model.js";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { templates, defaultBuilder } from "../templates/index.js";
import { Template } from "../models/template.Model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * @desc   Create a new resume for the authenticated user
 * @route  POST /v1/users/create-user-resume
 * @access Private
 */
const createNewResume = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID.");
    }

    if (!req.body || typeof req.body !== "object") {
        throw new ApiError(400, "Request body must be a valid JSON object.");
    }

    const { resumeTitle, email = "", templateId } = req.body;

    if (!resumeTitle || typeof resumeTitle !== "string" || !resumeTitle.trim()) {
        throw new ApiError(400, "Resume title is required and must be a non-empty string.");
    }

    const newUserResume = await UserResume.create({
        userId,
        templateId,
        resumeTitle: resumeTitle.trim(),
        email: email.trim(),
    });

    if (!newUserResume) {
        throw new ApiError(500, "Failed to create new resume.");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, newUserResume, "Resume created successfully."));
});

/**
 * @desc   Get all resumes for the authenticated user
 * @route  GET /v1/users/user-resumes
 * @access Private
 */
const getUserResumes = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID.");
    }

    const resumes = await UserResume.find({ userId }).sort({ updatedAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, resumes, "Fetched user resumes successfully."));
});

/**
 * @desc   Get a specific resume by its ID
 * @route  GET /v1/users/user-resume/:id
 * @access Private
 */
const getResumeById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid resume ID.");
    }

    const resume = await UserResume.findById(id);

    if (!resume) {
        throw new ApiError(404, "Resume not found.");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, resume, "Fetched resume successfully."));
});

/**
 * @desc   Update specific details of an existing resume
 * @route  PUT /v1/users/update-resume-details/:resumeId
 * @access Private
 */
const updateResumeDetail = asyncHandler(async (req, res) => {
    const { resumeId } = req.params;

    if (!isValidObjectId(resumeId)) {
        throw new ApiError(400, "Invalid resume ID.");
    }

    if (!req.body || typeof req.body !== "object") {
        throw new ApiError(400, "Request body must be a valid JSON object.");
    }

    const {
        resumeTitle,
        fullName,
        jobTitle,
        address,
        phone,
        email,
        summary,
        experience,
        education,
        skills,
        social,
        templateId,
        projects,
        achievements,
        interests,
        certificationsOrExtraCurriculars,
    } = req.body;

    const existingResume = await UserResume.findById(resumeId);
    if (!existingResume) {
        throw new ApiError(404, "Resume not found.");
    }

    const updateFields = {};

    if (resumeTitle !== undefined) updateFields.resumeTitle = String(resumeTitle).trim();
    if (templateId !== undefined) updateFields.templateId = String(templateId).trim();
    if (fullName !== undefined) updateFields.fullName = String(fullName).trim();
    if (jobTitle !== undefined) updateFields.jobTitle = String(jobTitle).trim();
    if (address !== undefined) updateFields.address = String(address).trim();
    if (phone !== undefined) updateFields.phone = String(phone).trim();
    if (email !== undefined) updateFields.email = String(email).trim();
    if (summary !== undefined) updateFields.summary = String(summary).trim();

    if (Array.isArray(experience)) updateFields.experience = experience;
    if (Array.isArray(education)) updateFields.education = education;
    if (Array.isArray(projects)) updateFields.projects = projects;
    if (Array.isArray(achievements)) updateFields.achievements = achievements;
    if (Array.isArray(skills)) updateFields.skills = skills;
    if (Array.isArray(interests)) updateFields.interests = interests;
    if (Array.isArray(certificationsOrExtraCurriculars))
        updateFields.certificationsOrExtraCurriculars = certificationsOrExtraCurriculars;
    if (Array.isArray(social)) updateFields.social = social;

    const updatedResume = await UserResume.findByIdAndUpdate(
        resumeId,
        { $set: updateFields },
        { new: true, runValidators: true }
    );

    if (!updatedResume) {
        throw new ApiError(500, "Failed to update resume.");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedResume, "Resume updated successfully."));
});

/**
 * @desc   Delete a user resume by ID
 * @route  DELETE /v1/admin/delete-resume/:resumeId
 * @access Private
 */
const deleteResumeById = asyncHandler(async (req, res) => {
    const { resumeId } = req.params;

    if (!isValidObjectId(resumeId)) {
        throw new ApiError(400, "Invalid resume ID.");
    }

    const resume = await UserResume.findById(resumeId);
    if (!resume) {
        throw new ApiError(404, "Resume not found.");
    }

    await UserResume.findByIdAndDelete(resumeId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Resume deleted successfully."));
});


/**
 * @desc   Generate PDF for user resume using LaTeX template
 * @route  POST /v1/users/generate-user-resume
 * @access Private
 */
const generateUserResume = asyncHandler(async (req, res) => {
    const formData = req.body;
    const templateId = formData.templateId;

    let buildLatex;

    if (templateId) {
        // Try to find template by ID
        const templateMeta = await Template.findById(templateId);
        if (!templateMeta) {
            return res.status(404).json({ message: "Template not found." });
        }

        console.log("Template folder:", templateMeta.folderName);

        buildLatex = templates[templateMeta.folderName.toLowerCase()] || defaultBuilder;
    } else {
        console.warn("No templateId provided — using default template.");
        buildLatex = defaultBuilder;
    }

    if (!buildLatex) {
        return res.status(500).json({ message: "No template builder found." });
    }

    // Build LaTeX source
    const latexContent = buildLatex(formData);

    // Create output dir
    const resumesDir = path.join(process.cwd(), "resumes");
    if (!fs.existsSync(resumesDir)) {
        fs.mkdirSync(resumesDir, { recursive: true });
    }

    const unique = Date.now();
    const escapedName = formData.fullName?.replace(/\s+/g, "_") || "resume";
    const baseFile = `${escapedName}_${unique}`;
    const latexFile = path.join(resumesDir, `${baseFile}.tex`);
    const pdfPath = path.join(resumesDir, `${baseFile}.pdf`);

    // Write .tex file
    fs.writeFileSync(latexFile, latexContent);

    // Compile LaTeX
    exec(
        `pdflatex -interaction=nonstopmode -output-directory="${resumesDir}" "${latexFile}"`,
        (err, stdout, stderr) => {
            // console.log("STDOUT:", stdout);
            // console.error("STDERR:", stderr);

            if (!fs.existsSync(pdfPath)) {
                return res.status(500).json({ message: "PDF generation failed." });
            }

            // Clean up
            try {
                fs.unlinkSync(latexFile);
                const auxFile = latexFile.replace(".tex", ".aux");
                const logFile = latexFile.replace(".tex", ".log");
                if (fs.existsSync(auxFile)) fs.unlinkSync(auxFile);
                if (fs.existsSync(logFile)) fs.unlinkSync(logFile);
            } catch (cleanupErr) {
                console.warn("Cleanup warning:", cleanupErr);
            }

            if (err) {
                console.warn("pdflatex returned error but PDF exists — ignoring.");
            }

            return res.status(200).json(
                new ApiResponse(
                    200,
                    { resumeUrl: `/resumes/${baseFile}.pdf` },
                    "Resume generated successfully"
                )
            );
        }
    );
});
export {
    createNewResume,
    getUserResumes,
    getResumeById,
    updateResumeDetail,
    deleteResumeById,
    generateUserResume,
};
