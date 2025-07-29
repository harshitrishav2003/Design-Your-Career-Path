import { prepareResumeData } from "../../utils/prepareResumeData.js";
import { splitDescription } from "../../utils/escapeUtils.js";

function latexEscape(str = "") {
  return str
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/&/g, "\\&")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}")
    .replace(/_/g, "\\_")
    .replace(/\^/g, "\\^{}")
    .replace(/~/g, "\\~{}");
}

export default function buildTemplateJakeLatex(formData) {
  const data = prepareResumeData(formData);

  // === Header ===
  const name = latexEscape(data.name);
  const email = latexEscape(data.email);
  const phone = latexEscape(data.phone);

  let socialLatex = "";
  if (Array.isArray(data.social)) {
    socialLatex = data.social
      .map(
        (social) =>
          `\\href{${latexEscape(social.link)}}{\\underline{${latexEscape(social.name)}}}`
      )
      .join(" $|$ ");
  }

  const headerLatex = `
\\begin{center}
  \\textbf{\\Huge \\scshape ${name}} \\\\
  \\small ${phone} $|$ \\href{mailto:${email}}{\\underline{${email}}} $|$ ${socialLatex}
\\end{center}
`;

  // === Summary ===
  let summaryLatex = "";
  if (data.summary && data.summary.trim()) {
    summaryLatex += `\\section{Professional Summary}\n\\begin{itemize}[leftmargin=0.004in, label={}]\n`;
    summaryLatex += `\\resumeItem{${latexEscape(data.summary)}}\n`;
    summaryLatex += `\\end{itemize}\n`;
  }

  // === Experience ===
  let experienceLatex = "";
  if (data.experience.length > 0) {
    experienceLatex += "\\section{Experience}\n\\resumeSubHeadingListStart\n";
    data.experience.forEach((exp) => {
      experienceLatex += `\\resumeSubheading
{${latexEscape(exp.company)}}{${latexEscape(exp.start)} -- ${latexEscape(exp.end)}}
{${latexEscape(exp.position)}}{${latexEscape(exp.city)}, ${latexEscape(exp.state)}}
\\resumeItemListStart\n`;
      splitDescription(exp.desc).forEach((line) => {
        experienceLatex += `\\resumeItem{${latexEscape(line)}}\n`;
      });
      experienceLatex += "\\resumeItemListEnd\n";
    });
    experienceLatex += "\\resumeSubHeadingListEnd\n";
  }

  // === Education ===
  let educationLatex = "";
  if (data.education.length > 0) {
    educationLatex += "\\section{Education}\n";
    data.education.forEach((edu) => {
      educationLatex += `\\resumeSubHeadingListStart\n\\resumeSubheading
{${latexEscape(edu.university)}}{${latexEscape(edu.start)} -- ${latexEscape(edu.end)}}
{\\textbf{${latexEscape(edu.degree)} in ${latexEscape(edu.major)}}}{${latexEscape(edu.city)}}
`;
      if (edu.desc && edu.desc.trim()) {
        educationLatex += `\\resumeItemListStart\n`;
        splitDescription(edu.desc).forEach((line) => {
          educationLatex += `\\resumeItem{${latexEscape(line)}}\n`;
        });
        educationLatex += `\\resumeItemListEnd\n`;
      }
      educationLatex += "\\resumeSubHeadingListEnd\n";
    });
  }

  // === Projects ===
  let projectLatex = "";
  if (data.projects.length > 0) {
    projectLatex += "\\section{Projects}\n";
    data.projects.forEach((proj) => {
      projectLatex += `\\resumeSubHeadingListStart\n\\item
\\begin{tabular*}{1.0\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
\\textbf{${latexEscape(proj.projectName)}} & \\href{${latexEscape(proj.link)}}{Demo} \\\\
\\end{tabular*}\n\\resumeItemListStart\n`;
      splitDescription(proj.description).forEach((line) => {
        projectLatex += `\\resumeItem{${latexEscape(line)}}\n`;
      });
      projectLatex += `\\resumeItemListEnd\n\\resumeSubHeadingListEnd\n`;
    });
  }

  // === Skills ===
  let skillsLatex = "";
  if (data.skills.length > 0) {
    skillsLatex += "\\section{Skills}\n";
    skillsLatex += "\\small{\\item{";
    data.skills.forEach((skill, idx) => {
      skillsLatex += `${latexEscape(skill.name)}${
        idx < data.skills.length - 1 ? ", " : ""
      }`;
    });
    skillsLatex += "}}\n";
  }

  // === Certifications ===
  let certificationsLatex = "";
  if (data.certifications.length > 0) {
    certificationsLatex += "\\section{Certifications / Extra-Curriculum}\n\\resumeItemListStart\n";
    data.certifications.forEach((cert) => {
      certificationsLatex += `\\resumeItem{${latexEscape(cert.name)}}\n`;
    });
    certificationsLatex += "\\resumeItemListEnd\n";
  }

  // === Achievements ===
  let achievementsLatex = "";
  if (data.achievements.length > 0) {
    achievementsLatex += "\\section{Achievements}\n\\resumeItemListStart\n";
    data.achievements.forEach((ach) => {
      achievementsLatex += `\\resumeItem{${latexEscape(ach.name)}}\n`;
    });
    achievementsLatex += "\\resumeItemListEnd\n";
  }

  // === Interests ===
  let interestsLatex = "";
  if (data.interests.length > 0) {
    interestsLatex += "\\section{Interests}\n\\resumeItemListStart\n";
    data.interests.forEach((interest) => {
      interestsLatex += `\\resumeItem{${latexEscape(interest.name)}}\n`;
    });
    interestsLatex += "\\resumeItemListEnd\n";
  }

  // === Return the complete document ===
  return `
\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{fontawesome5}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}
\\titleformat{\\section}{\\vspace{-4pt}\\scshape\\raggedright\\large\\bfseries}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]
\\pdfgentounicode=1

% Custom commands
\\newcommand{\\resumeItem}[1]{\\item\\small{{#1 \\vspace{-2pt}}}}
\\newcommand{\\resumeSubheading}[4]{\\vspace{-2pt}\\item
\\begin{tabular*}{1.0\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
\\textbf{#1} & \\textbf{\\small #2} \\\\
\\textit{\\small#3} & \\textit{\\small #4} \\\\
\\end{tabular*}\\vspace{-7pt}}
\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.0in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}
${headerLatex}
${summaryLatex}
${experienceLatex}
${educationLatex}
${projectLatex}
${skillsLatex}
${certificationsLatex}
${achievementsLatex}
${interestsLatex}
\\end{document}
`;
}
