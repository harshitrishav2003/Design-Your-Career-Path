import { prepareResumeData } from "../../utils/prepareResumeData.js";
import { splitDescription } from "../../utils/escapeUtils.js";

export default function buildTemplateTwoLatex(formData) {
   const data = prepareResumeData(formData);

   // === Work Experience ===
   let workExperienceLatex = "";
   if (data.experience.length > 0) {
      workExperienceLatex += "\\section{Work Experience}\n\\vspace{4pt}\n";
      workExperienceLatex += "\\resumeSubHeadingListStart\n";

      data.experience.forEach((exp) => {
         workExperienceLatex += `\\resumeSubheading
{${exp.company}}{${exp.start} -- ${exp.end}}
{\\textbf{${exp.position}}}{${exp.city}, ${exp.state}}
\\resumeItemListStart
`;

         splitDescription(exp.desc).forEach((line) => {
            workExperienceLatex += `\\resumeItem{${line}}\n`;
         });

         workExperienceLatex += "\\resumeItemListEnd\n";
      });

      workExperienceLatex += "\\resumeSubHeadingListEnd\n";
   }

   // === Education ===
   let educationLatex = "";
   if (data.education.length > 0) {
      educationLatex += "\\section{Education}\n";

      data.education.forEach((edu) => {
         educationLatex += `
\\resumeSubHeadingListStart
\\resumeSubheading
{${edu.university}}{${edu.start} -- ${edu.end}}
{\\textbf{${edu.degree} in ${edu.major}}}{${edu.city}}
`;

         if (edu.desc && edu.desc.trim() !== "") {
            educationLatex += `\\begin{resume_list}\n`;
            splitDescription(edu.desc).forEach((line) => {
               educationLatex += `\\item ${line}\n`;
            });
            educationLatex += `\\end{resume_list}\n`;
         }

         educationLatex += "\\resumeSubHeadingListEnd\n";
      });
   }

   // === Certifications ===
   let certificationsLatex = "";
   if (data.certifications.length > 0) {
      certificationsLatex +=
         "\\section{Certifications / Extra-Curriculum}\n\\resumeItemListStart\n";
      data.certifications.forEach((cert) => {
         certificationsLatex += `\\resumeItem{${cert.name}}\n`;
      });
      certificationsLatex += "\\resumeItemListEnd\n";
   }

   // === Achievements ===
   let achievementsLatex = "";
   if (data.achievements.length > 0) {
      achievementsLatex += "\\section{Achievements}\n\\resumeItemListStart\n";
      data.achievements.forEach((ach) => {
         achievementsLatex += `\\resumeItem{${ach.name}}\n`;
      });
      achievementsLatex += "\\resumeItemListEnd\n";
   }

   // === Skills ===
   let skillsLatex = "";
   if (data.skills.length > 0) {
      skillsLatex += "\\section{Skills}\n";
      skillsLatex += "\\small{\\item{";
      data.skills.forEach((skill, idx) => {
         skillsLatex += `${skill.name}${idx < data.skills.length - 1 ? ", " : ""}`;
      });
      skillsLatex += "}}\n";
   }

   // === Interests ===
   let interestsLatex = "";
   if (data.interests.length > 0) {
      interestsLatex += "\\section{Interests}\n\\resumeItemListStart\n";
      data.interests.forEach((interest) => {
         interestsLatex += `\\resumeItem{${interest.name}}\n`;
      });
      interestsLatex += "\\resumeItemListEnd\n";
   }

   // === Projects ===
   let projectsLatex = "";
   if (data.projects.length > 0) {
      projectsLatex += "\\section{Projects}\n";

      data.projects.forEach((proj) => {
         const projectName = proj.projectName || "";
         const link = proj.link || "";
         const desc = proj.description || "";

         projectsLatex += `\\resumeSubHeadingListStart\n`;

         // ✅ Project name LEFT | Demo link RIGHT
         projectsLatex += `
\\item
\\begin{tabular*}{1.0\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
\\textbf{${projectName}} & \\href{${link}}{Demo} \\\\
\\end{tabular*}
`;

         projectsLatex += `\\resumeItemListStart\n`;
         projectsLatex += `\\resumeItem{${desc}}\n`;
         projectsLatex += `\\resumeItemListEnd\n`;

         projectsLatex += `\\resumeSubHeadingListEnd\n`;
      });
   }



   // === Social Links ===
   let socialLatex = "";
   if (Array.isArray(data.social) && data.social.length > 0) {
      socialLatex += "~"; // spacing

      data.social.forEach((item) => {
         const name = item.name.toLowerCase();
         const link = item.link;

         if (!link) return; // skip empty link

         if (name.includes("linkedin")) {
            socialLatex += `\\href{${link}}{\\raisebox{-0.2\\height}\\faLinkedin\\ \\underline{LinkedIn}} ~ `;
         } else if (name.includes("github")) {
            socialLatex += `\\href{${link}}{\\raisebox{-0.2\\height}\\faGithub\\ \\underline{GitHub}} ~ `;
         } else if (name.includes("twitter")) {
            socialLatex += `\\href{${link}}{\\raisebox{-0.2\\height}\\faTwitter\\ \\underline{Twitter}} ~ `;
         } else if (name.includes("instagram")) {
            socialLatex += `\\href{${link}}{\\raisebox{-0.2\\height}\\faInstagram\\ \\underline{Instagram}} ~ `;
         } else {
            // fallback: no icon, just text
            socialLatex += `\\href{${link}}{\\underline{${item.name}}} ~ `;
         }
      });
   }


   return `
\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{fontawesome5}
\\usepackage{multicol}
\\setlength{\\multicolsep}{-3.0pt}
\\setlength{\\columnsep}{-1pt}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.6in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1.19in}
\\addtolength{\\topmargin}{-.7in}
\\addtolength{\\textheight}{1.4in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large\\bfseries
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\pdfgentounicode=1

% Custom commands
\\newcommand{\\resumeItem}[1]{\\item\\small{{#1 \\vspace{-2pt}}}}
\\newcommand{\\resumeSubheading}[4]{\\vspace{-2pt}\\item
\\begin{tabular*}{1.0\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
\\textbf{#1} & \\textbf{\\small #2} \\\\
\\textit{\\small#3} & \\textit{\\small #4} \\\\
\\end{tabular*}\\vspace{-7pt}
}
\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.0in, label={}]} 
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

\\begin{center}
{\\Huge \\scshape ${data.name}} \\\\ \\vspace{2pt}
\\small \\raisebox{-0.1\\height}\\faPhone\\ ${data.phone} ~
\\href{mailto:${data.email}}{\\raisebox{-0.2\\height}\\faEnvelope\\ \\underline{${data.email}}} 
${socialLatex}
\\vspace{-4pt}
\\end{center}

\\section{Professional Summary}
\\begin{itemize}[leftmargin=0.004in, label={}]
\\resumeItem{${data.summary}}
\\end{itemize}

${workExperienceLatex}

${educationLatex}

${certificationsLatex}

${achievementsLatex}

${projectsLatex}

${interestsLatex}

${skillsLatex}

\\end{document}
`;
}
