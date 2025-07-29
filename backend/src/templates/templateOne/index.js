import { prepareResumeData } from "../../utils/prepareResumeData.js";
import { splitDescription } from "../../utils/escapeUtils.js";

export default function buildTemplateOneLatex(formData) {
    const data = prepareResumeData(formData);

    let socialLinksLatex = "";
    if (Array.isArray(formData.social) && formData.social.length > 0) {
        socialLinksLatex = formData.social
            .map(
                (social) =>
                    `\\href{${social.socilaMedialink}}{${social.socialMediaName}}`
            )
            .join(" \\hspace{1em} ");
    }

    /**  Experience */
    let experienceLatex = "";
    if (data.experience.length > 0) {
        experienceLatex += "\\section*{EXPERIENCE}\n";
        data.experience.forEach((exp) => {
            const period = `${exp.start} -- ${exp.end}`;
            experienceLatex += `
\\textbf{${exp.position}} at ${exp.company} (${exp.city}, ${exp.state}) \\\\
${period} \\\\
`;
            
            // Handle bullet points properly
            const workSummaryLines = splitDescription(exp.desc);
            if (workSummaryLines.length > 0) {
                experienceLatex += `\\begin{itemize}\n`;
                workSummaryLines.forEach(line => {
                    experienceLatex += `\\item ${line}\n`;
                });
                experienceLatex += `\\end{itemize}\n`;
            }
            
            experienceLatex += `\\vspace{6pt}\n`;
        });
    }

    /**  Education */
    let educationLatex = "";
    if (data.education.length > 0) {
        educationLatex += "\\section*{EDUCATION}\n";
        data.education.forEach((edu) => {
            educationLatex += `
\\textbf{${edu.degree} in ${edu.major}} - ${edu.university} \\\\
${edu.start} -- ${edu.end}
`;
            
            // Handle bullet points in education description if present
            if (edu.desc && edu.desc.trim() !== "") {
                const eduDescLines = splitDescription(edu.desc);
                if (eduDescLines.length > 0) {
                    educationLatex += `\\begin{itemize}\n`;
                    eduDescLines.forEach(line => {
                        educationLatex += `\\item ${line}\n`;
                    });
                    educationLatex += `\\end{itemize}\n`;
                }
            }
            
            educationLatex += `\\vspace{6pt}\n`;
        });
    }

    /**  Projects */
    let projectsLatex = "";
    if (Array.isArray(formData.projects) && formData.projects.length > 0) {
        projectsLatex += "\\section*{PROJECTS}\n";
        formData.projects.forEach((proj) => {
            projectsLatex += `
\\textbf{${proj.projectName}} \\\\
\\href{${proj.projectLink}}{Project Link} \\\\
`;
            
            // Handle bullet points properly
            const projectDescLines = splitDescription(proj.description);
            if (projectDescLines.length > 0) {
                projectsLatex += `\\begin{itemize}\n`;
                projectDescLines.forEach(line => {
                    projectsLatex += `\\item ${line}\n`;
                });
                projectsLatex += `\\end{itemize}\n`;
            }
            
            projectsLatex += `\\vspace{6pt}\n`;
        });
    }

    /**  Skills */
    let skillsLatex = "";
    if (data.skills.length > 0) {
        skillsLatex += "\\section*{SKILLS}\n\\begin{itemize}\n";
        data.skills.forEach((skill) => {
            skillsLatex += `\\item ${skill.name}\n`;
        });
        skillsLatex += "\\end{itemize}\n";
    }

    /**  Achievements */
    let achievementsLatex = "";
    if (data.achievements.length > 0) {
        achievementsLatex += "\\section*{ACHIEVEMENTS}\n\\begin{itemize}\n";
        data.achievements.forEach((ach) => {
            achievementsLatex += `\\item ${ach.name}\n`;
        });
        achievementsLatex += "\\end{itemize}\n";
    }

    /**  Interests */
    let interestsLatex = "";
    if (Array.isArray(formData.interests) && formData.interests.length > 0) {
        interestsLatex += "\\section*{INTERESTS}\n\\begin{itemize}\n";
        formData.interests.forEach((interest) => {
            interestsLatex += `\\item ${interest.interestName}\n`;
        });
        interestsLatex += "\\end{itemize}\n";
    }

    /**  Certifications */
    let certificationsLatex = "";
    if (data.certifications.length > 0) {
        certificationsLatex += "\\section*{CERTIFICATIONS / EXTRA CURRICULARS}\n\\begin{itemize}\n";
        data.certifications.forEach((cert) => {
            certificationsLatex += `\\item ${cert.name}\n`;
        });
        certificationsLatex += "\\end{itemize}\n";
    }

    /**  FINAL DOCUMENT */
    return `
\\documentclass[11pt]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{hyperref}
\\begin{document}

\\begin{center}
  {\\Huge ${data.name}} \\\\[5pt]
  ${formData.jobTitle || ""} \\\\
  ${formData.address || ""} \\\\
  ${data.phone} | ${data.email} \\\\
  ${socialLinksLatex}
\\end{center}

\\section*{SUMMARY}
${data.summary}

${experienceLatex}

${educationLatex}

${projectsLatex}

${skillsLatex}

${achievementsLatex}

${interestsLatex}

${certificationsLatex}

\\end{document}
  `;
}
