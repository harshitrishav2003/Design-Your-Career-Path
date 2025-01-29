
const express = require('express');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process'); // To run the LaTeX compiler
const { PDFDocument, StandardFonts } = require('pdf-lib');
const cors = require('cors');
const port = process.env.PORT || 5001;
const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://127.0.0.1:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Ensure the 'resumes' directory exists
const resumesDir = path.join(__dirname, 'resumes');
if (!fs.existsSync(resumesDir)) {
    fs.mkdirSync(resumesDir);
}

// Serve generated PDFs
app.use('/resumes', express.static(path.join(__dirname, 'resumes')));


function escapeLatexSpecialChars(input) {
    // Ensure input is a string before applying .replace
    if (input && typeof input === 'string') {
        return input.replace(/([#%\^&_\${}~])/g, '\\$1');
    }
    return input;  // Return undefined or input as is if not a string
}


app.post('/api/generate-resume', async (req, res) => {
    const formData = req.body;

    try {
        // Escape LaTeX special characters in form data fields
        const escapedName = escapeLatexSpecialChars(formData.name);
        const escapedEmail = escapeLatexSpecialChars(formData.email);
        const escapedMobile = escapeLatexSpecialChars(formData.mobile);
        const escapedRollNo = escapeLatexSpecialChars(formData.rollno);
        const escapedBranch = escapeLatexSpecialChars(formData.branch);
        const escapedCollege = escapeLatexSpecialChars(formData.college);
        const escapedSchool12 = escapeLatexSpecialChars(formData.school12);
        const escapedYear12 = escapeLatexSpecialChars(formData.year12);
        const escapedPercent12 = escapeLatexSpecialChars(formData.percent12);
        const escapedSchool10 = escapeLatexSpecialChars(formData.school10);
        const escapedYear10 = escapeLatexSpecialChars(formData.year10);
        const escapedPercent10 = escapeLatexSpecialChars(formData.percent10);
        const escapedBoard12 = escapeLatexSpecialChars(formData.board12);

        const escapedBoard10 = escapeLatexSpecialChars(formData.board10);

        const escapedExp1 = escapeLatexSpecialChars(formData.exp1);
       
        const escapedSocial1 = escapeLatexSpecialChars(formData.social1);
        const escapedSocial2 = escapeLatexSpecialChars(formData.social2);
        let experienceLatex = '';
if (formData.includeExperience && formData.experiences && Array.isArray(formData.experiences)) {
    experienceLatex += '\\section{EXPERIENCE}';
    formData.experiences.forEach((exp, index) => {
        const escapedExp = escapeLatexSpecialChars(exp.expName || `Experience ${index + 1}`);
        const escapedExpYear = escapeLatexSpecialChars(exp.expYear || 'Year');
        const escapedExpPlace = escapeLatexSpecialChars(exp.expPlace || 'Place');
        const escapedExpDetails1 = escapeLatexSpecialChars(exp.expDetails1 || 'Details 1');
        const escapedExpDetails2 = escapeLatexSpecialChars(exp.expDetails2 || 'Details 2');
        const escapedPosition = escapeLatexSpecialChars(exp.expPosition || 'Web Developer');  // Add position dynamically

        experienceLatex += `
        \\resumeSubHeadingListStart
           \\resumeSubheading
              {${escapedExp}}
              {${escapedExpYear}}
              {\\underline{${escapedPosition}}}{${escapedExpPlace}} 
              \\resumeItemListStart
                 \\resumeItem{\\normalsize{${escapedExpDetails1}}}
                 
        `;

        // Loop through the items and add them as resume items
        if (exp.items && Array.isArray(exp.items)) {
            exp.items.forEach((item) => {
                const escapedItem = escapeLatexSpecialChars(item.content || 'Item');
                experienceLatex += `\\resumeItem{\\normalsize{${escapedItem}}}`;
            });
        }

        experienceLatex += `
              \\resumeItemListEnd
        \\resumeSubHeadingListEnd
        \\vspace{-17pt}`;
    });
}

let projectLatex = '';

// Check if the "Projects" section is included
if (formData.includeProjects && formData.projects && Array.isArray(formData.projects)) {
    projectLatex += '\\section{ACADEMIC PROJECT}';
    formData.projects.forEach((proj, index) => {
        const escapedProjName = escapeLatexSpecialChars(proj.projectName);
        const escapedProjLink = escapeLatexSpecialChars(proj.projectLink);
        const escapedProjDetails1 = escapeLatexSpecialChars(proj.projectDetails1);
        const escapedProjDetails2 = escapeLatexSpecialChars(proj.projectDetails2);

        // Start of the project section
        projectLatex += `
%-----------PROJECTS-----------

    \\vspace{-5pt}
    \\resumeSubHeadingListStart
        \\resumeProjectHeading
        {\\href{${escapedProjLink || '#'}}{\\textbf{\\large{\\underline{${escapedProjName || 'Project ' + (index + 1)}}}} \\href{${escapedProjLink || '#'}}{\\raisebox{-0.1\\height}\\faExternalLink }}  \\large}{}
        \\resumeItemListStart
            \\resumeItem{\\normalsize{${escapedProjDetails1 || 'Project Details 1'}}}
            \\resumeItem{\\normalsize{${escapedProjDetails2 || 'Project Details 2'}}}
`;

        // Loop through details items if they exist and append them
        if (proj.detailsItems && Array.isArray(proj.detailsItems)) {
            proj.detailsItems.forEach((item, itemIndex) => {
                const escapedItemContent = escapeLatexSpecialChars(item.content);
                projectLatex += `
            \\resumeItem{\\normalsize{${escapedItemContent || 'Project Detail Item ' + (itemIndex + 1)}}}
`;
            });
        }

        // End of the project section
        projectLatex += `
        \\resumeItemListEnd
    \\resumeSubHeadingListEnd
\\vspace{-20pt}
`;
    });
}

let skillsLatex = '';

if (formData.includeSkills && formData.skills && Array.isArray(formData.skills)) {
    skillsLatex  += '\\section{SKILLS}'
    formData.skills.forEach((skill, index) => {
        const escapedSkillName = escapeLatexSpecialChars(skill.skillName);
        // const escapedSkillLevel = escapeLatexSpecialChars(skill.skillLevel);
        // const escapedSkillDetails = escapeLatexSpecialChars(skill.skillDetails);

        skillsLatex += `
%-----------SKILLS-----------

    \\vspace{-5pt}
    \\resumeSubHeadingListStart
       
         \\resumeItemListStart
            \\resumeItem{\\normalsize{${escapedSkillName || 'Skill ' + (index + 1)}}}
            
        \\resumeItemListEnd
    \\resumeSubHeadingListEnd
\\vspace{-14pt}
`;
    });
}
// Generate LaTeX sections conditionally
let achievementSection = '';

if (formData.includeAchievements && formData.achievements.length > 0) {
    achievementSection = `
    \\section{ACADEMIC ACHIEVEMENTS AND POSITIONS OF RESPONSIBILITY }
    \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
    \\resumeItemListStart
    ${formData.achievements.map(ach => (
        `\\resumeItem{\\normalsize{${ach.achievementName}}}\\\\`
    )).join('\n')}
    \\resumeItemListEnd
    }}
    \\end{itemize}
    \\vspace{-16pt}
    `;
}
let extraCurricularSection = '';
if (formData.includeExtraCurricular && formData.extraCurricular.length > 0) {
    extraCurricularSection = `
    \\section{EXTRA-CURRICULAR ACTIVITIES AND ACHIEVEMENTS}
    \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
    \\resumeItemListStart
    ${formData.extraCurricular.map(activity => (
        `\\resumeItem{\\normalsize{${activity.activityName}}}\\\\`
    )).join('\n')}
    \\resumeItemListEnd
    }}
    \\end{itemize}
    \\vspace{-16pt}
    `;
}
let customSections = '';

    if (formData.customSections && formData.customSections.length > 0) {
        formData.customSections.forEach(section => {
            if (section.include && section.items.length > 0) {
                customSections += `
                \\section{${section.sectionTitle.toUpperCase()}}
                \\begin{itemize}[leftmargin=0.15in, label={}]
                \\small{\\item{
                \\resumeItemListStart
                ${section.items.map(item => (
                    `\\resumeItem{\\normalsize{${item}}}\\\\`
                )).join('\n')}
                \\resumeItemListEnd
                }}
                \\end{itemize}
                \\vspace{-16pt}
                `;
            }
        });
    }
    let socialLinksLatex = '';

if (formData.includeSocial && formData.socialLinks.length > 0) {
    socialLinksLatex = formData.socialLinks.map(social => (
        `\\href{${social.link}}{\\raisebox{-0.2\\height}\\faUser\\ \\underline{${social.platform}}} \\hfill`
    )).join('\n    ');
}


        // 1. Generate LaTeX Code
        let latexContent = `


\\documentclass[letterpaper,11pt]{article}


\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{fontawesome5}
\\usepackage{multicol}
\\usepackage{graphicx}
\\setlength{\\multicolsep}{-3.0pt}
\\setlength{\\columnsep}{-1pt}
\\input{glyphtounicode}


\\RequirePackage{tikz}
\\RequirePackage{xcolor}
\\RequirePackage{fontawesome}
\\usepackage{tikz}
\\usetikzlibrary{svg.path}




\\definecolor{cvblue}{HTML}{0E5484}
\\definecolor{black}{HTML}{130810}
\\definecolor{darkcolor}{HTML}{0F4539}
\\definecolor{cvgreen}{HTML}{3BD80D}
\\definecolor{taggreen}{HTML}{00E278}
\\definecolor{SlateGrey}{HTML}{2E2E2E}
\\definecolor{LightGrey}{HTML}{666666}
\\colorlet{name}{black}
\\colorlet{tagline}{darkcolor}
\\colorlet{heading}{darkcolor}
\\colorlet{headingrule}{cvblue}
\\colorlet{accent}{darkcolor}
\\colorlet{emphasis}{SlateGrey}
\\colorlet{body}{LightGrey}






%----------FONT OPTIONS----------
% sans-serif
% \\usepackage[sfdefault]{FiraSans}
% \\usepackage[sfdefault]{roboto}
% \\usepackage[sfdefault]{noto-sans}
% \\usepackage[default]{sourcesanspro}


% serif
% \\usepackage{CormorantGaramond}
% \\usepackage{charter}




% \\pagestyle{fancy}
% \\fancyhf{}  % clear all header and footer fields
% \\fancyfoot{}
% \\renewcommand{\\headrulewidth}{0pt}
% \\renewcommand{\\footrulewidth}{0pt}


% Adjust margins
\\addtolength{\\oddsidemargin}{-0.6in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1.19in}
\\addtolength{\\topmargin}{-.7in}
\\addtolength{\\textheight}{1.4in}


\\urlstyle{same}


\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}


% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large\\bfseries
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]


% Ensure that generate pdf is machine readable/ATS parsable
\\pdfgentounicode=1


%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}


\\newcommand{\\classesList}[4]{
    \\item\\small{
        {#1 #2 #3 #4 \\vspace{-2pt}}
  }
}


\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{1.0\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{\\large#1} & \\textbf{\\small #2} \\\\
      \\textit{\\large#3} & \\textit{\\small #4} \\\\
     
    \\end{tabular*}\\vspace{-7pt}
}


\\newcommand{\\resumeSubSubheading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textit{\\small#1} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-7pt}
}




\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{1.001\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & \\textbf{\\small #2}\\\\
    \\end{tabular*}\\vspace{-7pt}
}


\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}


\\renewcommand\\labelitemi{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}
\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}


\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.0in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}




\\newcommand\\sbullet[1][.5]{\\mathbin{\\vcenter{\\hbox{\\scalebox{#1}{$\\bullet$}}}}}


%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%




\\begin{document}


%----------HEADING----------




\\begin{center}
   {\\Huge \\scshape {${escapedName || 'Name'}}} \\\\ \\vspace{2pt}
    
    \\small
    \\raisebox{-0.1\\height}\\faPhone\\ \\underline{${escapedMobile || 'Mobile'}}} \\hfill
    \\raisebox{-0.1\\height}\\faEnvelope\ \\underline{${formData.email.replace(/_/g, '\\_').replace(/@/g, '\\@') || 'Email'}} \\hfill
    ${escapedRollNo ? `\\underline{${escapedRollNo}} \\hfill` : ''}
    ${socialLinksLatex}
\\end{center}

\\vspace{-16pt}



%-----------EDUCATION-----------
\\section{EDUCATION}

\\begin{tabularx}{\\textwidth}{|p{7cm}|p{2cm}|p{8cm}|p{2.5cm}|}
  \\hline
  ${formData.education.map(edu => (
    `${edu.branch || 'Branch'} & \\centering{${edu.year || 'Year'}} & \\centering{${edu.college || 'College'}} & ${edu.cgpa || 'CGPA'} \\\\    
    \\hline`
  )).join('\n')}

  ${escapedBoard12 || 'Board'} (Class XII) & \\centering{${escapedYear12 || 'Year'}} & \\centering{${escapedSchool12 || '12th School'}} & ${escapedPercent12 || 'Percentage'} \\\\
  \\hline
  ${escapedBoard10 || 'Board'} (Class X) & \\centering{${escapedYear10 || 'Year'}} & \\centering{${escapedSchool10 || '10th School'}} & ${escapedPercent10 || 'Percentage'} \\\\
  \\hline
\\end{tabularx}
\\vspace{-12pt}
%-----------EDUCATION-----------



%-----------EXPERIENCE-----------

${experienceLatex}  % Add the generated experience section here


%-----------Projects-----------

${projectLatex}  % Add the generated experience section here

%-----------PROGRAMMING SKILLS-----------

${skillsLatex}


${achievementSection}



${extraCurricularSection}


${customSections}

\\end{document}



`;

 // Save LaTeX content to a .tex file
        const fileName = `${escapedName.replace(/ /g, '_')}_resume.tex`;
        const latexFilePath = path.join(resumesDir, fileName);
        fs.writeFileSync(latexFilePath, latexContent);

        // 2. Compile LaTeX to PDF using pdflatex
        exec(`pdflatex -interaction=nonstopmode -output-directory="${resumesDir}" "${latexFilePath}"`, (err, stdout, stderr) => {
            // if (err) {
            //     // Log LaTeX compilation errors
            //     console.error('Error compiling LaTeX:', err.message);
            //     console.error('stderr:', stderr);
            //     console.log('stdout:', stdout);
            //     // return res.status(500).send(`Failed to generate PDF from LaTeX: ${stderr}`);
            // }
            // console.log('LaTeX compilation output:', stdout);
            
            // Define the path to the generated PDF
            const pdfPath = path.join(resumesDir, `${escapedName.replace(/ /g, '_')}_resume.pdf`);
            
            // Ensure PDF was generated
            if (!fs.existsSync(pdfPath)) {
                console.error('PDF not found:', pdfPath);
                return res.status(500).send('PDF generation failed.');
            }

            // Return the URL to the generated resume PDF
            res.json({ resumeUrl: `/resumes/${escapedName.replace(/ /g, '_')}_resume.pdf` });
        });

    } catch (err) {
        console.error('Error generating resume:', err);
        res.status(500).send('Failed to generate resume.');
    }
});

app.use('/resumes', express.static(path.join(__dirname, 'resumes')));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
