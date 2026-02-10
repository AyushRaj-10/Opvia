import React, { useState, useEffect } from "react";
import { useResume } from "../context/ResumeContext";
import html2pdf from "html2pdf.js";
import ResumeTemplateSelector from "../components/ResumeTemplateSelector";
import { RESUME_TEMPLATES } from "../components/ResumeTemplateSelector";
import { SKILLS } from "../suggestions/skiils";
import { COLLEGES } from "../suggestions/colleges";
import { DEGREES } from "../suggestions/degrees";
import { COMPANIES } from "../suggestions/companies";
import AutoCompleteInput from "../components/AutoCompleteInput";

const HomePage = () => {
  const {
    createResume,
    getAllResumes,
    getResumeById,
    deleteResume,
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
  } = useResume();

  const [activeTab, setActiveTab] = useState("experience");
  const [resumes, setResumes] = useState([]);
  const [currentResume, setCurrentResume] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");

  // Editing state
  const [editingExperience, setEditingExperience] = useState(null);
  const [editingEducation, setEditingEducation] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    phone: "",
    linkedIn: "",
    portfolio: "",
  });

  const [summary, setSummary] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [projects, setProjects] = useState([]);

  const [experienceForm, setExperienceForm] = useState({
    role: "",
    company: "",
    duration: "",
    description: "",
  });

  const [educationForm, setEducationForm] = useState({
    institution: "",
    degree: "",
    duration: "",
  });

  const [projectForm, setProjectForm] = useState({
    title: "",
    link: "",
    description: "",
  });

  //Refresh
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshCurrentResume = async () => {
    if (!currentResume?._id) return;
  
    try {
      setIsRefreshing(true);
      const resume = await getResumeById(currentResume._id);
  
      setCurrentResume(resume);
      setPersonalInfo(resume.personal || {
        name: "",
        email: "",
        phone: "",
        linkedIn: "",
        portfolio: "",
      });
      setSummary(resume.summary || "");
      setSkills(resume.skills || []);
      setExperiences(resume.experience || []);
      setEducations(resume.education || []);
      setProjects(resume.projects || []);
    } catch (error) {
      console.error("Failed to refresh resume:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    refreshCurrentResume();
  }, [refreshKey]);

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };
  
  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const data = await getAllResumes();
      setResumes(data);
    } catch (error) {
      console.error("Failed to load resumes:", error);
    }
  };

  const handleCreateResume = async () => {
    console.log("🔥 handleCreateResume clicked");
    setLoading(true);
    try {
      const newResume = await createResume(
        { name: "", email: "", phone: "", linkedIn: "", portfolio: "" },
        "",
        [],
        [],
        [],
        [],
        []
      );
      setCurrentResume(newResume.resume);
      setShowEditor(true);
      await loadResumes();
      console.log("⬅️ after createResume", newResume);
    } catch (e) {
      console.error("❌ error", e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePersonal = async () => {
    if (!currentResume) return;
    try {
      await updatePersonal(
        currentResume._id,
        personalInfo.name,
        personalInfo.email,
        personalInfo.phone,
        personalInfo.linkedIn,
        personalInfo.portfolio
      );
      alert("Personal info updated!");
    } catch (error) {
      console.error("Failed to update personal info:", error);
    }
  };

  const handleUpdateSummary = async () => {
    if (!currentResume) return;
    try {
      await updateSummary(currentResume._id, summary);
      alert("Summary updated!");
    } catch (error) {
      console.error("Failed to update summary:", error);
    }
  };

  const handleAddSkill = async () => {
    if (!currentResume || !skillInput.trim()) return;
    try {
      await addSkill(currentResume._id, skillInput);
      setSkills([...skills, skillInput]);
      setSkillInput("");
    } catch (error) {
      console.error("Failed to add skill:", error);
    }
  };

  const handleDeleteSkill = async (skill) => {
    if (!currentResume) return;
    try {
      await deleteSkill(currentResume._id, skill);
      setSkills(skills.filter((s) => s !== skill));
    } catch (error) {
      console.error("Failed to delete skill:", error);
    }
  };

  const handleAddExperience = async () => {
    if (!currentResume) {
      alert("Please create or load a resume first!");
      return;
    }

    if (!experienceForm.role || !experienceForm.company) {
      alert("Please fill in all required fields!");
      return;
    }

    try {
      const result = await addExperience(
        currentResume._id,
        experienceForm.role,
        experienceForm.company,
        experienceForm.duration,
        experienceForm.description
      );
      setExperiences([...experiences, result]);
      setExperienceForm({
        role: "",
        company: "",
        duration: "",
        description: "",
      });
      triggerRefresh();
      alert("Experience added!");
    } catch (error) {
      console.error("Failed to add experience:", error);
    }
  };

  const handleUpdateExperienceSubmit = async () => {
    if (!currentResume || !editingExperience) return;
    try {
      await updateExperience(
        currentResume._id,
        editingExperience._id,
        experienceForm.role,
        experienceForm.company,
        experienceForm.duration,
        experienceForm.description
      );
      setExperiences(
        experiences.map((exp) =>
          exp._id === editingExperience._id
            ? { ...exp, ...experienceForm }
            : exp
        )
      );
      setEditingExperience(null);
      setExperienceForm({
        role: "",
        company: "",
        duration: "",
        description: "",
      });
      alert("Experience updated!");
    } catch (error) {
      console.error("Failed to update experience:", error);
    }
  };

  const startEditingExperience = (exp) => {
    setEditingExperience(exp);
    setExperienceForm({
      role: exp.role,
      company: exp.company,
      duration: exp.duration,
      description: exp.description,
    });
  };

  const cancelEditingExperience = () => {
    setEditingExperience(null);
    setExperienceForm({ role: "", company: "", duration: "", description: "" });
  };

  const handleDeleteExperience = async (experienceId) => {
    if (!currentResume) return;
    try {
      await deleteExperience(currentResume._id, experienceId);
      setExperiences(experiences.filter((exp) => exp._id !== experienceId));
      alert("Experience deleted!");
    } catch (error) {
      console.error("Failed to delete experience:", error);
    }
  };

  const handleAddEducation = async () => {
    if (!currentResume) {
      alert("Please create or load a resume first!");
      return;
    }

    try {
      const result = await addEducation(
        currentResume._id,
        educationForm.institution,
        educationForm.degree,
        educationForm.duration
      );
      setEducations([...educations, result]);
      setEducationForm({ institution: "", degree: "", duration: "" });
      triggerRefresh();
      alert("Education added!");
    } catch (error) {
      console.error("Failed to add education:", error);
    }
  };

  const handleUpdateEducationSubmit = async () => {
    if (!currentResume || !editingEducation) return;
    try {
      await updateEducation(
        currentResume._id,
        editingEducation._id,
        educationForm.institution,
        educationForm.degree,
        educationForm.duration
      );
      setEducations(
        educations.map((edu) =>
          edu._id === editingEducation._id ? { ...edu, ...educationForm } : edu
        )
      );
      setEditingEducation(null);
      setEducationForm({ institution: "", degree: "", duration: "" });
      alert("Education updated!");
    } catch (error) {
      console.error("Failed to update education:", error);
    }
  };

  const startEditingEducation = (edu) => {
    setEditingEducation(edu);
    setEducationForm({
      institution: edu.institution,
      degree: edu.degree,
      duration: edu.duration,
    });
  };

  const cancelEditingEducation = () => {
    setEditingEducation(null);
    setEducationForm({ institution: "", degree: "", duration: "" });
  };

  const handleDeleteEducation = async (educationId) => {
    if (!currentResume) return;
    try {
      await deleteEducation(currentResume._id, educationId);
      setEducations(educations.filter((edu) => edu._id !== educationId));
      alert("Education deleted!");
    } catch (error) {
      console.error("Failed to delete education:", error);
    }
  };

  const handleAddProject = async () => {
    if (!currentResume) {
      alert("Please create or load a resume first!");
      return;
    }

    try {
      const result = await addProject(
        currentResume._id,
        projectForm.title,
        projectForm.link,
        projectForm.description
      );
      setProjects([...projects, result]);
      setProjectForm({ title: "", link: "", description: "" });
      triggerRefresh();
      alert("Project added!");
    } catch (error) {
      console.error("Failed to add project:", error);
    }
  };

  const handleUpdateProjectSubmit = async () => {
    if (!currentResume || !editingProject) return;
    try {
      await updateProject(
        currentResume._id,
        editingProject._id,
        projectForm.title,
        projectForm.link,
        projectForm.description
      );
      setProjects(
        projects.map((proj) =>
          proj._id === editingProject._id ? { ...proj, ...projectForm } : proj
        )
      );
      setEditingProject(null);
      setProjectForm({ title: "", link: "", description: "" });
      alert("Project updated!");
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  const startEditingProject = (proj) => {
    setEditingProject(proj);
    setProjectForm({
      title: proj.title,
      link: proj.link,
      description: proj.description,
    });
  };

  const cancelEditingProject = () => {
    setEditingProject(null);
    setProjectForm({ title: "", link: "", description: "" });
  };

  const handleDeleteProject = async (projectId) => {
    if (!currentResume) return;
    try {
      await deleteProject(currentResume._id, projectId);
      setProjects(projects.filter((proj) => proj._id !== projectId));
      alert("Project deleted!");
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const handleDeleteResume = async (id) => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      try {
        await deleteResume(id);
        await loadResumes();
        if (currentResume?._id === id) {
          setCurrentResume(null);
          setShowEditor(false);
        }
      } catch (error) {
        console.error("Failed to delete resume:", error);
      }
    }
  };

  const handleLoadResume = async (id) => {
    try {
      const resume = await getResumeById(id);
      setCurrentResume(resume);
      setPersonalInfo(
        resume.personal || {
          name: "",
          email: "",
          phone: "",
          linkedIn: "",
          portfolio: "",
        }
      );
      setSummary(resume.summary || "");
      setSkills(resume.skills || []);
      setExperiences(resume.experience || []);
      setEducations(resume.education || []);
      setProjects(resume.projects || []);
      setShowEditor(true);
    } catch (error) {
      console.error("Failed to load resume:", error);
    }
  };

  const handleDownloadResume = () => {
    const element = document.getElementById("template-pdf-content");
    
    if (!element) {
      alert("Resume preview not found!");
      return;
    }
  
    const opt = {
      margin: 0.5,
      filename: `${personalInfo.name || "resume"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        logging: false,
        letterRendering: true,
        backgroundColor: '#ffffff'
      },
      jsPDF: { 
        unit: "in", 
        format: "letter", 
        orientation: "portrait" 
      }
    };

    html2pdf().set(opt).from(element).save();
  };

  const resumeData = {
    personalInfo,
    summary,
    skills,
    experiences,
    educations,
    projects,
  };
  
  const currentTemplate = RESUME_TEMPLATES[selectedTemplate];

  if (showEditor) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#F0FDFA" }}>
        <header
          className="bg-white shadow-sm border-b-2"
          style={{ borderColor: "#0D9488" }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#0D9488" }}
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold" style={{ color: "#134E4A" }}>
                Opvia Editor
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDownloadResume}
                className="px-6 py-2 rounded-lg font-medium transition-colors text-white"
                style={{ backgroundColor: "#0D9488" }}
              >
                Download Resume
              </button>
              <button
                onClick={() => setShowEditor(false)}
                className="px-6 py-2 rounded-lg font-medium transition-colors"
                style={{ backgroundColor: "#F0FDFA", color: "#0D9488" }}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 gap-8">
            {/* Left Panel - Editor */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: "#134E4A" }}
              >
                Edit Your Resume
              </h2>

              {/* Tabs */}
              <div className="flex gap-2 mb-6 flex-wrap">
                {[
                  "personal",
                  "summary",
                  "experience",
                  "education",
                  "skills",
                  "projects",
                ].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="px-4 py-2 rounded-lg font-medium transition-colors"
                    style={{
                      backgroundColor:
                        activeTab === tab ? "#0D9488" : "#F0FDFA",
                      color: activeTab === tab ? "white" : "#134E4A",
                    }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Personal Info Tab */}
              {activeTab === "personal" && (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={personalInfo.name}
                    onChange={(e) =>
                      setPersonalInfo({ ...personalInfo, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
                    style={{
                      borderColor: "#2DD4BF",
                      backgroundColor: "#F0FDFA",
                    }}
                    placeholder="Full Name"
                  />
                  <input
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
                    style={{
                      borderColor: "#2DD4BF",
                      backgroundColor: "#F0FDFA",
                    }}
                    placeholder="Email"
                  />
                  <input
                    type="tel"
                    value={personalInfo.phone}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        phone: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
                    style={{
                      borderColor: "#2DD4BF",
                      backgroundColor: "#F0FDFA",
                    }}
                    placeholder="Phone"
                  />
                  <input
                    type="text"
                    value={personalInfo.linkedIn}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        linkedIn: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
                    style={{
                      borderColor: "#2DD4BF",
                      backgroundColor: "#F0FDFA",
                    }}
                    placeholder="LinkedIn URL"
                  />
                  <input
                    type="text"
                    value={personalInfo.portfolio}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        portfolio: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
                    style={{
                      borderColor: "#2DD4BF",
                      backgroundColor: "#F0FDFA",
                    }}
                    placeholder="Portfolio URL"
                  />
                  <button
                    onClick={handleUpdatePersonal}
                    className="w-full py-2 rounded-lg font-medium text-white"
                    style={{ backgroundColor: "#0D9488" }}
                  >
                    Update Personal Info
                  </button>
                </div>
              )}

              {/* Summary Tab */}
              {activeTab === "summary" && (
                <div className="space-y-4">
                  <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none resize-none"
                    style={{
                      borderColor: "#2DD4BF",
                      backgroundColor: "#F0FDFA",
                    }}
                    placeholder="Write a compelling professional summary..."
                  />
                  <button
                    onClick={handleUpdateSummary}
                    className="w-full py-2 rounded-lg font-medium text-white"
                    style={{ backgroundColor: "#0D9488" }}
                  >
                    Update Summary
                  </button>
                </div>
              )}

              {/* Experience Tab */}
              {activeTab === "experience" && (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={experienceForm.role}
                    onChange={(e) =>
                      setExperienceForm({
                        ...experienceForm,
                        role: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
                    style={{
                      borderColor: "#2DD4BF",
                      backgroundColor: "#F0FDFA",
                    }}
                    placeholder="Job Title"
                  />
                  
                  {/* Company Autocomplete */}
                  <AutoCompleteInput
                    data={COMPANIES}
                    placeholder="Company"
                    value={experienceForm.company}
                    onChange={(value) =>
                      setExperienceForm({
                        ...experienceForm,
                        company: value,
                      })
                    }
                  />
                  
                  <input
                    type="text"
                    value={experienceForm.duration}
                    onChange={(e) =>
                      setExperienceForm({
                        ...experienceForm,
                        duration: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
                    style={{
                      borderColor: "#2DD4BF",
                      backgroundColor: "#F0FDFA",
                    }}
                    placeholder="Duration (e.g., Jan 2023 - Present)"
                  />
                  <textarea
                    value={experienceForm.description}
                    onChange={(e) =>
                      setExperienceForm({
                        ...experienceForm,
                        description: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none resize-none"
                    style={{
                      borderColor: "#2DD4BF",
                      backgroundColor: "#F0FDFA",
                    }}
                    placeholder="Describe your role and achievements..."
                  />
                  {editingExperience ? (
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateExperienceSubmit}
                        className="flex-1 py-2 rounded-lg font-medium text-white"
                        style={{ backgroundColor: "#0D9488" }}
                      >
                        Update Experience
                      </button>
                      <button
                        onClick={cancelEditingExperience}
                        className="px-6 py-2 rounded-lg font-medium"
                        style={{ backgroundColor: "#F0FDFA", color: "#0D9488" }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleAddExperience}
                      className="w-full py-2 rounded-lg font-medium text-white"
                      style={{ backgroundColor: "#0D9488" }}
                    >
                      Add Experience
                    </button>
                  )}

                  <div className="mt-4 space-y-3">
                    {experiences.map((exp, index) => (
                      <div
                        key={exp._id || index}
                        className="p-4 rounded-lg border-2 relative"
                        style={{
                          borderColor: "#2DD4BF",
                          backgroundColor: "#F0FDFA",
                        }}
                      >
                        <div className="absolute top-2 right-2 flex gap-2">
                          <button
                            onClick={() => startEditingExperience(exp)}
                            className="text-blue-600 hover:text-blue-800 font-bold"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => handleDeleteExperience(exp._id)}
                            className="text-red-600 hover:text-red-800 font-bold"
                          >
                            ×
                          </button>
                        </div>
                        <h4
                          className="font-bold pr-16"
                          style={{ color: "#134E4A" }}
                        >
                          {exp.role}
                        </h4>
                        <p className="text-sm" style={{ color: "#0D9488" }}>
                          {exp.company}
                        </p>
                        <p className="text-xs" style={{ color: "#0D9488" }}>
                          {exp.duration}
                        </p>
                        <p
                          className="text-sm mt-2"
                          style={{ color: "#134E4A" }}
                        >
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education Tab */}
              {activeTab === "education" && (
                <div className="space-y-4">
                  {/* Institution Autocomplete */}
                  <AutoCompleteInput
                    data={COLLEGES}
                    placeholder="Institution"
                    value={educationForm.institution}
                    onChange={(value) =>
                      setEducationForm({
                        ...educationForm,
                        institution: value,
                      })
                    }
                  />
                  
                  {/* Degree Autocomplete */}
                  <AutoCompleteInput
                    data={DEGREES}
                    placeholder="Degree"
                    value={educationForm.degree}
                    onChange={(value) =>
                      setEducationForm({
                        ...educationForm,
                        degree: value,
                      })
                    }
                  />
                  
                  <input
                    type="text"
                    value={educationForm.duration}
                    onChange={(e) =>
                      setEducationForm({
                        ...educationForm,
                        duration: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
                    style={{
                      borderColor: "#2DD4BF",
                      backgroundColor: "#F0FDFA",
                    }}
                    placeholder="Duration (e.g., 2019 - 2023)"
                  />
                  {editingEducation ? (
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateEducationSubmit}
                        className="flex-1 py-2 rounded-lg font-medium text-white"
                        style={{ backgroundColor: "#0D9488" }}
                      >
                        Update Education
                      </button>
                      <button
                        onClick={cancelEditingEducation}
                        className="px-6 py-2 rounded-lg font-medium"
                        style={{ backgroundColor: "#F0FDFA", color: "#0D9488" }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleAddEducation}
                      className="w-full py-2 rounded-lg font-medium text-white"
                      style={{ backgroundColor: "#0D9488" }}
                    >
                      Add Education
                    </button>
                  )}

                  <div className="mt-4 space-y-3">
                    {educations.map((edu, index) => (
                      <div
                        key={edu._id || index}
                        className="p-4 rounded-lg border-2 relative"
                        style={{
                          borderColor: "#2DD4BF",
                          backgroundColor: "#F0FDFA",
                        }}
                      >
                        <div className="absolute top-2 right-2 flex gap-2">
                          <button
                            onClick={() => startEditingEducation(edu)}
                            className="text-blue-600 hover:text-blue-800 font-bold"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => handleDeleteEducation(edu._id)}
                            className="text-red-600 hover:text-red-800 font-bold"
                          >
                            ×
                          </button>
                        </div>
                        <h4
                          className="font-bold pr-16"
                          style={{ color: "#134E4A" }}
                        >
                          {edu.degree}
                        </h4>
                        <p className="text-sm" style={{ color: "#0D9488" }}>
                          {edu.institution}
                        </p>
                        <p className="text-xs" style={{ color: "#0D9488" }}>
                          {edu.duration}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Tab */}
              {activeTab === "skills" && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    {/* Skills Autocomplete */}
                    <AutoCompleteInput
                      data={SKILLS}
                      placeholder="Add a skill"
                      value={skillInput}
                      onChange={(value) => setSkillInput(value)}
                    />
                    <button
                      onClick={handleAddSkill}
                      className="px-6 py-2 rounded-lg font-medium text-white whitespace-nowrap"
                      style={{ backgroundColor: "#0D9488" }}
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 rounded-lg flex items-center gap-2"
                        style={{ backgroundColor: "#2DD4BF", color: "#134E4A" }}
                      >
                        <span>{skill}</span>
                        <button
                          onClick={() => handleDeleteSkill(skill)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects Tab */}
              {activeTab === "projects" && (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={projectForm.title}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
                    style={{
                      borderColor: "#2DD4BF",
                      backgroundColor: "#F0FDFA",
                    }}
                    placeholder="Project Title"
                  />
                  <input
                    type="text"
                    value={projectForm.link}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, link: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none"
                    style={{
                      borderColor: "#2DD4BF",
                      backgroundColor: "#F0FDFA",
                    }}
                    placeholder="Project Link"
                  />
                  <textarea
                    value={projectForm.description}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        description: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none resize-none"
                    style={{
                      borderColor: "#2DD4BF",
                      backgroundColor: "#F0FDFA",
                    }}
                    placeholder="Project description..."
                  />
                  {editingProject ? (
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateProjectSubmit}
                        className="flex-1 py-2 rounded-lg font-medium text-white"
                        style={{ backgroundColor: "#0D9488" }}
                      >
                        Update Project
                      </button>
                      <button
                        onClick={cancelEditingProject}
                        className="px-6 py-2 rounded-lg font-medium"
                        style={{ backgroundColor: "#F0FDFA", color: "#0D9488" }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleAddProject}
                      className="w-full py-2 rounded-lg font-medium text-white"
                      style={{ backgroundColor: "#0D9488" }}
                    >
                      Add Project
                    </button>
                  )}

                  <div className="mt-4 space-y-3">
                    {projects.map((proj, index) => (
                      <div
                        key={proj._id || index}
                        className="p-4 rounded-lg border-2 relative"
                        style={{
                          borderColor: "#2DD4BF",
                          backgroundColor: "#F0FDFA",
                        }}
                      >
                        <div className="absolute top-2 right-2 flex gap-2">
                          <button
                            onClick={() => startEditingProject(proj)}
                            className="text-blue-600 hover:text-blue-800 font-bold"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj._id)}
                            className="text-red-600 hover:text-red-800 font-bold"
                          >
                            ×
                          </button>
                        </div>
                        <h4
                          className="font-bold pr-16"
                          style={{ color: "#134E4A" }}
                        >
                          {proj.title}
                        </h4>
                        {proj.link && (
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm underline"
                            style={{ color: "#0D9488" }}
                          >
                            {proj.link}
                          </a>
                        )}
                        <p
                          className="text-sm mt-2"
                          style={{ color: "#134E4A" }}
                        >
                          {proj.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel - Preview */}
            <div className="bg-white rounded-2xl shadow-xl p-8 max-h-screen overflow-y-auto">
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: "#134E4A" }}
              >
                Real-time Preview
              </h2>

              {/* Template Selector */}
              <div className="mb-6">
                <h3 className="text-sm font-bold mb-3" style={{ color: "#134E4A" }}>
                  Choose Template:
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(RESUME_TEMPLATES).map(([key, template]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedTemplate(key)}
                      className={`p-2 rounded-lg border-2 text-xs font-medium transition-all ${
                        selectedTemplate === key 
                          ? 'ring-2 ring-offset-1 shadow-md' 
                          : 'hover:shadow-sm'
                      }`}
                      style={{
                        borderColor: selectedTemplate === key ? '#0D9488' : '#E5E7EB',
                        ringColor: selectedTemplate === key ? '#2DD4BF' : 'transparent',
                        color: '#134E4A'
                      }}
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Template Preview */}
              <div id="template-pdf-content">
                {currentTemplate.preview(resumeData)}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F0FDFA" }}>
      {/* Header */}
      <header
        className="bg-white shadow-sm border-b-2"
        style={{ borderColor: "#0D9488" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#0D9488" }}
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold" style={{ color: "#134E4A" }}>
              Opvia
            </span>
          </div>
          <nav className="flex items-center gap-8">
            <a
              href="/ats-checker"
              className="font-medium hover:underline"
              style={{ color: "#134E4A" }}
            >
              ATS
            </a>
            <a
              href="#pricing"
              className="font-medium hover:underline"
              style={{ color: "#134E4A" }}
            >
              Pricing
            </a>
            <button
              onClick={handleCreateResume}
              disabled={loading}
              className="px-6 py-2 rounded-lg font-medium transition-colors text-white disabled:opacity-50"
              style={{ backgroundColor: "#0D9488" }}
            >
              {loading ? "Creating..." : "Start Building"}
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between gap-12 mb-20">
          <div className="flex-1">
            <h1
              className="text-5xl font-bold leading-tight"
              style={{ color: "#134E4A" }}
            >
              Your next career move,
              <br />
              <span style={{ color: "#0D9488" }}>optimized</span>
            </h1>
            <p className="mt-4 text-lg" style={{ color: "#134E4A" }}>
              Create professional, ATS-friendly resumes in minutes
            </p>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="relative">
              <div
                className="absolute -top-4 -left-4 w-32 h-32 rounded-xl transform rotate-12 opacity-60"
                style={{ backgroundColor: "#2DD4BF" }}
              ></div>
              <div
                className="absolute top-8 left-12 w-40 h-48 rounded-xl transform -rotate-6 opacity-50"
                style={{ backgroundColor: "#0D9488" }}
              ></div>
              <div
                className="absolute top-0 right-0 w-36 h-44 rounded-xl transform rotate-6 opacity-60"
                style={{ backgroundColor: "#2DD4BF" }}
              ></div>
              <div
                className="relative z-10 w-48 h-56 rounded-xl shadow-lg flex items-center justify-center"
                style={{ backgroundColor: "#0D9488" }}
              >
                <div className="space-y-3 w-32">
                  <div
                    className="h-2 rounded w-full"
                    style={{ backgroundColor: "#F0FDFA" }}
                  ></div>
                  <div
                    className="h-2 rounded w-3/4"
                    style={{ backgroundColor: "#F0FDFA" }}
                  ></div>
                  <div
                    className="h-2 rounded w-full"
                    style={{ backgroundColor: "#F0FDFA" }}
                  ></div>
                  <div
                    className="h-2 rounded w-2/3"
                    style={{ backgroundColor: "#F0FDFA" }}
                  ></div>
                </div>
              </div>
              <div
                className="absolute w-2 h-2 rounded-full top-8 -right-2 animate-pulse"
                style={{ backgroundColor: "#2DD4BF" }}
              ></div>
              <div
                className="absolute w-2 h-2 rounded-full bottom-8 -left-2 animate-pulse"
                style={{ backgroundColor: "#2DD4BF" }}
              ></div>
            </div>
          </div>
        </div>

        {/* My Resumes Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6" style={{ color: "#134E4A" }}>
            My Resumes
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div
                key={resume._id}
                className="bg-white rounded-xl shadow-lg p-6 border-2 hover:shadow-xl transition-shadow"
                style={{ borderColor: "#2DD4BF" }}
              >
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: "#134E4A" }}
                >
                  {resume.personal?.name || "Untitled Resume"}
                </h3>
                <p className="text-sm mb-4" style={{ color: "#0D9488" }}>
                  Created: {new Date(resume.createdAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleLoadResume(resume._id)}
                    className="flex-1 py-2 rounded-lg font-medium text-white"
                    style={{ backgroundColor: "#0D9488" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteResume(resume._id)}
                    className="px-4 py-2 rounded-lg font-medium text-white"
                    style={{ backgroundColor: "#ef4444" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {resumes.length === 0 && (
              <div className="col-span-3 text-center py-12">
                <p className="text-lg" style={{ color: "#134E4A" }}>
                  No resumes yet. Click "Start Building" to create your first
                  resume!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;