// controllers/templateAdmin.controller.js

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Template } from "../models/template.Model.js";

/**
 * @desc   Register a new LaTeX resume template
 * @route  POST /v1/admin/add-template
 * @access Admin
 */
const registerTemplate = asyncHandler(async (req, res) => {

    // Get template details from request body
    const { folderName, name, description } = req.body;

    // Validate required field
    if (!folderName || folderName.trim() === "") {
        throw new ApiError(400, "folderName is required");
    }

    // Check if template with same folderName already exists
    const existed = await Template.findOne({ folderName: folderName.trim() });

    if (existed) {
        throw new ApiError(409, "Template with this folderName already exists");
    }

    // Create new template
    const template = await Template.create({
        folderName: folderName.trim(),
        name: name?.trim() || "",
        description: description?.trim() || "",
    });

    // Fetch created template (clean projection)
    const createdTemplate = await Template.findById(template._id).select(
        "_id folderName name description createdAt updatedAt"
    );

    if (!createdTemplate) {
        throw new ApiError(500, "Something went wrong while registering the template");
    }

    return res.status(201).json(
        new ApiResponse(201, createdTemplate, "Template registered successfully")
    );
});


/**
 * @desc   Get all templates for user to choose
 * @route  GET /v1/users/templates
 * @access Public
 */
const getAllTemplates = asyncHandler(async (req, res) => {
    const templates = await Template.find().select(
        "_id folderName name description createdAt updatedAt"
    );

    return res
        .status(200)
        .json(new ApiResponse(200, templates, "Templates fetched successfully"));
});
export {
    registerTemplate,
    getAllTemplates
};
