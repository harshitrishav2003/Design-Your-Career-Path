import { prepareResumeData } from "../../utils/prepareResumeData.js";
import { splitDescription } from "../../utils/escapeUtils.js";

function latexEscape(str = "") {
    return str
        .replace(/\\/g, "\\textbackslash{}")
        .replace(/%/g, "\\%")
        .replace(/\$/g, "\\$")
        .replace(/#/g, "")
        .replace(/&/g, "\\&")
        .replace(/{/g, "\\{")
        .replace(/}/g, "\\}")
        .replace(/_/g, "\\_")
        .replace(/\^/g, "\\^{}")
        .replace(/~/g, "\\~{}");
}

export default function buildTemplateFiveLatex(formData) {
    const data = prepareResumeData(formData);

    const name = latexEscape(data.name || "Name");
    const jobTitle = latexEscape(data.jobTitle || "Job Title");
    const address = latexEscape(data.address || "");
    const email = latexEscape(data.email || "");
    const phone = latexEscape(data.phone || "");

    let socialLinksLatex = "";
    if (Array.isArray(data.social) && data.social.length > 0) {
        socialLinksLatex = data.social
            .map(
                (social) =>
                    `\\href{${latexEscape(social.link)}}{${latexEscape(social.name)}}`
            )
            .join(" \\hspace{1em} ");
    }

    let headerLatex = `
\\begin{center}
  {\\Huge \\textbf{${name}}} \\\\
  {\\large ${jobTitle}} \\\\
  \\vspace{6pt}
  ${address} \\\\
  Email: \\textbf{${email}} \\hspace{2em} Mobile: \\textbf{${phone}} \\\\
  \\vspace{4pt}
  ${socialLinksLatex} \\\\
  \\vspace{8pt}
\\end{center}
`;

    // === PROFESSIONAL SUMMARY ===
    let summaryLatex = "";
    if (data.summary) {
        summaryLatex += `\\resheading{\\textbf{PROFESSIONAL SUMMARY}} \\\\[6pt]
${latexEscape(data.summary)} \\\\[12pt]
`;
    }

    // === EDUCATION ===
    let educationLatex = `
\\resheading{\\textbf{ACADEMIC DETAILS}} \\\\[4pt]
\\begin{tabular}{ | l | l | l | l | l | }
\\hline
\\textbf{Examination} & \\textbf{Major} & \\textbf{University} & \\textbf{Start--End} & \\textbf{CPI/\\%} \\\\
\\hline
`;

    data.education.forEach((edu) => {
        educationLatex += `
${latexEscape(edu.degree)} & ${latexEscape(edu.major || "")} & ${latexEscape(
            edu.university
        )} & ${latexEscape(edu.start)}--${latexEscape(
            edu.end
        )} & ${latexEscape(edu.cgpa)} \\\\
\\hline
`;
    });

    educationLatex += `\\end{tabular} \\\\[12pt]`;

    // === EXPERIENCE ===
    let experienceLatex = "";
    if (data.experience.length > 0) {
        experienceLatex += `\\resheading{\\textbf{EXPERIENCE}} \\\\[4pt]\n`;
        data.experience.forEach((exp) => {
            experienceLatex += `
\\ressubheading{${latexEscape(exp.company)}}{} \\\\
\\textit{${latexEscape(exp.position)}} \\\\
${latexEscape(exp.start)} -- ${latexEscape(exp.end)} | ${latexEscape(
                exp.city
            )}, ${latexEscape(exp.state)} \\\\[4pt]
\\begin{itemize}\\setlength{\\itemsep}{3pt}
`;
            splitDescription(exp.desc).forEach((line) => {
                experienceLatex += `\\resitem{${latexEscape(line)}}\n`;
            });
            experienceLatex += `\\end{itemize} \\\\[8pt]`;
        });
    }

    // === PROJECTS ===
    let projectsLatex = "";
    if (data.projects.length > 0) {
        projectsLatex += `\\resheading{\\textbf{PROJECTS}} \\\\[4pt]\n`;
        data.projects.forEach((proj) => {
            const link = proj.link ? `\\href{${proj.link}}{Demo}` : "";
            projectsLatex += `
\\ressubheading{${latexEscape(proj.projectName)}}{${link}} \\\\
\\begin{itemize}\\setlength{\\itemsep}{3pt}
`;
            splitDescription(proj.description).forEach((line) => {
                projectsLatex += `\\resitem{${latexEscape(line)}}\n`;
            });
            projectsLatex += `\\end{itemize} \\\\[8pt]`;
        });
    }

    // === SKILLS ===
    let skillsLatex = "";
    if (data.skills.length > 0) {
        skillsLatex += `\\resheading{\\textbf{TECHNICAL SKILLS}} \\\\[6pt]\n\\begin{itemize}\\setlength{\\itemsep}{3pt}\n`;
        data.skills.forEach((skill) => {
            skillsLatex += `\\resitem{${latexEscape(skill.name)}}\n`;
        });
        skillsLatex += `\\end{itemize} \\\\[6pt]`;
    }

    // === CERTIFICATIONS ===
    let certificationsLatex = "";
    if (data.certifications.length > 0) {
        certificationsLatex += `\\resheading{\\textbf{CERTIFICATIONS}} \\\\[6pt]\n\\begin{itemize}\\setlength{\\itemsep}{3pt}\n`;
        data.certifications.forEach((cert) => {
            certificationsLatex += `\\resitem{${latexEscape(cert.name)}}\n`;
        });
        certificationsLatex += `\\end{itemize} \\\\[6pt]`;
    }

    // === ACHIEVEMENTS ===
    let achievementsLatex = "";
    if (data.achievements && data.achievements.length > 0) {
        achievementsLatex += `\\resheading{\\textbf{ACHIEVEMENTS}} \\\\[6pt]\n\\begin{itemize}\\setlength{\\itemsep}{3pt}\n`;
        data.achievements.forEach((ach) => {
            achievementsLatex += `\\resitem{${latexEscape(ach.name)}}\n`;
        });
        achievementsLatex += `\\end{itemize} \\\\[6pt]`;
    }

    // === INTERESTS ===
    let interestsLatex = "";
    if (data.interests.length > 0) {
        interestsLatex += `\\resheading{\\textbf{INTERESTS AND HOBBIES}} \\\\[6pt]\n\\begin{itemize}\\setlength{\\itemsep}{3pt}\n`;
        data.interests.forEach((interest) => {
            interestsLatex += `\\resitem{${latexEscape(interest.name)}}\n`;
        });
        interestsLatex += `\\end{itemize} \\\\[6pt]`;
    }

    return `
\\documentclass[a4paper,10pt]{article}
\\usepackage[top=0.75in, bottom=0.75in, left=0.55in, right=0.85in]{geometry}
\\usepackage{graphicx}
\\usepackage{hyperref}
\\usepackage{url}
\\usepackage{palatino}
\\usepackage{tabularx}
\\fontfamily{SansSerif}
\\selectfont
\\usepackage[T1]{fontenc}
\\usepackage[utf8]{inputenc}
\\usepackage{color}

\\definecolor{mygrey}{gray}{0.75}
\\textheight=9.75in
\\raggedbottom

\\setlength{\\tabcolsep}{0in}
\\newcommand{\\isep}{-2 pt}
\\newcommand{\\lsep}{-0.5cm}
\\newcommand{\\psep}{-0.6cm}
\\renewcommand{\\labelitemii}{$\\circ$}

\\pagestyle{empty}

% Custom commands
\\newcommand{\\resitem}[1]{\\item #1}
\\newcommand{\\resheading}[1]{{\\small \\colorbox{mygrey}{\\begin{minipage}{0.975\\textwidth}{\\textbf{#1}}\\end{minipage}}}}
\\newcommand{\\ressubheading}[2]{
\\vspace{4pt}
\\begin{tabular*}{6.62in}{l @ {\\extracolsep{\\fill}} r}
\\textsc{\\textbf{#1}} & \\textsc{#2} \\\\
\\end{tabular*}\\\\[2pt]
}

\\begin{document}
${headerLatex}

${summaryLatex}

${educationLatex}

${experienceLatex}

${projectsLatex}

${skillsLatex}

${certificationsLatex}

${achievementsLatex}

${interestsLatex}

\\end{document}
`;
}
