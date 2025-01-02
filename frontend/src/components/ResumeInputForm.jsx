
import React, { useState } from 'react';
import axios from 'axios';
import "./form.css";

const ResumeInputForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        rollno: '',
        branch: '',
        year: '',
        college: '',
        board12: "",
        board10: "",
        cgpa: '',
        year12: '',
        school12: '',
        percent12: '',
        year10: '',
        school10: '',
        percent10: '',
        education: [
            { branch: '', year: '', college: '', cgpa: '' }
        ],
        includeProjects: false, // Whether projects section is included
        projects:[],
        includeExperience: false,  // Checkbox to include the Experience section
        experiences: []  ,
        // projects: [{ projectName: '', projectLink: '', projectDetails1: '', projectDetails2: '' }], // Changed to an array of experiences
        includeProjects: false,
        skills: [{ skillName: '', skillLevel: '', skillDetails: '' }], 
        includeSkills: false,  // For three skills
        includeAchievements: false,
        achievements: [] ,
        includeExtraCurricular: false,
        extraCurricular: [],
        customSections: [
            {
              sectionTitle: '',
              include: false,
              items: ['']
            }
          ],
          includeSocial: false,
        socialLinks: [{ platform: '', link: '' }],
        social1: '',
        social2: ''
    });
    const [previewUrl, setPreviewUrl] = useState('');
   
    const handleChange1 = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setFormData(updatedForm);
        
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        
        // Update the form data with the new value
        setFormData((prevFormData) => {
            const updatedForm = { ...prevFormData, [name]: value };
    
            // After updating the form data, trigger the preview update
            updatePreview(updatedForm); // Call updatePreview with the updated form data
            return updatedForm;
        });
    };
    
    
    // Handle changes in the experience fields dynamically
    const handleExperienceChange = (e, index) => {
        const { name, value } = e.target;
        const updatedExperiences = [...formData.experiences];
        updatedExperiences[index][name] = value;
        setFormData({ ...formData, experiences: updatedExperiences });
    };

    // Add a new experience
    const addExperience = () => {
        const newExperience = {
            expName: '',
            expYear: '',
            expPlace: '',
            expPosition: '',
            expDetails1: '',
            expDetails2: '',
            items: [] // Array to store custom items
        };
        setFormData(prevState => ({
            ...prevState,
            experiences: [...prevState.experiences, newExperience]
        }));
    };

    // Add a custom item to the experience
    const addExperienceItem = (index) => {
        const updatedExperiences = [...formData.experiences];
        updatedExperiences[index].items.push({ content: '' });
        setFormData({ ...formData, experiences: updatedExperiences });
    };

    // Handle change for custom experience items
    const handleExperienceItemChange = (e, experienceIndex, itemIndex) => {
        const { value } = e.target;
        const updatedExperiences = [...formData.experiences];
        updatedExperiences[experienceIndex].items[itemIndex].content = value;
        setFormData({ ...formData, experiences: updatedExperiences });
    };

    // Remove a custom item from the experience
    const removeExperienceItem = (experienceIndex, itemIndex) => {
        const updatedExperiences = [...formData.experiences];
        updatedExperiences[experienceIndex].items.splice(itemIndex, 1);
        setFormData({ ...formData, experiences: updatedExperiences });
    };
    const removeExperience = (index) => {
        setFormData(prevState => ({
            ...prevState,
            experiences: prevState.experiences.filter((_, i) => i !== index) // Removes the experience at the specified index
        }));
    };
    
    

  // Adds a new project to the array
function addProject() {
    setFormData(prevData => ({
        ...prevData,
        projects: [
            ...prevData.projects,
            {
                projectName: '',
                projectLink: '',
                projectDetails1: '',
                projectDetails2: '',
                detailsItems: []  // Start with an empty array for detail items
            }
        ]
    }));
}
const removeProject = (index) => {
    setFormData(prevState => ({
        ...prevState,
        projects: prevState.projects.filter((_, i) => i !== index)
    }));
};

// Handles changes in project details or items
function handleProjectChange(e, index) {
    const { name, value } = e.target;
    const updatedProjects = [...formData.projects];
    updatedProjects[index] = {
        ...updatedProjects[index],
        [name]: value
    };
    setFormData({ ...formData, projects: updatedProjects });
}

// Adds a new project detail item
function addProjectDetailItem(index) {
    const updatedProjects = [...formData.projects];
    updatedProjects[index].detailsItems.push({ content: '' });
    setFormData({ ...formData, projects: updatedProjects });
}

// Handles change in a project detail item
function handleProjectDetailItemChange(e, projectIndex, itemIndex) {
    const { value } = e.target;
    const updatedProjects = [...formData.projects];
    updatedProjects[projectIndex].detailsItems[itemIndex].content = value;
    setFormData({ ...formData, projects: updatedProjects });
}

// Removes a project detail item
function removeProjectDetailItem(projectIndex, itemIndex) {
    const updatedProjects = [...formData.projects];
    updatedProjects[projectIndex].detailsItems.splice(itemIndex, 1);
    setFormData({ ...formData, projects: updatedProjects });
}

// Handles the checkbox change to include/exclude the projects section
function handleIncludeProjectsChange(e) {
    setFormData({
        ...formData,
        includeProjects: e.target.checked
    });
}

  
const handleSkillChange = (e, index) => {
    const { name, value } = e.target;
    const updatedSkills = [...formData.skills];
    updatedSkills[index][name] = value;
    setFormData({
        ...formData,
        skills: updatedSkills,
    });
};

const addSkill = () => {
    setFormData({
        ...formData,
        skills: [...formData.skills, { skillName: '', skillLevel: '', skillDetails: '' }],
    });
};

const removeSkill = (index) => {
    const updatedSkills = formData.skills.filter((_, i) => i !== index);
    setFormData({
        ...formData,
        skills: updatedSkills,
    });
};


    const handleAchievementChange = (e, index) => {
        const { name, value } = e.target;
        const updatedAchievements = [...formData.achievements];
        updatedAchievements[index] = { ...updatedAchievements[index], [name]: value };  // Update the specific achievement property
        setFormData({ ...formData, achievements: updatedAchievements });
    };
    
    const addAchievement = () => {
        setFormData({
            ...formData,
            achievements: [
                ...formData.achievements,
                { achievementName: '', achievementDetails: '' }  // Add an empty achievement object
            ]
        });
    };
    
    const removeAchievement = (index) => {
        const updatedAchievements = formData.achievements.filter((_, i) => i !== index);
        setFormData({ ...formData, achievements: updatedAchievements });
    };
    
    const handleExtraCurricularChange = (e, index) => {
        const { name, value } = e.target;
        const updatedExtraCurricular = [...formData.extraCurricular];
        updatedExtraCurricular[index] = { ...updatedExtraCurricular[index], [name]: value };
        setFormData({ ...formData, extraCurricular: updatedExtraCurricular });
    };
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData({ ...formData, [name]: checked });
       
    };
    const addExtraCurricular = () => {
        setFormData({
            ...formData,
            extraCurricular: [
                ...formData.extraCurricular,
                { activityName: '' }
            ]
        });
    };

    const removeExtraCurricular = (index) => {
        const updatedExtraCurricular = formData.extraCurricular.filter((_, i) => i !== index);
        setFormData({ ...formData, extraCurricular: updatedExtraCurricular });
    };

    const toggleCustomSection = (index) => {
        const updatedSections = [...formData.customSections];
        updatedSections[index].include = !updatedSections[index].include;
        setFormData({
            ...formData,
            customSections: updatedSections,
        });
    };

    const handleCustomSectionChange = (index, e) => {
        const { name, value } = e.target;
        const updatedSections = [...formData.customSections];
        updatedSections[index][name] = value;
        setFormData({
            ...formData,
            customSections: updatedSections,
        });
    };

    const handleCustomItemChange = (sectionIndex, itemIndex, e) => {
        const updatedSections = [...formData.customSections];
        updatedSections[sectionIndex].items[itemIndex] = e.target.value;
        setFormData({
            ...formData,
            customSections: updatedSections,
        });
    };

    const addCustomItem = (index) => {
        const updatedSections = [...formData.customSections];
        updatedSections[index].items.push('');
        setFormData({
            ...formData,
            customSections: updatedSections,
        });
    };

    const addCustomSection = () => {
        setFormData({
            ...formData,
            customSections: [
                ...formData.customSections,
                { include: false, sectionTitle: '', items: [''] },
            ],
        });
    };
    const handleEducationChange = (e, index) => {
        const { name, value } = e.target;
        const updatedEducation = [...formData.education];
        updatedEducation[index][name] = value;
        setFormData({
            ...formData,
            education: updatedEducation,
        });
    };

    const addEducationEntry = () => {
        setFormData({
            ...formData,
            education: [
                ...formData.education,
                { branch: '', year: '', college: '', cgpa: '' },
            ],
        });
    };

    const removeEducationEntry = (index) => {
        const updatedEducation = formData.education.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            education: updatedEducation,
        });
    };

    const handleSocial = (e, index) => {
        const { name, value } = e.target;
        if (name === 'includeSocial') {
            setFormData({ ...formData, includeSocial: e.target.checked });
        } else {
            const updatedSocialLinks = [...formData.socialLinks];
            updatedSocialLinks[index][name] = value;
            setFormData({ ...formData, socialLinks: updatedSocialLinks });
        }
    };

    const addSocialLink = () => {
        setFormData({
            ...formData,
            socialLinks: [...formData.socialLinks, { platform: '', link: '' }]
        });
    };

    const removeSocialLink = (index) => {
        const updatedSocialLinks = formData.socialLinks.filter((_, i) => i !== index);
        setFormData({ ...formData, socialLinks: updatedSocialLinks });
    };

    
    const updatePreview = (updatedForm) => {
        fetch('https://design-your-career-path-8atl.vercel.app/api/generate-resume', {
            method: 'POST',
            body: JSON.stringify(updatedForm),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
       .then(data => {
            console.log('Response from backend:', data);  // <-- Log the response
            if (data.resumeUrl) {
                setPreviewUrl(`https://design-your-career-path-8atl.vercel.app${data.resumeUrl}?t=${new Date().getTime()}`); // Add a timestamp to avoid caching
            } else {
                alert('Failed to generate PDF. Please try again.');
            } 
        })
        .catch(err => console.error('Error generating preview:', err));
        
    };
    // Submit the form
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Send formData to backend to generate the resume
            const response = await axios.post('https://design-your-career-path-8atl.vercel.app/api/generate-resume', formData);
            
            console.log(response.data.resumeUrl);
            
            // Check if the response contains a resume URL
            if (response.data && response.data.resumeUrl) {
                const downloadLink = `https://design-your-career-path-8atl.vercel.app${response.data.resumeUrl}`;
                console.log('Generated Resume URL:', downloadLink);
    
                // Create an anchor element to trigger download
                const a = document.createElement('a');
                a.href = downloadLink;
                a.download = downloadLink.split('/').pop(); // Use the filename from the URL
                document.body.appendChild(a);
                a.click(); // Trigger the download
                document.body.removeChild(a); // Clean up the DOM
            } else {
                throw new Error('No resume URL received in response.');
            }
        } catch (err) {
            // Log the specific error message from the backend
            console.error('Error generating resume:', err.response ? err.response.data : err.message);
            alert('Failed to generate resume. Please try again.');
        }
    };
    
    return (
        <div className="resume-container">
        <div className="resume-form">
            <h1>Generate Resume</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        
                        value={formData.name}
                        onChange={handleChange}
                        required
                        
                        
                        
                    />
                </div>

                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                       
                        required
                    />
                </div>

                <div>
                    <label htmlFor="mobile">Mobile:</label>
                    <input
                        type="text"
                        id="mobile"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        required
                       
                    />
                </div>

                <div>
                    <label htmlFor="rollno">Roll Number:</label>
                    <input
                        type="text"
                        id="rollno"
                        name="rollno"
                        value={formData.rollno}
                        onChange={handleChange}
                        required
                        
                    />
                </div>
                <div>
                <h2>Social Links</h2>
                
            <div>
            <label>
                <input
                    type="checkbox"
                    id="includeSocial"
                    name="includeSocial"
                    checked={formData.includeSocial}
                    onChange={handleSocial}
                />
                Include Social Links
                </label>
            </div>

            {formData.includeSocial && formData.socialLinks.map((social, index) => (
                <div key={index}>
                    <input
                        type="text"
                        placeholder="Platform (e.g., LinkedIn, GitHub)"
                        name="platform"
                        value={social.platform}
                        onChange={(e) => {
                            handleSocial(e, index);  // First function
                            handleChange(e);  // Second function
                        }}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Profile Link"
                        name="link"
                        value={social.link}
                       
                        onChange={(e) => {
                            handleSocial(e, index);  // First function
                            handleChange(e);  // Second function
                        }}
                        required
                    />
                    {formData.socialLinks.length > 1 && (
                        <button type="button" onClick={() => removeSocialLink(index)}>
                            Remove
                        </button>
                    )}
                </div>
            ))}
            {formData.includeSocial && (
                <button type="button" onClick={addSocialLink}>
                    Add More Social Links
                </button>
            )}
            </div>
           



                <h2>Education</h2>
                <div>
    {formData.education.map((edu, index) => (
        <div key={index} className="education-entry">
            <div>
                <label htmlFor={`branch-${index}`}>Branch:</label>
                <input
                    type="text"
                    id={`branch-${index}`}
                    name="branch"
                    value={edu.branch}
                    onChange={(e) => {
                        handleEducationChange(e, index);  // First function
                        handleChange(e);  // Second function
                    }}
                    required
                />
            </div>

            <div>
                <label htmlFor={`year-${index}`}>Year of Passing:</label>
                <input
                    type="text"
                    id={`year-${index}`}
                    name="year"
                    value={edu.year}
                    
                    onChange={(e) => {
                        handleEducationChange(e, index);  // First function
                        handleChange(e);  // Second function
                    }}
                    required
                />
            </div>

            <div>
                <label htmlFor={`college-${index}`}>College:</label>
                <input
                    type="text"
                    id={`college-${index}`}
                    name="college"
                    value={edu.college}
                   
                    onChange={(e) => {
                        handleEducationChange(e, index);  // First function
                        handleChange(e);  // Second function
                    }}
                    required
                />
            </div>

            <div>
                <label htmlFor={`cgpa-${index}`}>CGPA:</label>
                <input
                    type="text"
                    id={`cgpa-${index}`}
                    name="cgpa"
                    value={edu.cgpa}
                   
                    onChange={(e) => {
                        handleEducationChange(e, index);  // First function
                        handleChange(e);  // Second function
                    }}
                    required
                />
            </div>

            <button type="button" onClick={() => removeEducationEntry(index)}>Remove</button>
        </div>
    ))}

    <button type="button" onClick={addEducationEntry}>Add More Education</button>
</div>
                <div>
    <label htmlFor="board12">12th Board:</label>
    <input
        type="text"
        id="board12"
        name="board12"
        value={formData.board12}
        onChange={handleChange}
    />
</div>
                <div>

                    <label htmlFor="year12">12th Year:</label>
                    <input
                        type="text"
                        id="year12"
                        name="year12"
                        value={formData.year12}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label htmlFor="school12">12th School:</label>
                    <input
                        type="text"
                        id="school12"
                        name="school12"
                        value={formData.school12}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label htmlFor="percent12">12th Percentage:</label>
                    <input
                        type="text"
                        id="percent12"
                        name="percent12"
                        value={formData.percent12}
                        onChange={handleChange}
                    />
                </div>
                <div>
    <label htmlFor="board10">10th Board:</label>
    <input
        type="text"
        id="board10"
        name="board10"
        value={formData.board10}
        onChange={handleChange}
    />
</div>
                <div>
                    <label htmlFor="year10">10th Year:</label>
                    <input
                        type="text"
                        id="year10"
                        name="year10"
                        value={formData.year10}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label htmlFor="school10">10th School:</label>
                    <input
                        type="text"
                        id="school10"
                        name="school10"
                        value={formData.school10}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label htmlFor="percent10">10th Percentage:</label>
                    <input
                        type="text"
                        id="percent10"
                        name="percent10"
                        value={formData.percent10}
                        onChange={handleChange}
                    />
                </div>
<div>
                <h2>Experience</h2>

{/* Checkbox to include or exclude Experience section */}
<div>
    <label>
        <input
            type="checkbox"
            checked={formData.includeExperience}
            onChange={(e) => {
                setFormData({ ...formData, includeExperience: e.target.checked });
                handleChange(e);
            }}
        />
        Include Experience Section
    </label>
</div>

{/* Loop through all experiences */}
{formData.includeExperience && formData.experiences.map((experience, index) => (
    <div key={index}>
        {/* Experience Name */}
        <div>
            <label htmlFor={`expName${index}`}>Experience Name:</label>
            <input
                type="text"
                id={`expName${index}`}
                name="expName"
                value={experience.expName}
                
                onChange={(e) => {
                    handleExperienceChange(e, index);  // First function
                    handleChange(e);  // Second function
                }}
            />
        </div>

        {/* Experience Year */}
        <div>
            <label htmlFor={`expYear${index}`}>Experience Year:</label>
            <input
                type="text"
                id={`expYear${index}`}
                name="expYear"
                value={experience.expYear}
                onChange={(e) => {
                    handleExperienceChange(e, index);  // First function
                    handleChange(e);  // Second function
                }}
            />
        </div>

        {/* Experience Place */}
        <div>
            <label htmlFor={`expPlace${index}`}>Experience Place:</label>
            <input
                type="text"
                id={`expPlace${index}`}
                name="expPlace"
                value={experience.expPlace}
                onChange={(e) => {
                    handleExperienceChange(e, index);  // First function
                    handleChange(e);  // Second function
                }}
            />
        </div>

        {/* Position Field */}
        <div>
            <label htmlFor={`expPosition${index}`}>Position:</label>
            <input
                type="text"
                id={`expPosition${index}`}
                name="expPosition"
                value={experience.expPosition}
                onChange={(e) => {
                    handleExperienceChange(e, index);  // First function
                    handleChange(e);  // Second function
                }}
            />
        </div>

        {/* Experience Details 1 */}
        <div>
            <label htmlFor={`expDetails1${index}`}>Experience Details (1):</label>
            <textarea
                id={`expDetails1${index}`}
                name="expDetails1"
                value={experience.expDetails1}
                onChange={(e) => {
                    handleExperienceChange(e, index);  // First function
                    handleChange(e);  // Second function
                }}
            />
        </div>

        
        {/* Custom Items */}
        <div>
            <h3>Experience Items</h3>
            {experience.items.map((item, itemIndex) => (
                <div key={itemIndex}>
                    <input
                        type="text"
                        placeholder="Enter item (E.g., Led a team of 5)"
                        value={item.content}
                       
                        onChange={(e) => {
                            handleExperienceItemChange(e, index, itemIndex);  // First function
                            handleChange(e);  // Second function
                        }}
                    />
                    <button type="button" onClick={() => removeExperienceItem(index, itemIndex)}>Remove</button>
                </div>
            ))}
            <button type="button" onClick={() => addExperienceItem(index)}>Add Item</button>
        </div>
        <button type="button" onClick={() => removeExperience(index)}>
            Remove Experience
        </button>
    </div>
))}
{formData.includeExperience && (
                   <button type="button" onClick={addExperience}>
                   Add Experience
               </button>
                )}

</div>

{/* Button to add new Experience */}
{/* <button type="button" onClick={addExperience}>
    Add Another Experience
</button> */}

<div>
<h2>Projects</h2>

{/* Checkbox to include/exclude Projects section */}
<div>
    <label>
        <input
            type="checkbox"
            checked={formData.includeProjects}
           
            onChange={(e) => {
                handleIncludeProjectsChange(e);  // First function
                handleChange(e);  // Second function
            }}
        />
        Include Projects Section
    </label>
</div>

{/* Render Projects Section if includeProjects is true */}
{formData.includeProjects && formData.projects.map((project, index) => (
    <div key={index}>
        <div>
            <label htmlFor={`projectName${index}`}>Project Name:</label>
            <input
                type="text"
                id={`projectName${index}`}
                name="projectName"
                value={project.projectName}
               
                onChange={(e) => {
                    handleProjectChange(e, index);  // First function
                    handleChange(e);  // Second function
                }}
            />
        </div>

        <div>
            <label htmlFor={`projectLink${index}`}>Project Link:</label>
            <input
                type="text"
                id={`projectLink${index}`}
                name="projectLink"
                value={project.projectLink}
                
                onChange={(e) => {
                    handleProjectChange(e, index);  // First function
                    handleChange(e);  // Second function
                }}
            />
        </div>

        <div>
            <label htmlFor={`projectDetails1${index}`}>Project Details (1):</label>
            <textarea
                id={`projectDetails1${index}`}
                name="projectDetails1"
                value={project.projectDetails1}
                
                onChange={(e) => {
                    handleProjectChange(e, index);  // First function
                    handleChange(e);  // Second function
                }}
            />
        </div>

        <div>
            <label htmlFor={`projectDetails2${index}`}>Project Details (2):</label>
            <textarea
                id={`projectDetails2${index}`}
                name="projectDetails2"
                value={project.projectDetails2}
                
                onChange={(e) => {
                    handleProjectChange(e, index);  // First function
                    handleChange(e);  // Second function
                }}
            />
        </div>

        {/* Adding Extra Detail Items */}
        <div>
            <h3>Project Details Items</h3>
            {project.detailsItems.map((item, itemIndex) => (
                <div key={itemIndex}>
                    <input
                        type="text"
                        placeholder="Enter item (E.g., Implemented authentication)"
                        value={item.content}
                        
                        onChange={(e) => {
                            handleProjectDetailItemChange(e, index, itemIndex);  // First function
                            handleChange(e);  // Second function
                        }}
                        
                    />
                    <button type="button" onClick={() => removeProjectDetailItem(index, itemIndex)}>Remove</button>
                </div>
            ))}
            <button type="button" onClick={() => addProjectDetailItem(index)}>Add Item</button>
        </div>
         {/* Button to remove project */}
         <button type="button" onClick={() => removeProject(index)}>
            Remove Project
        </button>
    </div>
))}
{formData.includeProjects && (
                   <button type="button" onClick={addProject}>
                   Add Project
               </button>
                )}
</div>




<div>
<h2>Skills</h2>
                <label>
                    <input
                        type="checkbox"
                        name="includeSkills"
                        checked={formData.includeSkills}
                        onChange={() =>
                            setFormData({
                                ...formData,
                                includeSkills: !formData.includeSkills,
                            })
                        }
                    />
                    Include Skills Section
                </label>
            </div>

            {formData.includeSkills && (
                <div>
                   
                    {formData.skills.map((skill, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                name="skillName"
                                value={skill.skillName}
                                onChange={(e) => {
                                    handleSkillChange(e, index);
                                    handleChange(e);
                                }}
                                placeholder="Languages: C, C++, Java, HTML, CSS, Bootstrap, MySQL, JQuery, JavaScript, Python"
                            />
                            <button type="button" onClick={() => removeSkill(index)}>
                                Remove Skill
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addSkill}>Add Skill</button>
                </div>
            )}
{/* <button type="button" onClick={addSkill}>Add Skill</button> */}
<div>
<h2>Academic Achievements</h2>
<label>
    <input 
        type="checkbox" 
        id="includeAchievements" 
        checked={formData.includeAchievements} 
        // onChange={() => setFormData({ ...formData, includeAchievements: !formData.includeAchievements })}
        onChange={(e) => {
            setFormData({ ...formData, includeAchievements: !formData.includeAchievements });  // First function
            handleChange(e);  // Second function
        }}

    /> 
    Include Achievements
</label>

{formData.includeAchievements && (
    formData.achievements.map((achievement, index) => (
        <div key={index}>
            <div>
                <label htmlFor={`achievementName${index}`}>Achievement :</label>
                <input
                    type="text"
                    id={`achievementName${index}`}
                    name="achievementName"
                    value={achievement.achievementName}
                    
                    onChange={(e) => {
                        handleAchievementChange(e, index);  // First function
                        handleChange(e);  // Second function
                    }}
                />
            </div>

            {/* <div>
                <label htmlFor={`achievementDetails${index}`}>Achievement Details:</label>
                <textarea
                    id={`achievementDetails${index}`}
                    name="achievementDetails"
                    value={achievement.achievementDetails}
                   
                    onChange={(e) => {
                        handleAchievementChange(e, index);  // First function
                        handleChange(e);  // Second function
                    }}
                />

            </div> */}

            <button type="button" onClick={() => removeAchievement(index)}>
                Remove Achievement
            </button>
            
        </div>
    ))
)}
{formData.includeAchievements && (
                    <button type="button" onClick={addAchievement}>
                    Add Achievement
                </button>
                )}
</div>

{/* <button type="button" onClick={addAchievement}>
    Add Another Achievement
</button> */}
{/* Extra-Curricular Section */}
<div>
                <label>
                    <input
                        type="checkbox"
                        name="includeExtraCurricular"
                        checked={formData.includeExtraCurricular}
                        onChange={handleCheckboxChange}
                    />
                    Include Extra-Curricular Activities
                </label>

                {formData.includeExtraCurricular &&
                    formData.extraCurricular.map((activity, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                name="activityName"
                                placeholder="Activity"
                                value={activity.activityName}
                                
                                onChange={(e) => {
                                    handleExtraCurricularChange(e, index);  // First function
                                    handleChange(e);  // Second function
                                }}
                            />
                            <button type="button" onClick={() => removeExtraCurricular(index)}>Remove</button>
                        </div>
                    ))}
            
                {formData.includeExtraCurricular && (
                    <button type="button" onClick={addExtraCurricular}>Add Activity</button>
                )}
                
            </div>


            <h2>Custom Sections</h2>
            {formData.customSections.map((section, index) => (
                <div key={index}>
                    <label>
                        <input
                            type="checkbox"
                            checked={section.include}
                            onChange={() => toggleCustomSection(index)}
                        />
                        Include this section
                    </label>

                    {section.include && (
                        <div>
                            <label htmlFor={`sectionTitle${index}`}>Section Title:</label>
                            <input
                                type="text"
                                id={`sectionTitle${index}`}
                                name="sectionTitle"
                                value={section.sectionTitle}
                               
                                onChange={(e) => {
                                    handleCustomSectionChange(index, e);  // First function
                                    handleChange(e);  // Second function
                                }}
                            />

                            {section.items.map((item, itemIndex) => (
                                <div key={itemIndex}>
                                    <label htmlFor={`item${itemIndex}`}>Item {itemIndex + 1}:</label>
                                    <input
                                        type="text"
                                        id={`item${itemIndex}`}
                                        value={item}
                                       
                                        onChange={(e) => {
                                            handleCustomItemChange(index, itemIndex, e);  // First function
                                            handleChange(e);  // Second function
                                        }}

                                    />
                                </div>
                            ))}

                            <button type="button" onClick={() => addCustomItem(index)}>
                                Add Another Item
                            </button>
                            <button type="button" onClick={addCustomSection}>
                Add New Section
            </button>
                        </div>
                    )}
                    
                </div>
                
            ))}

           



            

            <button type="submit">Generate Resume</button>
            </form>
            
            
        </div>
        <div className="resume-preview">
    <h2>Preview</h2>
    {previewUrl ? (
                <iframe id="pdfPreview" src={previewUrl} style={{ width: '100%', height: '600px' }} />
            ) : (
                <div className="card-container">
    <div className="card">
        <p>No preview available yet. Start filling out the form.</p>
    </div>
</div>
            )}
  </div>
</div>
        
    );
};

export default ResumeInputForm;
