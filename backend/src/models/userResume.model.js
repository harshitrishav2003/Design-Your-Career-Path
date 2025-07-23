import mongoose, { Schema } from "mongoose";

/**
 * Experience sub-schema
 */
const ExperienceSchema = new Schema(
    {
        title: { type: String, trim: true },
        companyName: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        startDate: { type: String, trim: true },
        endDate: { type: String, trim: true },
        currentlyWorking: { type: Boolean, default: false },
        workSummary: { type: String, trim: true },
    },
    { _id: false }
);

/**
 * Education sub-schema
 */
const EducationSchema = new Schema(
    {
        universityName: { type: String, trim: true },
        startDate: { type: String, trim: true },
        endDate: { type: String, trim: true },
        degree: { type: String, trim: true },
        major: { type: String, trim: true },
        description: { type: String, trim: true },
    },
    { _id: false }
);

/**
 * Project sub-schema
 */
const ProjectSchema = new Schema(
    {
        projectName: { type: String, trim: true },
        projectLink: { type: String, trim: true },
        description: { type: String, trim: true },
    },
    { _id: false }
);

/**
 * Skill sub-schema
 */
const SkillSchema = new Schema(
    {
        name: { type: String, trim: true },
    },
    { _id: false }
);

/**
 * Achievement sub-schema
 */
const AchievementSchema = new Schema(
    {
        achievement: { type: String, trim: true },
    },
    { _id: false }
);

/**
 * Social Media sub-schema
 */
const SocialSchema = new Schema(
    {
        socialMediaName: { type: String, trim: true },
        socialMediaLink: { type: String, trim: true },
    },
    { _id: false }
);

/**
 * Interest sub-schema
 */
const InterestSchema = new Schema(
    {
        interestName: { type: String, trim: true },
    },
    { _id: false }
);

/**
 * Certifications / Extra-Curriculars sub-schema
 */
const CertificationOrExtraCurricularSchema = new Schema(
    {
        certificationOrExtraCurricularName: { type: String, trim: true },
    },
    { _id: false }
);

/**
 * Main UserResume schema
 */
const UserResumeSchema = new Schema(
    {
        templateId: {
            type: String,
        },
        resumeTitle: {
            type: String,
            required: true,
            trim: true,
        },
        fullName: {
            type: String,
            trim: true,
        },
        jobTitle: {
            type: String,
            trim: true,
            index: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        address: {
            type: String,
            trim: true,
        },
        summary: {
            type: String,
            trim: true,
        },

        achievements: [AchievementSchema],
        experience: [ExperienceSchema],
        education: [EducationSchema],
        skills: [SkillSchema],
        social: [SocialSchema],
        projects: [ProjectSchema],
        interests: [InterestSchema],
        certificationsOrExtraCurriculars: [CertificationOrExtraCurricularSchema],

        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true, // Adds createdAt & updatedAt
    }
);

/**
 * Export the UserResume model
 */
export const UserResume = mongoose.model("UserResume", UserResumeSchema);
