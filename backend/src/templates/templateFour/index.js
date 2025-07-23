import { prepareResumeData } from "../../utils/prepareResumeData.js";
import { splitDescription } from "../../utils/escapeUtils.js";

function latexEscape(str = "") {
    return str
        .replace(/\\/g, "\\textbackslash{}")
        .replace(/%/g, "\\%")
        .replace(/\$/g, "\\$")
        .replace(/#/g, "") // remove #
        .replace(/&/g, "\\&")
        .replace(/{/g, "\\{")
        .replace(/}/g, "\\}")
        .replace(/_/g, "\\_")
        .replace(/\^/g, "\\^{}")
        .replace(/~/g, "\\~{}");
}

export default function buildTemplateFourLatex(formData) {
    const data = prepareResumeData(formData);

    // === Skills ===
    let skillsLatex = "";
    if (data.skills.length > 0) {
        skillsLatex += `\\section{Skills}\n\n`;
        skillsLatex += `\\begin{multicols}{2}\n`;
        skillsLatex += `\\begin{itemize}[itemsep=-2px, parsep=1pt, leftmargin=75pt]\n`;
        data.skills.forEach(skill => {
            skillsLatex += `\\item[\\textbf{${latexEscape(skill.name)}}] \n`;
        });
        skillsLatex += `\\end{itemize}\n\\end{multicols}\n\n`;
    }

    // === Experience ===
    let experienceLatex = "";
    if (data.experience.length > 0) {
        experienceLatex += `\\section{Experience}\n\n`;
        data.experience.forEach(exp => {
            // Line 1: Company & Dates
            experienceLatex += `\\headingBf{${latexEscape(exp.company)}}{${latexEscape(exp.start)} -- ${latexEscape(exp.end)}}\n`;

            // Line 2: Position & City, State
            experienceLatex += `\\headingBf{${latexEscape(exp.position)}}{${latexEscape(exp.city)}, ${latexEscape(exp.state)}}\n`;

            // Bullets
            experienceLatex += `\\begin{resume_list}\n`;
            splitDescription(exp.desc).forEach(line => {
                experienceLatex += `\\item ${latexEscape(line)}\n`;
            });
            experienceLatex += `\\end{resume_list}\n\n`;
        });
    }

    // === Education ===
    let educationLatex = "";
    if (data.education.length > 0) {
        educationLatex += `\\section{Education}\n\n`;
        data.education.forEach(edu => {
            educationLatex += `\\headingBf{${latexEscape(edu.university)}}{${latexEscape(edu.start)} -- ${latexEscape(edu.end)}}\n`;
            educationLatex += `\\headingIt{${latexEscape(edu.degree)} in ${latexEscape(edu.major)}}{}\n`;
            if (edu.desc && edu.desc.trim() !== "") {
                educationLatex += `\\begin{resume_list}\n`;
                splitDescription(edu.desc).forEach(line => {
                    educationLatex += `\\item ${latexEscape(line)}\n`;
                });
                educationLatex += `\\end{resume_list}\n\n`;
            } else {
                educationLatex += `\n`;
            }
        });
    }

    // === Certifications ===
    let certificationsLatex = "";
    if (data.certifications.length > 0) {
        certificationsLatex += `\\section{Certifications}\n\n`;
        certificationsLatex += `\\begin{resume_list}\n`;
        data.certifications.forEach(cert => {
            certificationsLatex += `\\item ${latexEscape(cert.name)}\n`;
        });
        certificationsLatex += `\\end{resume_list}\n\n`;
    }

    // === Achievements ===
    let achievementsLatex = "";
    if (data.achievements.length > 0) {
        achievementsLatex += `\\section{Achievements}\n\n`;
        achievementsLatex += `\\begin{resume_list}\n`;
        data.achievements.forEach(ach => {
            achievementsLatex += `\\item ${latexEscape(ach.name)}\n`;
        });
        achievementsLatex += `\\end{resume_list}\n\n`;
    }

    // === Projects ===
    let projectsLatex = "";
    if (data.projects.length > 0) {
        projectsLatex += `\\section{Projects}\n\n`;
        data.projects.forEach(proj => {
            const projectName = latexEscape(proj.projectName || "");
            const link = proj.link || "";
            const desc = latexEscape(proj.description || "");

            projectsLatex += `\\headingBf{${projectName}}{\\href{${link}}{Demo}}\n`;
            projectsLatex += `\\begin{resume_list}\n`;
            projectsLatex += `\\item ${desc}\n`;
            projectsLatex += `\\end{resume_list}\n\n`;
        });
    }

    // === Interests ===
    let interestsLatex = "";
    if (data.interests.length > 0) {
        interestsLatex += `\\section{Interests}\n\n`;
        interestsLatex += `\\begin{multicols}{2}\n`;
        interestsLatex += `\\begin{itemize}[itemsep=-2px, parsep=1pt, leftmargin=75pt]\n`;
        data.interests.forEach(interest => {
            interestsLatex += `\\item[\\textbf{${latexEscape(interest.name)}}] \n`;
        });
        interestsLatex += `\\end{itemize}\n\\end{multicols}\n\n`;
    }

    // === Summary ===
    let summaryLatex = "";
    if (data.summary) {
        summaryLatex += `\\tinysection{Summary}\n${latexEscape(data.summary)}\n\n`;
    }

    // === Contact Info ===
    const name = latexEscape(data.name || "Name");
    const jobTitle = latexEscape(data.jobTitle || "Job Title");
    const address = latexEscape(data.address || "Your Address");
    const phone = latexEscape(data.phone || "N/A");
    const email = latexEscape(data.email || "N/A");

    //  Social links latex
    let socials = "";
    if (data.social && data.social.length > 0) {
        socials = data.social
            .map(
                soc => `\\href{${soc.link}}{${soc.name}}`
            )
            .join(" ~ | ~ ");
    }
    console.log("data.social", data.social)
    return `
\\documentclass[letterpaper,10pt]{article}

\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage{multicol}
\\usepackage{bookmark}
\\usepackage{lastpage}
\\usepackage{CormorantGaramond}
\\usepackage{charter}
\\usepackage{xcolor}

\\definecolor{accentTitle}{HTML}{0e6e55}
\\definecolor{accentText}{HTML}{0e6e55}
\\definecolor{accentLine}{HTML}{a16f0b}

\\pagestyle{fancy}
\\fancyhf{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}
\\urlstyle{same}

\\addtolength{\\oddsidemargin}{-0.7in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1.19in}
\\addtolength{\\topmargin}{-0.7in}
\\addtolength{\\textheight}{1.4in}

\\setlength{\\multicolsep}{-3.0pt}
\\setlength{\\columnsep}{-1pt}
\\setlength{\\tabcolsep}{0pt}
\\setlength{\\footskip}{3.7pt}
\\raggedbottom
\\raggedright

\\input{glyphtounicode}
\\pdfgentounicode=1

\\titleformat{\\section}{
  \\vspace{-5pt}
  \\color{accentText}
  \\raggedright\\large\\bfseries
}{}{0em}{}[\\color{accentLine}\\titlerule]

\\newcommand{\\documentTitle}[2]{
  \\begin{center}
    {\\Huge\\color{accentTitle} #1} \\\\
    {\\large\\color{accentText} #2}
    \\vspace{10pt}
    {\\color{accentLine} \\hrule}
    \\vspace{2pt}
    \\footnotesize{
      ${address} ~ | ~ Phone: ${phone} ~ | ~ Email: ${email} ~ | ~ ${socials}
    }
    \\vspace{2pt}
    {\\color{accentLine} \\hrule}
  \\end{center}
}

\\newcommand{\\tinysection}[1]{
  \\phantomsection
  \\addcontentsline{toc}{section}{#1}
  {\\large{\\bfseries\\color{accentText}#1} {\\color{accentLine} |}}
}

\\newcommand{\\headingBf}[2]{#1\\hfill#2 \\\\}
\\newcommand{\\headingIt}[2]{\\textit{#1}#2 \\\\}

\\newenvironment{resume_list}{
  \\vspace{-7pt}
  \\begin{itemize}[itemsep=-2px, parsep=1pt, leftmargin=30pt]
}{
  \\end{itemize}
}

\\begin{document}

\\documentTitle{${name}}{${jobTitle}}

${summaryLatex}
${skillsLatex}
${experienceLatex}
${educationLatex}
${certificationsLatex}
${achievementsLatex}
${projectsLatex}
${interestsLatex}

\\end{document}
`;
}
