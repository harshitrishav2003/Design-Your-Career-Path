// utils.js

import { escapeLatexSpecialChars } from "./escapeUtils.js";

export function prepareResumeData(formData) {
    return {
        name: escapeLatexSpecialChars(formData.fullName || "Your Name"),
        jobTitle: escapeLatexSpecialChars(formData.jobTitle || ""),
        phone: escapeLatexSpecialChars(formData.phone || ""),
        email: escapeLatexSpecialChars(formData.email || ""),
        address: escapeLatexSpecialChars(formData.address || ""),
        linkedin: escapeLatexSpecialChars(formData.linkedin || ""),
        summary: escapeLatexSpecialChars(formData.summary || ""),

        // Experience
        experience: Array.isArray(formData.experience)
            ? formData.experience.map(exp => ({
                company: escapeLatexSpecialChars(exp.companyName || ""),
                start: escapeLatexSpecialChars(exp.startDate || ""),
                end: escapeLatexSpecialChars(exp.endDate || ""),
                position: escapeLatexSpecialChars(exp.title || ""),
                city: escapeLatexSpecialChars(exp.city || ""),
                state: escapeLatexSpecialChars(exp.state || ""),
                desc: escapeLatexSpecialChars(exp.workSummary || ""),
            }))
            : [],

        // Education
        education: Array.isArray(formData.education)
            ? formData.education.map(edu => ({
                university: escapeLatexSpecialChars(edu.universityName || ""),
                start: escapeLatexSpecialChars(edu.startDate || ""),
                end: escapeLatexSpecialChars(edu.endDate || ""),
                degree: escapeLatexSpecialChars(edu.degree || ""),
                major: escapeLatexSpecialChars(edu.major || ""),
                desc: escapeLatexSpecialChars(edu.description || ""),
                city: "", // not used in LaTeX but can be added if needed
            }))
            : [],

        // Certifications / Extra Curriculars
        certifications: Array.isArray(formData.certificationsOrExtraCurriculars)
            ? formData.certificationsOrExtraCurriculars.map(cert => ({
                name: escapeLatexSpecialChars(cert.certificationOrExtraCurricularName || "")
            }))
            : [],

        // Achievements
        achievements: Array.isArray(formData.achievements)
            ? formData.achievements.map(ach => ({
                name: escapeLatexSpecialChars(ach.achievement || "")
            }))
            : [],

        // Skills
        skills: Array.isArray(formData.skills)
            ? formData.skills.map(skill => ({
                name: escapeLatexSpecialChars(skill.name || "")
            }))
            : [],

        // Social Media
        social: Array.isArray(formData.social)
            ? formData.social.map(social => ({
                name: escapeLatexSpecialChars(social.socialMediaName || ""),
                link: escapeLatexSpecialChars(social.socialMediaLink || ""),
            }))
            : [],

        // Projects
        projects: Array.isArray(formData.projects)
            ? formData.projects.map(proj => ({
                projectName: escapeLatexSpecialChars(proj.projectName || ""),
                link: escapeLatexSpecialChars(proj.projectLink || ""),
                description: escapeLatexSpecialChars(proj.description || ""),
            }))
            : [],

        // Interests
        interests: Array.isArray(formData.interests)
            ? formData.interests.map(interest => ({
                name: escapeLatexSpecialChars(interest.interestName || ""),
            }))
            : [],
    };
}
