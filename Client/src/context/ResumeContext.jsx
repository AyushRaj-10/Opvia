import React, { createContext, useContext , useState} from "react";
import axios from "axios";

// Create Context
const ResumeContext = createContext();

// Backend URL
const url =
 "http://localhost:3000/api/resumes";

// Provider Component
export const ResumeProvider = ({ children }) => {
  const [resumes, setResumes] = useState([]);
  const [currentResume, setCurrentResume] = useState(null);

  const createResume = async (
    personal = {},
    summary = "",
    skills = [],
    experience = [],
    projects = [],
    education = []
  ) => {
    const safePersonal = {
      name: personal.name?.trim() || "Untitled Resume",
      email: personal.email || "",
      phone: personal.phone || "",
      linkedIn: personal.linkedIn || "",
      portfolio: personal.portfolio || "",
    };
  
    const response = await axios.post(url, {
      personal: safePersonal,
      summary,
      skills,
      experience,
      projects,
      education,
    });
  
    console.log("CREATE RESUME RESPONSE:", response.data);
  
    return response.data;
  };
  
  

  const getResumeByOwnerId = async (ownerId) => {
    try {
      const response = await axios.get(`${url}/owner/${ownerId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resume = response.data.resume || response.data;
      setCurrentResume(resume);
      
      return resume;
    } catch (error) {
      console.error("Error fetching resume by owner ID:", error);
      throw error;
      
    }
  }

  const deleteResume = async (id) => {
    try {
      const response = await axios.delete(`${url}/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      setResumes(prev => prev.filter(resume => resume._id !== id));
      if (currentResume?._id === id) {
        setCurrentResume(null);
      }
      
      return response.data;
    } catch (error) {
      console.error("Error deleting resume:", error);
      throw error;
    }
  };

  const getResumeById = async (id) => {
    try {
      const response = await axios.get(`${url}/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      const resume = response.data.resume || response.data;
      setCurrentResume(resume);
      return resume;
    } catch (error) {
      console.error("Error fetching resume by ID:", error);
      throw error;
    }
  };

  const getAllResumes = async () => {
    try {
      const response = await axios.get(`${url}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      const resumesList = response.data.resumes || response.data;
      setResumes(resumesList);
      return resumesList;
    } catch (error) {
      console.error("Error fetching all resumes:", error);
      throw error;
    }
  };

  const updatePersonal = async (
    id,
    name,
    email,
    phone,
    linkedIn,
    portfolio
  ) => {
    try {
      const response = await axios.patch(
        `${url}/${id}/personal`,
        {
          name,
          email,
          phone,
          linkedIn,
          portfolio,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      const updatedResume = response.data.resume || response.data;
      
      // Update currentResume if it's the one being updated
      if (currentResume?._id === id) {
        setCurrentResume(updatedResume);
      }
      
      // Update in resumes array
      setResumes(prev => prev.map(resume => 
        resume._id === id ? updatedResume : resume
      ));
      
      return updatedResume;
    } catch (error) {
      console.error("Error updating personal details:", error);
      throw error;
    }
  };

  const updateSummary = async (id, summary) => {
    try {
      const response = await axios.patch(
        `${url}/${id}/summary`,
        { summary },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      const updatedResume = response.data.resume || response.data;
      
      if (currentResume?._id === id) {
        setCurrentResume(updatedResume);
      }
      
      setResumes(prev => prev.map(resume => 
        resume._id === id ? updatedResume : resume
      ));
      
      return updatedResume;
    } catch (error) {
      console.error("Error updating summary:", error);
      throw error;
    }
  };

  const addSkill = async (id, skill) => {
    try {
      const response = await axios.post(
        `${url}/${id}/skills`,
        { skill },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      const updatedResume = response.data.resume || response.data;
      
      if (currentResume?._id === id) {
        setCurrentResume(updatedResume);
      }
      
      setResumes(prev => prev.map(resume => 
        resume._id === id ? updatedResume : resume
      ));
      
      return updatedResume;
    } catch (error) {
      console.error("Error adding skill:", error);
      throw error;
    }
  };

  const deleteSkill = async (id, skill) => {
    try {
      const response = await axios.delete(`${url}/${id}/skills`, {
        headers: {
          "Content-Type": "application/json",
        },
        data: { skill },
      });
      
      const updatedResume = response.data.resume || response.data;
      
      if (currentResume?._id === id) {
        setCurrentResume(updatedResume);
      }
      
      setResumes(prev => prev.map(resume => 
        resume._id === id ? updatedResume : resume
      ));
      
      return updatedResume;
    } catch (error) {
      console.error("Error deleting skill:", error);
      throw error;
    }
  };

  const addExperience = async (
    id,
    role,
    company,
    duration,
    description
  ) => {
    try {
      const response = await axios.post(
        `${url}/${id}/experience`,
        { role, company, duration, description },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      const updatedResume = response.data.resume || response.data;
      
      if (currentResume?._id === id) {
        setCurrentResume(updatedResume);
      }
      
      setResumes(prev => prev.map(resume => 
        resume._id === id ? updatedResume : resume
      ));
      
      return updatedResume;
    } catch (error) {
      console.error("Error adding experience:", error);
      throw error;
    }
  };

  const updateExperience = async (
    id,
    experienceId,
    role,
    company,
    duration,
    description
  ) => {
    try {
      const response = await axios.patch(
        `${url}/${id}/experience/${experienceId}`,
        { role, company, duration, description },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      const updatedResume = response.data.resume || response.data;
      
      if (currentResume?._id === id) {
        setCurrentResume(updatedResume);
      }
      
      setResumes(prev => prev.map(resume => 
        resume._id === id ? updatedResume : resume
      ));
      
      return updatedResume;
    } catch (error) {
      console.error("Error updating experience:", error);
      throw error;
    }
  };

  const deleteExperience = async (id, experienceId) => {
    try {
      const response = await axios.delete(
        `${url}/${id}/experience/${experienceId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      const updatedResume = response.data.resume || response.data;
      
      if (currentResume?._id === id) {
        setCurrentResume(updatedResume);
      }
      
      setResumes(prev => prev.map(resume => 
        resume._id === id ? updatedResume : resume
      ));
      
      return updatedResume;
    } catch (error) {
      console.error("Error deleting experience:", error);
      throw error;
    }
  };

  const addEducation = async (id, institution, degree, duration) => {
    try {
      const response = await axios.post(
        `${url}/${id}/education`,
        { institution, degree, duration },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      const updatedResume = response.data.resume || response.data;
      
      if (currentResume?._id === id) {
        setCurrentResume(updatedResume);
      }
      
      setResumes(prev => prev.map(resume => 
        resume._id === id ? updatedResume : resume
      ));
      
      return updatedResume;
    } catch (error) {
      console.error("Error adding education:", error);
      throw error;
    }
  };

  const updateEducation = async (
    id,
    educationId,
    institution,
    degree,
    duration
  ) => {
    try {
      const response = await axios.patch(
        `${url}/${id}/education/${educationId}`,
        { institution, degree, duration },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      const updatedResume = response.data.resume || response.data;
      
      if (currentResume?._id === id) {
        setCurrentResume(updatedResume);
      }
      
      setResumes(prev => prev.map(resume => 
        resume._id === id ? updatedResume : resume
      ));
      
      return updatedResume;
    } catch (error) {
      console.error("Error updating education:", error);
      throw error;
    }
  };

  const deleteEducation = async (id, educationId) => {
    try {
      const response = await axios.delete(
        `${url}/${id}/education/${educationId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      const updatedResume = response.data.resume || response.data;
      
      if (currentResume?._id === id) {
        setCurrentResume(updatedResume);
      }
      
      setResumes(prev => prev.map(resume => 
        resume._id === id ? updatedResume : resume
      ));
      
      return updatedResume;
    } catch (error) {
      console.error("Error deleting education:", error);
      throw error;
    }
  };

  const addProject = async (id, title, link, description) => {
    try {
      const response = await axios.post(
        `${url}/${id}/projects`,
        { title, link, description },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      const updatedResume = response.data.resume || response.data;
      
      if (currentResume?._id === id) {
        setCurrentResume(updatedResume);
      }
      
      setResumes(prev => prev.map(resume => 
        resume._id === id ? updatedResume : resume
      ));
      
      return updatedResume;
    } catch (error) {
      console.error("Error adding project:", error);
      throw error;
    }
  };

  const updateProject = async (
    id,
    projectId,
    title,
    link,
    description
  ) => {
    try {
      const response = await axios.patch(
        `${url}/${id}/projects/${projectId}`,
        { title, link, description },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      const updatedResume = response.data.resume || response.data;
      
      if (currentResume?._id === id) {
        setCurrentResume(updatedResume);
      }
      
      setResumes(prev => prev.map(resume => 
        resume._id === id ? updatedResume : resume
      ));
      
      return updatedResume;
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  };

  const deleteProject = async (id, projectId) => {
    try {
      const response = await axios.delete(
        `${url}/${id}/projects/${projectId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      const updatedResume = response.data.resume || response.data;
      
      if (currentResume?._id === id) {
        setCurrentResume(updatedResume);
      }
      
      setResumes(prev => prev.map(resume => 
        resume._id === id ? updatedResume : resume
      ));
      
      return updatedResume;
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  };

  return (
    <ResumeContext.Provider
      value={{
        resumes,
        currentResume,
        setCurrentResume,
        getResumeByOwnerId, 

        createResume,
        deleteResume,
        getResumeById,
        getAllResumes,

        updatePersonal,
        updateSummary,

        addSkill,
        deleteSkill,

        addExperience,
        updateExperience,
        deleteExperience,

        addEducation,
        updateEducation,
        deleteEducation,

        addProject,
        updateProject,
        deleteProject,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

// Custom Hook
export const useResume = () => {
  return useContext(ResumeContext);
};
