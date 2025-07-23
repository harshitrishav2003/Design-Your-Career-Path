import axios from '../service/axios';

//  Get all users
const getAllUsers = async () => {
    try {
        const response = await axios.get('/v1/users/all-users', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.status || 'Error fetching users';
    }
};

// Create new resume
const CreateNewResume = async (data) => {
    console.log(data);
    try {
        const response = await axios.post('/v1/users/create-user-resume', data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.status || 'Error inserting user resume data';
    }
};

// Get all resumes of current user
const GetUserResumes = async () => {
    try {
        const response = await axios.get(`/v1/users/user-resumes/`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.status || 'Error fetching user resumes';
    }
};

// Get resume by ID
const GetResumeById = async (id) => {
    try {
        const response = await axios.get(`/v1/users/get-user-resume/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.status || 'Error fetching resume';
    }
};

// Update resume details
const UpdateResumeDetail = async (resumeId, data) => {
    console.log('data', data);
    try {
        const response = await axios.patch(`/v1/users/update-resume-details/${resumeId}`, data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.status || 'Error updating resume details';
    }
};

// Delete resume by ID
export const deleteResumeById = async (resumeId) => {
    if (!resumeId || typeof resumeId !== 'string') {
        throw new Error('A valid resume ID must be provided.');
    }

    try {
        const response = await axios.delete(`/v1/users/delete-resume/${resumeId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
            },
        });

        if (response.status >= 200 && response.status < 300) {
            return response.data;
        }

        throw new Error(`Unexpected response status: ${response.status}`);
    } catch (error) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || 'Error deleting resume.';
        console.error(`[deleteResumeByID]: ${status} - ${message}`);
        throw new Error(`Failed to delete resume: ${message}`);
    }
};

// Generate resume preview (returns URL)
const generateResumePreview = async (formData) => {
    try {
        const response = await axios.post('/v1/users/generate-resume', formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });

        console.log("response", response)
        const { resumeUrl } = response.data.data || {};
        console.log(`${'http://localhost:5001'}${resumeUrl}?t=${Date.now()}`)
        if (resumeUrl) {
            return `${'http://localhost:5001'}${resumeUrl}?t=${Date.now()}`;
        } else {
            throw new Error('Failed to generate PDF preview.');
        }
    } catch (error) {
        console.error('Error generating preview:', error);
        throw error.response?.status || 'Error generating preview';
    }
};

// Generate final resume and download
// const generateAndDownloadResume = async (formData) => {
//     try {
//         const response = await axios.post('/generate-resume', formData, {
//             baseURL: 'http://localhost:5000', // Or move to env
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });

//         const { resumeUrl } = response.data || {};
//         if (resumeUrl) {
//             const downloadLink = `http://localhost:5000${resumeUrl}`;
//             const a = document.createElement('a');
//             a.href = downloadLink;
//             a.download = downloadLink.split('/').pop();
//             document.body.appendChild(a);
//             a.click();
//             document.body.removeChild(a);
//         } else {
//             throw new Error('No resume URL received.');
//         }
//     } catch (error) {
//         console.error('Error generating resume:', error.response || error);
//         alert('Failed to generate resume. Please try again.');
//     }
// };



const GetAllTemplates = async () => {
    try {
        const response = await axios.get("/v1/admin/get-all-template");
        return response.data;
    } catch (error) {
        throw error.response?.status || "Error fetching templates";
    }
};



const CreateTemplate = async (data) => {
    try {
        const response = await axios.post("/v1/admin/add-template", data);
        return response.data;
    } catch (error) {
        throw error.response?.status || "Error adding templates";
    }
};



export default {
    getAllUsers,
    CreateNewResume,
    GetUserResumes,
    GetResumeById,
    UpdateResumeDetail,
    generateResumePreview,
    // generateAndDownloadResume,
    deleteResumeById,
    GetAllTemplates,
    CreateTemplate
};
