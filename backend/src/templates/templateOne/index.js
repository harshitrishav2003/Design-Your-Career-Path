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
            const workSummary = splitDescription(exp.desc)
                .map(line => `${line}`)
                .join(" \\\\ ");
            experienceLatex += `
\\textbf{${exp.position}} at ${exp.company} (${exp.city}, ${exp.state}) \\\\
${period} \\\\
${workSummary}
\\vspace{6pt}
      `;
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
  \\vspace{6pt}
      `;
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
  ${proj.description}
  \\vspace{6pt}
      `;
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
