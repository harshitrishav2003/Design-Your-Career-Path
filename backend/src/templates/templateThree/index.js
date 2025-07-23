import { prepareResumeData } from "../../utils/prepareResumeData.js";
import { splitDescription } from "../../utils/escapeUtils.js";

export default function buildTemplateThreeLatex(formData) {
    const data = prepareResumeData(formData);
    const github = formData.github || "";
    const website = formData.website || "";

    // === Summary ===
    let summaryLatex = "";
    if (data.summary) {
        summaryLatex += `\\NewPart{Professional Summary}{}\n\\begin{itemize}\n\\item[\\squigarr] ${data.summary}\n\\end{itemize}\n\n`;
    }

    // === Education ===
    let educationLatex = "";
    if (data.education.length > 0) {
        educationLatex += `\\NewPart{Education}{}\n\n\\begin{itemize}\n`;
        data.education.forEach((edu) => {
            educationLatex += `\\item[\\heartstab] \\textbf{${edu.degree} in ${edu.major}} at ${edu.university} (${edu.start} -- ${edu.end})\n`;
        });
        educationLatex += `\\end{itemize}\n\n`;
    }

    // === Work Experience ===
    let experienceLatex = "";
    if (data.experience.length > 0) {
        experienceLatex += `\\NewPart{Work Experience}{}\n\n\\begin{itemize}\n`;
        data.experience.forEach((exp) => {
            experienceLatex += `\\item[\\heartstab] \\textbf{${exp.position} at ${exp.company}} (${exp.start} -- ${exp.end}), ${exp.city}\n`;
            splitDescription(exp.desc).forEach(line => {
                experienceLatex += `\\squigarr ${line}\n`;
            });
        });
        experienceLatex += `\\end{itemize}\n\n`;
    }

    // === Skills ===
    let skillsLatex = "";
    if (data.skills.length > 0) {
        skillsLatex += `\\NewPart{Skills}{}\n\n`;
        data.skills.forEach(skill => {
            skillsLatex += `\\SkillsEntry{${skill.name}}{}\n`;
        });
        skillsLatex += `\n`;
    }

    // === Achievements ===
    let achievementsLatex = "";
    if (data.achievements.length > 0) {
        achievementsLatex += `\\NewPart{Achievements}{}\n\n\\begin{itemize}\n`;
        data.achievements.forEach((ach) => {
            achievementsLatex += `\\item[\\heartstab] ${ach.name}\n`;
        });
        achievementsLatex += `\\end{itemize}\n\n`;
    }

    // === Certifications ===
    let certificationsLatex = "";
    if (data.certifications.length > 0) {
        certificationsLatex += `\\NewPart{Certifications}{}\n\n\\begin{itemize}\n`;
        data.certifications.forEach((cert) => {
            certificationsLatex += `\\item[\\heartstab] ${cert.name}\n`;
        });
        certificationsLatex += `\\end{itemize}\n\n`;
    }

    // === Extra Curricular ===
    let extraLatex = "";
    if (data.extraCurricular && data.extraCurricular.length > 0) {
        extraLatex += `\\NewPart{Extra Curricular}{}\n\n\\begin{itemize}\n`;
        data.extraCurricular.forEach((extra) => {
            extraLatex += `\\item[\\heartstab] ${extra.name}\n`;
        });
        extraLatex += `\\end{itemize}\n\n`;
    }

    // === Interests ===
    let interestsLatex = "";
    if (data.interests.length > 0) {
        interestsLatex += `\\NewPart{Interests}{}\n\n\\begin{itemize}\n`;
        data.interests.forEach((interest) => {
            interestsLatex += `\\item[\\heartstab] ${interest.name}\n`;
        });
        interestsLatex += `\\end{itemize}\n\n`;
    }

    return `
\\documentclass[paper=a4,fontsize=11pt]{scrartcl}

\\usepackage[english]{babel}
\\usepackage[utf8x]{inputenc}
\\usepackage[protrusion=true,expansion=true]{microtype}
\\usepackage{amsmath,amsfonts,amsthm}
\\usepackage{graphicx}
\\usepackage[svgnames]{xcolor}
\\usepackage[margin=0.5in]{geometry}
\\textheight=700px
\\usepackage{url}

\\usepackage{tikz}
\\usepackage{kpfonts}
\\usepackage{color}
\\newcommand*\\Hs{\\ensuremath{\\color{red}\\varheartsuit}}
\\newcommand{\\heartstab}{%
\\begin{tikzpicture}%
\\draw [line width=0.0mm, white] (3.5ex,0.4ex) -- (3.5ex,0.4ex);
\\Large{$\\Hs$};
\\draw [line width=0.30mm, black] (-0.7ex,0.7ex) -- (1.2ex,1.2ex);%
\\draw [line width=0.50mm, black] (0.8ex,0.65ex) -- (0.55ex,1.45ex);%
\\end{tikzpicture}%
}
\\newcommand{\\squigarr}{
{\\Large \\color{blue}$\\rightsquigarrow$}
}

\\usepackage[colorlinks=true,urlcolor=purple]{hyperref}

\\frenchspacing
\\pagestyle{empty}

\\usepackage{sectsty}
\\sectionfont{\\usefont{OT1}{phv}{b}{n}\\sectionrule{0pt}{0pt}{-5pt}{3pt}}

\\newlength{\\spacebox}
\\settowidth{\\spacebox}{8888888888}
\\newcommand{\\sepspace}{\\vspace*{0.5em}}

\\newcommand{\\NameEmailPhoneSiteGithub}[5]{
\\Huge \\usefont{OT1}{phv}{m}{n} \\textbf{#1}
\\large \\usefont{OT1}{phv}{m}{n} \\hfill #2\\hspace{25pt}#3

\\textit{${data.jobTitle}}\\hfill \\textit{website } \\href{${website}}{${website}} \\hspace{25pt}\\textit{github } \\href{${github}}{${github}}
\\par \\normalsize \\normalfont
}

\\newcommand{\\NewPart}[1]{\\section*{\\uppercase{#1}}}

\\newcommand{\\SkillsEntry}[2]{
\\noindent\\hangindent=2em\\hangafter=0
\\parbox{\\spacebox}{\\textit{#1}}\\hspace{1.5em} #2 \\par}

\\begin{document}

\\NameEmailPhoneSiteGithub{${data.name}}{${data.phone}}{${data.email}}{${website}}{${github}}

\\sepspace

${summaryLatex}
${educationLatex}
${experienceLatex}
${skillsLatex}
${achievementsLatex}
${certificationsLatex}
${extraLatex}
${interestsLatex}

\\end{document}
`;
}
