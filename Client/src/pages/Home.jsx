import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import { useResume } from "../context/ResumeContext";
import html2pdf from "html2pdf.js";
import { RESUME_TEMPLATES, ResumePreviewWithPagination } from "../components/ResumeTemplateSelector";
import { SKILLS } from "../suggestions/skiils";
import { COLLEGES } from "../suggestions/colleges";
import { DEGREES } from "../suggestions/degrees";
import { COMPANIES } from "../suggestions/companies";
import AutoCompleteInput from "../components/AutoCompleteInput";
import RichTextEditorWithReorder from "../components/Richtexteditorwithreorder";
import "../index.css";
import Home_Page_logo from "../assets/Home_Page_logo.jpg";
import Opvia_logo from "../assets/Opvia_logo.jpg";
import Resume1 from "../assets/Resume1.webp";
import Resume2 from "../assets/Resume2.webp";
import Resume3 from "../assets/Resume3.webp";
import Resume4 from "../assets/Resume4.webp";


const OPVIA_LOGO_SRC = Opvia_logo;
const HERO_BG_SRC    = Home_Page_logo;
const HERO_IMAGES    = [Resume1, Resume2, Resume3, Resume4];

// ─── Runtime CSS (Tailwind extensions + Google Fonts + custom keyframes) ────
const runtimeStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  :root {
    --t50:  #F0FDFA; --t100: #CCFBF1; --t300: #5EEAD4;
    --t400: #2DD4BF; --t600: #0f766e; --t700: #0D9488;
    --t800: #134E4A; --t900: #0d3d38;
  }
  *, *::before, *::after { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body { font-family: 'DM Sans', sans-serif; }

  .font-syne { font-family: 'Syne', sans-serif !important; }
  .font-dm   { font-family: 'DM Sans', sans-serif !important; }

  /* Gradient text */
  .grad-text {
    background: linear-gradient(135deg, var(--t700) 0%, var(--t400) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  /* Glass card */
  .glass {
    background: rgba(255,255,255,0.76);
    backdrop-filter: blur(22px); -webkit-backdrop-filter: blur(22px);
    border: 1px solid rgba(45,212,191,0.22);
  }

  /* Shimmer CTA button */
  @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
  .btn-shimmer {
    background: linear-gradient(90deg, var(--t700) 25%, var(--t400) 50%, var(--t700) 75%);
    background-size: 200% auto;
    animation: shimmer 3s linear infinite;
    color: #fff; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 600;
  }
  .btn-shimmer:disabled { opacity: 0.5; cursor: not-allowed; animation: none; }

  /* Float animation */
  @keyframes floatY {
    0%,100% { transform: translateY(0) rotate(0deg); }
    33%      { transform: translateY(-16px) rotate(2deg); }
    66%      { transform: translateY(-7px) rotate(-1.5deg); }
  }
  .float     { animation: floatY 8s ease-in-out infinite; }
  .float-lag { animation: floatY 8s ease-in-out infinite; animation-delay: -4s; }

  /* Pulse ring */
  @keyframes pulseRing { 0% { transform: scale(1); opacity: 0.7; } 100% { transform: scale(2.4); opacity: 0; } }
  .pulse-ring { animation: pulseRing 2s ease-out infinite; }

  /* Twinkle */
  @keyframes twinkle {
    0%,100% { opacity: 0.12; transform: scale(1); }
    50%      { opacity: 0.7;  transform: scale(1.5); }
  }

  /* Scrollbar */
  .scroll::-webkit-scrollbar       { width: 4px; }
  .scroll::-webkit-scrollbar-track { background: var(--t50); }
  .scroll::-webkit-scrollbar-thumb { background: var(--t400); border-radius: 999px; }

  /* Hero radial mesh */
  .hero-mesh {
    background:
      radial-gradient(ellipse 80% 60% at 72% 58%, rgba(45,212,191,0.17) 0%, transparent 65%),
      radial-gradient(ellipse 55% 55% at 12% 88%, rgba(13,148,136,0.11) 0%, transparent 55%),
      radial-gradient(ellipse 40% 40% at 88% 8%,  rgba(45,212,191,0.09) 0%, transparent 50%),
      var(--t50);
  }

  /* Grid footer overlay */
  .grid-overlay {
    background-image:
      repeating-linear-gradient(0deg,  transparent, transparent 38px, rgba(45,212,191,0.4) 38px, rgba(45,212,191,0.4) 39px),
      repeating-linear-gradient(90deg, transparent, transparent 38px, rgba(45,212,191,0.4) 38px, rgba(45,212,191,0.4) 39px);
  }

  /* Tag chip */
  .chip {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 14px; border-radius: 999px;
    background: linear-gradient(135deg, var(--t400), var(--t700));
    color: #fff; font-size: 12px; font-weight: 500; font-family: 'DM Sans', sans-serif;
  }

  /* Opvia input */
  .ov-input {
    width: 100%; padding: 10px 16px; border-radius: 12px;
    border: 2px solid var(--t300); background: var(--t50);
    color: var(--t800); font-family: 'DM Sans', sans-serif; font-size: 14px;
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  }
  .ov-input::placeholder { color: var(--t400); opacity: 0.75; }
  .ov-input:focus { border-color: var(--t700); box-shadow: 0 0 0 3px rgba(13,148,136,0.13); }
  .ov-input:not(textarea) { resize: none; }
`;

// ─── Framer Motion variants ──────────────────────────────────
const fadeUp    = { hidden:{ opacity:0, y:26 }, show:{ opacity:1, y:0 } };
const fadeIn    = { hidden:{ opacity:0 },        show:{ opacity:1 }     };
const scaleUp   = { hidden:{ opacity:0, scale:0.86 }, show:{ opacity:1, scale:1 } };
const slideL    = { hidden:{ opacity:0, x:-36 }, show:{ opacity:1, x:0 } };
const slideR    = { hidden:{ opacity:0, x: 36 }, show:{ opacity:1, x:0 } };
const container = (delay=0) => ({
  hidden:{}, show:{ transition:{ staggerChildren:0.1, delayChildren:delay } }
});

// ─── Helpers ─────────────────────────────────────────────────
const ease = [0.22, 1, 0.36, 1];

function useEnterView(margin="-60px") {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin });
  return [ref, inView];
}

// ─── Sub-components ──────────────────────────────────────────
const OvInput = ({ className="", ...props }) => (
  <input className={`ov-input ${className}`} {...props} />
);

const OvTextarea = ({ className="", ...props }) => (
  <textarea className={`ov-input ${className}`} style={{ resize:"none" }} {...props} />
);

const PrimaryBtn = ({ children, className="", style={}, onClick, disabled }) => (
  <motion.button
    whileHover={!disabled ? { scale:1.03, boxShadow:"0 8px 28px rgba(13,148,136,0.38)" } : {}}
    whileTap={!disabled ? { scale:0.97 } : {}}
    onClick={onClick} disabled={disabled}
    className={`btn-shimmer rounded-xl ${className}`}
    style={style}>
    {children}
  </motion.button>
);

const GhostBtn = ({ children, className="", onClick }) => (
  <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }} onClick={onClick}
    className={`font-dm font-medium text-sm rounded-xl cursor-pointer transition-all ${className}`}
    style={{ background:"rgba(13,148,136,0.08)", color:"var(--t700)", border:"1.5px solid rgba(13,148,136,0.25)" }}>
    {children}
  </motion.button>
);

const InfoCard = ({ children }) => (
  <motion.div layout
    initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
    exit={{ opacity:0, scale:0.95 }} transition={{ duration:0.25 }}
    className="relative rounded-xl p-4"
    style={{ background:"var(--t50)", border:"1.5px solid rgba(45,212,191,0.35)" }}>
    {children}
  </motion.div>
);

const FeatureCard = ({ icon, title, desc, index }) => {
  const [ref, inView] = useEnterView("-40px");
  return (
    <motion.div ref={ref}
      variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"}
      transition={{ duration:0.55, ease, delay: index * 0.09 }}
      whileHover={{ y:-7, boxShadow:"0 24px 52px rgba(13,148,136,0.17)" }}
      className="glass rounded-2xl p-8 relative overflow-hidden cursor-default"
      style={{ boxShadow:"0 4px 24px rgba(13,148,136,0.08)" }}>
      <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full opacity-25 blur-3xl"
        style={{ background:"radial-gradient(circle,#2DD4BF,transparent)" }} />
      <div className="text-4xl mb-5 relative z-10">{icon}</div>
      <h3 className="font-syne font-bold text-lg mb-2 relative z-10" style={{ color:"var(--t800)" }}>{title}</h3>
      <p  className="font-dm text-sm leading-relaxed relative z-10" style={{ color:"var(--t800)", opacity:0.62 }}>{desc}</p>
    </motion.div>
  );
};

const StatBadge = ({ value, label, index }) => (
  <motion.div variants={scaleUp} transition={{ duration:0.38, delay: index*0.08 }}
    className="rounded-2xl px-7 py-5"
    style={{ background:"linear-gradient(135deg,var(--t800),var(--t700))", boxShadow:"0 8px 28px rgba(13,148,136,0.26)" }}>
    <p className="font-syne text-white font-extrabold text-2xl leading-none">{value}</p>
    <p className="font-dm text-xs mt-1" style={{ color:"rgba(255,255,255,0.68)" }}>{label}</p>
  </motion.div>
);

const ResumeCard = ({ resume, onEdit, onDelete }) => (
  <motion.div layout
    variants={scaleUp} initial="hidden" animate="show" exit={{ opacity:0, scale:0.9 }}
    transition={{ duration:0.3 }}
    whileHover={{ y:-5, boxShadow:"0 20px 50px rgba(13,148,136,0.2)" }}
    className="bg-white rounded-2xl overflow-hidden"
    style={{ border:"2px solid var(--t400)", boxShadow:"0 4px 20px rgba(13,148,136,0.09)" }}>
  <div className="h-1.5" style={{ background:"linear-gradient(90deg,var(--t700),var(--t400))" }} />
  <div className="p-6">
    <div className="flex items-start justify-between mb-5">
      <div>
        <h3 className="font-syne font-bold text-base" style={{ color:"var(--t800)" }}>
          {resume.personal?.name || "Untitled Resume"}
        </h3>
        <p className="font-dm text-xs mt-0.5" style={{ color:"var(--t700)", opacity:0.7 }}>
          {new Date(resume.createdAt).toLocaleDateString("en-US",{ month:"short", day:"numeric", year:"numeric" })}
        </p>
      </div>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background:"var(--t50)", border:"1.5px solid var(--t400)" }}>
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="var(--t700)" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      </div>
    </div>
    <div className="flex gap-2">
      <PrimaryBtn onClick={onEdit} className="flex-1 py-2.5 text-sm">Edit Resume</PrimaryBtn>
      <motion.button whileHover={{ scale:1.08, background:"rgba(239,68,68,0.15)" }} whileTap={{ scale:0.94 }}
        onClick={onDelete}
        className="px-4 py-2.5 rounded-xl text-lg font-bold cursor-pointer transition-all"
        style={{ background:"rgba(239,68,68,0.07)", border:"1.5px solid rgba(239,68,68,0.2)", color:"#ef4444" }}>
        ×
      </motion.button>
    </div>
  </div>
  </motion.div>
);

// ─── Editor Header ────────────────────────────────────────────
function EditorHeader({ onDownload, onBack }) {
  return (
    <motion.header initial={{ y:-64, opacity:0 }} animate={{ y:0, opacity:1 }}
      transition={{ duration:0.45, ease:"easeOut" }}
      className="sticky top-0 z-50"
      style={{ background:"linear-gradient(90deg,var(--t900),var(--t800))", boxShadow:"0 2px 20px rgba(13,148,136,0.28)" }}>
      <div className="max-w-7xl mx-auto px-7 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {OPVIA_LOGO_SRC
            ? <img src={OPVIA_LOGO_SRC} alt="Opvia" className="h-9 rounded-xl object-contain" />
            : <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background:"linear-gradient(135deg,var(--t400),var(--t700))" }}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
          }
          <span className="font-syne text-white font-bold text-xl tracking-tight">
            Opvia
            <span className="ml-2 font-dm text-xs font-medium tracking-widest uppercase"
              style={{ color:"var(--t400)" }}>Editor</span>
          </span>
        </div>
        <div className="flex gap-3">
          <PrimaryBtn onClick={onDownload} className="px-6 py-2.5 text-sm">↓ Download PDF</PrimaryBtn>
          <GhostBtn onClick={onBack} className="px-6 py-2.5 border" style={{ borderColor:"rgba(45,212,191,0.3)" }}>← Dashboard</GhostBtn>
        </div>
      </div>
    </motion.header>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN
// ═══════════════════════════════════════════════════════════════
const HomePage = () => {
  const {
    createResume, getAllResumes, getResumeById, deleteResume,
    updatePersonal, updateSummary, addSkill, deleteSkill,
    addExperience, updateExperience, deleteExperience,
    addEducation, updateEducation, deleteEducation,
    addProject, updateProject, deleteProject,
  } = useResume();

  const [activeTab,        setActiveTab]        = useState("experience");
  const [resumes,          setResumes]           = useState([]);
  const [currentResume,    setCurrentResume]     = useState(null);
  const [showEditor,       setShowEditor]        = useState(false);
  const [loading,          setLoading]           = useState(false);
  const [selectedTemplate, setSelectedTemplate]  = useState("modern");

  const [editingExperience, setEditingExperience] = useState(null);
  const [editingEducation,  setEditingEducation]  = useState(null);
  const [editingProject,    setEditingProject]    = useState(null);

  const [personalInfo, setPersonalInfo] = useState({ name:"", email:"", phone:"", linkedIn:"", portfolio:"" });
  const [summary,      setSummary]      = useState("");
  const [skillInput,   setSkillInput]   = useState("");
  const [skills,       setSkills]       = useState([]);
  const [experiences,  setExperiences]  = useState([]);
  const [educations,   setEducations]   = useState([]);
  const [projects,     setProjects]     = useState([]);

  const [experienceForm, setExperienceForm] = useState({ role:"", company:"", duration:"", description:"" });
  const [educationForm,  setEducationForm]  = useState({ institution:"", degree:"", duration:"" });
  const [projectForm,    setProjectForm]    = useState({ title:"", link:"", description:"" });

  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = () => setRefreshKey(k => k+1);

  // Hero image flipper state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroRef        = useRef(null);
  const { scrollY }    = useScroll();
  const heroParallax   = useTransform(scrollY, [0, 400], [0, 55]);
  
  // FIXED: Move all useEnterView hooks to top level
  const [featuresHeaderRef, featuresHeaderInView] = useEnterView();
  const [quoteBannerRef, quoteBannerInView] = useEnterView();
  const [resumesHeaderRef, resumesHeaderInView] = useEnterView();

  // Auto-flip hero images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // ── Data helpers ──────────────────────────────────────────
  const refreshCurrentResume = async () => {
    if (!currentResume?._id) return;
    try {
      const r = await getResumeById(currentResume._id);
      setCurrentResume(r);
      setPersonalInfo(r.personal || { name:"", email:"", phone:"", linkedIn:"", portfolio:"" });
      setSummary(r.summary || ""); setSkills(r.skills || []);
      setExperiences(r.experience || []); setEducations(r.education || []); setProjects(r.projects || []);
    } catch(e) { console.error(e); }
  };
  useEffect(() => { 
    if (currentResume?._id) {
      refreshCurrentResume(); 
    }
  }, [refreshKey, currentResume?._id]);
  useEffect(() => { loadResumes(); },          []);

  const loadResumes = async () => {
    try { setResumes(await getAllResumes()); } catch(e) { console.error(e); }
  };

  const handleCreateResume = async () => {
    setLoading(true);
    try {
      const res = await createResume({ name:"Untitled Resume", email:"", phone:"", linkedIn:"", portfolio:"" });
      setCurrentResume(res.resume); setShowEditor(true); await loadResumes();
    } catch(e) { console.error(e); } finally { setLoading(false); }
  };

  const handleUpdatePersonal = async () => {
    if (!currentResume) return;
    try { await updatePersonal(currentResume._id, personalInfo.name, personalInfo.email, personalInfo.phone, personalInfo.linkedIn, personalInfo.portfolio); alert("Personal info updated!"); }
    catch(e) { console.error(e); }
  };
  const handleUpdateSummary = async () => {
    if (!currentResume) return;
    try { await updateSummary(currentResume._id, summary); alert("Summary updated!"); } catch(e) { console.error(e); }
  };
  const handleAddSkill = async () => {
    if (!currentResume || !skillInput.trim()) return;
    try { await addSkill(currentResume._id, skillInput); setSkills([...skills, skillInput]); setSkillInput(""); } catch(e) { console.error(e); }
  };
  const handleDeleteSkill = async (s) => {
    if (!currentResume) return;
    try { await deleteSkill(currentResume._id, s); setSkills(skills.filter(x => x !== s)); } catch(e) { console.error(e); }
  };
  const handleAddExperience = async () => {
    if (!currentResume) { alert("Please create or load a resume first!"); return; }
    if (!experienceForm.role || !experienceForm.company) { alert("Please fill in all required fields!"); return; }
    try {
      const r = await addExperience(currentResume._id, experienceForm.role, experienceForm.company, experienceForm.duration, experienceForm.description);
      setExperiences([...experiences, r]); setExperienceForm({ role:"", company:"", duration:"", description:"" }); triggerRefresh(); alert("Experience added!");
    } catch(e) { console.error(e); }
  };
  const handleUpdateExperienceSubmit = async () => {
    if (!currentResume || !editingExperience) return;
    try {
      await updateExperience(currentResume._id, editingExperience._id, experienceForm.role, experienceForm.company, experienceForm.duration, experienceForm.description);
      setExperiences(experiences.map(e => e._id === editingExperience._id ? { ...e, ...experienceForm } : e));
      setEditingExperience(null); setExperienceForm({ role:"", company:"", duration:"", description:"" }); alert("Experience updated!");
    } catch(e) { console.error(e); }
  };
  const startEditingExperience  = (exp) => { setEditingExperience(exp); setExperienceForm({ role:exp.role, company:exp.company, duration:exp.duration, description:exp.description }); };
  const cancelEditingExperience = ()    => { setEditingExperience(null); setExperienceForm({ role:"", company:"", duration:"", description:"" }); };
  const handleDeleteExperience  = async (id) => {
    if (!currentResume) return;
    try { await deleteExperience(currentResume._id, id); setExperiences(experiences.filter(e => e._id !== id)); alert("Experience deleted!"); } catch(e) { console.error(e); }
  };
  const handleAddEducation = async () => {
    if (!currentResume) { alert("Please create or load a resume first!"); return; }
    try {
      const r = await addEducation(currentResume._id, educationForm.institution, educationForm.degree, educationForm.duration);
      setEducations([...educations, r]); setEducationForm({ institution:"", degree:"", duration:"" }); triggerRefresh(); alert("Education added!");
    } catch(e) { console.error(e); }
  };
  const handleUpdateEducationSubmit = async () => {
    if (!currentResume || !editingEducation) return;
    try {
      await updateEducation(currentResume._id, editingEducation._id, educationForm.institution, educationForm.degree, educationForm.duration);
      setEducations(educations.map(e => e._id === editingEducation._id ? { ...e, ...educationForm } : e));
      setEditingEducation(null); setEducationForm({ institution:"", degree:"", duration:"" }); alert("Education updated!");
    } catch(e) { console.error(e); }
  };
  const startEditingEducation  = (edu) => { setEditingEducation(edu); setEducationForm({ institution:edu.institution, degree:edu.degree, duration:edu.duration }); };
  const cancelEditingEducation = ()    => { setEditingEducation(null); setEducationForm({ institution:"", degree:"", duration:"" }); };
  const handleDeleteEducation  = async (id) => {
    if (!currentResume) return;
    try { await deleteEducation(currentResume._id, id); setEducations(educations.filter(e => e._id !== id)); alert("Education deleted!"); } catch(e) { console.error(e); }
  };
  const handleAddProject = async () => {
    if (!currentResume) { alert("Please create or load a resume first!"); return; }
    try {
      const r = await addProject(currentResume._id, projectForm.title, projectForm.link, projectForm.description);
      setProjects([...projects, r]); setProjectForm({ title:"", link:"", description:"" }); triggerRefresh(); alert("Project added!");
    } catch(e) { console.error(e); }
  };
  const handleUpdateProjectSubmit = async () => {
    if (!currentResume || !editingProject) return;
    try {
      await updateProject(currentResume._id, editingProject._id, projectForm.title, projectForm.link, projectForm.description);
      setProjects(projects.map(p => p._id === editingProject._id ? { ...p, ...projectForm } : p));
      setEditingProject(null); setProjectForm({ title:"", link:"", description:"" }); alert("Project updated!");
    } catch(e) { console.error(e); }
  };
  const startEditingProject  = (p) => { setEditingProject(p); setProjectForm({ title:p.title, link:p.link, description:p.description }); };
  const cancelEditingProject = ()  => { setEditingProject(null); setProjectForm({ title:"", link:"", description:"" }); };
  const handleDeleteProject  = async (id) => {
    if (!currentResume) return;
    try { await deleteProject(currentResume._id, id); setProjects(projects.filter(p => p._id !== id)); alert("Project deleted!"); } catch(e) { console.error(e); }
  };
  const handleDeleteResume = async (id) => {
    if (!window.confirm("Delete this resume?")) return;
    try {
      await deleteResume(id); await loadResumes();
      if (currentResume?._id === id) { setCurrentResume(null); setShowEditor(false); }
    } catch(e) { console.error(e); }
  };
  const handleLoadResume = async (id) => {
    try {
      const r = await getResumeById(id);
      setCurrentResume(r);
      setPersonalInfo(r.personal || { name:"", email:"", phone:"", linkedIn:"", portfolio:"" });
      setSummary(r.summary || ""); setSkills(r.skills || []);
      setExperiences(r.experience || []); setEducations(r.education || []); setProjects(r.projects || []);
      setShowEditor(true);
    } catch(e) { console.error(e); }
  };
  const handleDownloadResume = () => {
    const el = document.getElementById("template-pdf-content");
    if (!el) { alert("Resume preview not found!"); return; }
    html2pdf().set({
      margin:0.5, filename:`${personalInfo.name || "resume"}.pdf`,
      image:{ type:"jpeg", quality:0.98 },
      html2canvas:{ scale:2, useCORS:true, logging:false, letterRendering:true, backgroundColor:"#ffffff" },
      jsPDF:{ unit:"in", format:"letter", orientation:"portrait" }
    }).from(el).save();
  };

  const resumeData      = { personalInfo, summary, skills, experiences, educations, projects };
  const currentTemplate = RESUME_TEMPLATES[selectedTemplate];
  const TABS            = ["personal","summary","experience","education","skills","projects"];

  // ═══════════════════ EDITOR ═══════════════════
  if (showEditor) {
    return (
      <>
        <style>{runtimeStyles}</style>
        <motion.div key="editor" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          className="min-h-screen"
          style={{ background:"linear-gradient(135deg,var(--t50) 0%,#e2f8f5 50%,var(--t50) 100%)" }}>
          <EditorHeader onDownload={handleDownloadResume} onBack={() => setShowEditor(false)} />

          <main className="max-w-7xl mx-auto px-7 py-8">
            <div className="grid grid-cols-2 gap-7 items-start">

              {/* LEFT: EDITOR */}
              <motion.div variants={slideL} initial="hidden" animate="show"
                transition={{ duration:0.5, ease }}
                className="glass rounded-3xl p-8"
                style={{ boxShadow:"0 8px 40px rgba(13,148,136,0.11)" }}>
                <div className="mb-6">
                  <h2 className="font-syne font-bold text-xl" style={{ color:"var(--t800)" }}>Craft Your Story</h2>
                  <p className="font-dm text-xs mt-1" style={{ color:"var(--t700)", opacity:0.78 }}>Every great career starts with the right words.</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 flex-wrap">
                  {TABS.map(tab => (
                    <motion.button key={tab} onClick={() => setActiveTab(tab)}
                      whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                      className="relative font-dm font-medium text-xs px-4 py-2 rounded-lg cursor-pointer transition-all"
                      style={activeTab === tab
                        ? { background:"linear-gradient(135deg,var(--t700),var(--t400))", color:"#fff", boxShadow:"0 4px 14px rgba(13,148,136,0.3)", border:"1.5px solid transparent" }
                        : { background:"var(--t50)", color:"var(--t800)", border:"1.5px solid rgba(45,212,191,0.3)" }}>
                      {tab.charAt(0).toUpperCase()+tab.slice(1)}
                    </motion.button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div key={activeTab}
                    initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
                    transition={{ duration:0.22 }}>

                    {/* PERSONAL */}
                    {activeTab === "personal" && (
                      <div className="flex flex-col gap-3">
                        {[{k:"name",p:"Full Name",t:"text"},{k:"email",p:"Email Address",t:"email"},{k:"phone",p:"Phone Number",t:"tel"},{k:"linkedIn",p:"LinkedIn URL",t:"text"},{k:"portfolio",p:"Portfolio / Website URL",t:"text"}].map(({ k,p,t }) => (
                          <OvInput key={k} type={t} placeholder={p} value={personalInfo[k]}
                            onChange={e => setPersonalInfo({ ...personalInfo, [k]:e.target.value })} />
                        ))}
                        <PrimaryBtn onClick={handleUpdatePersonal} className="py-3 mt-1 text-sm w-full">Save Personal Info</PrimaryBtn>
                      </div>
                    )}

                    {/* SUMMARY */}
                    {activeTab === "summary" && (
                      <div className="flex flex-col gap-3">
                        <OvTextarea value={summary} onChange={e => setSummary(e.target.value)} rows={7}
                          placeholder="Write a compelling professional summary that tells your story…" />
                        <PrimaryBtn onClick={handleUpdateSummary} className="py-3 text-sm w-full">Save Summary</PrimaryBtn>
                      </div>
                    )}

                    {/* EXPERIENCE */}
                    {activeTab === "experience" && (
                      <div className="flex flex-col gap-3">
                        <OvInput type="text" placeholder="Job Title / Role" value={experienceForm.role}
                          onChange={e => setExperienceForm({ ...experienceForm, role:e.target.value })} />
                        <AutoCompleteInput data={COMPANIES} placeholder="Company" value={experienceForm.company}
                          onChange={v => setExperienceForm({ ...experienceForm, company:v })} />
                        <OvInput type="text" placeholder="Duration (e.g. Jan 2023 – Present)" value={experienceForm.duration}
                          onChange={e => setExperienceForm({ ...experienceForm, duration:e.target.value })} />
                        <RichTextEditorWithReorder value={experienceForm.description}
                          onChange={v => setExperienceForm({ ...experienceForm, description:v })} />
                        {editingExperience
                          ? <div className="flex gap-2">
                              <PrimaryBtn onClick={handleUpdateExperienceSubmit} className="flex-1 py-2.5 text-sm">Update Experience</PrimaryBtn>
                              <GhostBtn onClick={cancelEditingExperience} className="px-5 py-2.5">Cancel</GhostBtn>
                            </div>
                          : <PrimaryBtn onClick={handleAddExperience} className="py-3 text-sm w-full">+ Add Experience</PrimaryBtn>
                        }
                        <AnimatePresence>
                          {experiences.map((exp, i) => (
                            <InfoCard key={exp._id||i}>
                              <div className="absolute top-3 right-3 flex gap-2">
                                <motion.button whileHover={{ scale:1.2 }} onClick={() => startEditingExperience(exp)}
                                  style={{ background:"none", border:"none", cursor:"pointer", fontSize:16, color:"var(--t700)" }}>✎</motion.button>
                                <motion.button whileHover={{ scale:1.2 }} onClick={() => handleDeleteExperience(exp._id)}
                                  style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, color:"#ef4444" }}>×</motion.button>
                              </div>
                              <p className="font-syne font-bold text-sm pr-10" style={{ color:"var(--t800)" }}>{exp.role}</p>
                              <p className="font-dm text-xs" style={{ color:"var(--t700)" }}>{exp.company}</p>
                              <p className="font-dm text-xs opacity-60" style={{ color:"var(--t700)" }}>{exp.duration}</p>
                              <div className="text-xs mt-1 resume-description" style={{ color:"var(--t800)" }} dangerouslySetInnerHTML={{ __html:exp.description }} />
                            </InfoCard>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* EDUCATION */}
                    {activeTab === "education" && (
                      <div className="flex flex-col gap-3">
                        <AutoCompleteInput data={COLLEGES} placeholder="Institution" value={educationForm.institution}
                          onChange={v => setEducationForm({ ...educationForm, institution:v })} />
                        <AutoCompleteInput data={DEGREES} placeholder="Degree / Program" value={educationForm.degree}
                          onChange={v => setEducationForm({ ...educationForm, degree:v })} />
                        <OvInput type="text" placeholder="Duration (e.g. 2019 – 2023)" value={educationForm.duration}
                          onChange={e => setEducationForm({ ...educationForm, duration:e.target.value })} />
                        {editingEducation
                          ? <div className="flex gap-2">
                              <PrimaryBtn onClick={handleUpdateEducationSubmit} className="flex-1 py-2.5 text-sm">Update Education</PrimaryBtn>
                              <GhostBtn onClick={cancelEditingEducation} className="px-5 py-2.5">Cancel</GhostBtn>
                            </div>
                          : <PrimaryBtn onClick={handleAddEducation} className="py-3 text-sm w-full">+ Add Education</PrimaryBtn>
                        }
                        <AnimatePresence>
                          {educations.map((edu, i) => (
                            <InfoCard key={edu._id||i}>
                              <div className="absolute top-3 right-3 flex gap-2">
                                <motion.button whileHover={{ scale:1.2 }} onClick={() => startEditingEducation(edu)}
                                  style={{ background:"none", border:"none", cursor:"pointer", fontSize:16, color:"var(--t700)" }}>✎</motion.button>
                                <motion.button whileHover={{ scale:1.2 }} onClick={() => handleDeleteEducation(edu._id)}
                                  style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, color:"#ef4444" }}>×</motion.button>
                              </div>
                              <p className="font-syne font-bold text-sm pr-10" style={{ color:"var(--t800)" }}>{edu.degree}</p>
                              <p className="font-dm text-xs" style={{ color:"var(--t700)" }}>{edu.institution}</p>
                              <p className="font-dm text-xs opacity-60" style={{ color:"var(--t700)" }}>{edu.duration}</p>
                            </InfoCard>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* SKILLS */}
                    {activeTab === "skills" && (
                      <div className="flex flex-col gap-4">
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <AutoCompleteInput data={SKILLS} placeholder="Type a skill…" value={skillInput}
                              onChange={v => setSkillInput(v)} />
                          </div>
                          <PrimaryBtn onClick={handleAddSkill} className="px-6 py-2.5 text-sm whitespace-nowrap">Add</PrimaryBtn>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <AnimatePresence>
                            {skills.map((skill, i) => (
                              <motion.span key={skill+i}
                                initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }}
                                exit={{ scale:0, opacity:0 }} transition={{ type:"spring", stiffness:380, damping:22 }}
                                className="chip">
                                {skill}
                                <button onClick={() => handleDeleteSkill(skill)}
                                  style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.72)", fontSize:16, padding:0 }}>×</button>
                              </motion.span>
                            ))}
                          </AnimatePresence>
                          {skills.length === 0 && <p className="font-dm text-xs opacity-60" style={{ color:"var(--t700)" }}>No skills added yet.</p>}
                        </div>
                      </div>
                    )}

                    {/* PROJECTS */}
                    {activeTab === "projects" && (
                      <div className="flex flex-col gap-3">
                        <OvInput type="text" placeholder="Project Title" value={projectForm.title}
                          onChange={e => setProjectForm({ ...projectForm, title:e.target.value })} />
                        <OvInput type="text" placeholder="Project Link / URL" value={projectForm.link}
                          onChange={e => setProjectForm({ ...projectForm, link:e.target.value })} />
                        <RichTextEditorWithReorder value={projectForm.description}
                          onChange={v => setProjectForm({ ...projectForm, description:v })} />
                        {editingProject
                          ? <div className="flex gap-2">
                              <PrimaryBtn onClick={handleUpdateProjectSubmit} className="flex-1 py-2.5 text-sm">Update Project</PrimaryBtn>
                              <GhostBtn onClick={cancelEditingProject} className="px-5 py-2.5">Cancel</GhostBtn>
                            </div>
                          : <PrimaryBtn onClick={handleAddProject} className="py-3 text-sm w-full">+ Add Project</PrimaryBtn>
                        }
                        <AnimatePresence>
                          {projects.map((proj, i) => (
                            <InfoCard key={proj._id||i}>
                              <div className="absolute top-3 right-3 flex gap-2">
                                <motion.button whileHover={{ scale:1.2 }} onClick={() => startEditingProject(proj)}
                                  style={{ background:"none", border:"none", cursor:"pointer", fontSize:16, color:"var(--t700)" }}>✎</motion.button>
                                <motion.button whileHover={{ scale:1.2 }} onClick={() => handleDeleteProject(proj._id)}
                                  style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, color:"#ef4444" }}>×</motion.button>
                              </div>
                              <p className="font-syne font-bold text-sm pr-10" style={{ color:"var(--t800)" }}>{proj.title}</p>
                              {proj.link && <a href={proj.link} target="_blank" rel="noreferrer"
                                className="font-dm text-xs underline" style={{ color:"var(--t700)" }}>{proj.link}</a>}
                              <div className="text-xs mt-1 resume-description" style={{ color:"var(--t800)" }} dangerouslySetInnerHTML={{ __html:proj.description }} />
                            </InfoCard>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}

                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* RIGHT: PREVIEW */}
              <motion.div variants={slideR} initial="hidden" animate="show"
                transition={{ duration:0.5, delay:0.1, ease }}
                className="glass rounded-3xl p-7 scroll"
                style={{ maxHeight:"90vh", overflowY:"auto", boxShadow:"0 8px 40px rgba(13,148,136,0.11)" }}>
                <h3 className="font-syne font-bold text-sm mb-4" style={{ color:"var(--t800)" }}>Choose Template</h3>
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {Object.entries(RESUME_TEMPLATES).map(([key, tmpl]) => (
                    <motion.button key={key} onClick={() => setSelectedTemplate(key)}
                      whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                      className="py-2.5 px-2 rounded-xl text-xs font-syne font-semibold cursor-pointer transition-all"
                      style={selectedTemplate === key
                        ? { background:"linear-gradient(135deg,var(--t700),var(--t400))", color:"#fff", boxShadow:"0 4px 14px rgba(13,148,136,0.3)", border:"2px solid transparent" }
                        : { background:"var(--t50)", color:"var(--t800)", border:"2px solid #e5e7eb" }}>
                      {tmpl.name}
                    </motion.button>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4 scroll" style={{ maxHeight:"68vh", overflowY:"auto" }}>
                  <ResumePreviewWithPagination resumeData={resumeData} selectedTemplate={selectedTemplate} />
                </div>
                <div style={{ position:"absolute", left:-9999 }}>
                  <div id="template-pdf-content">{currentTemplate.preview(resumeData)}</div>
                </div>
              </motion.div>

            </div>
          </main>
        </motion.div>
      </>
    );
  }

  // ═══════════════════════ HOME VIEW ═══════════════════════════
  return (
    <>
      <style>{runtimeStyles}</style>
      <div className="min-h-screen" style={{ background:"var(--t50)" }}>

        {/* ──── NAVBAR ──── */}
        <motion.header initial={{ y:-72, opacity:0 }} animate={{ y:0, opacity:1 }}
          transition={{ duration:0.5, ease }}
          className="bg-white sticky top-0 z-50"
          style={{ borderBottom:"2px solid var(--t400)", boxShadow:"0 2px 22px rgba(13,148,136,0.09)" }}>
          <div className="max-w-7xl mx-auto px-8 h-[70px] flex items-center justify-between">
            <motion.div className="flex items-center gap-3" whileHover={{ scale:1.025 }}>
              {OPVIA_LOGO_SRC
                ? <img src={OPVIA_LOGO_SRC} alt="Opvia" className="h-10 rounded-xl object-contain" />
                : <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background:"linear-gradient(135deg,var(--t700),var(--t400))", boxShadow:"0 4px 14px rgba(13,148,136,0.32)" }}>
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
              }
              <span className="font-syne font-extrabold text-[22px] tracking-tight" style={{ color:"var(--t800)" }}>Opvia</span>
            </motion.div>

            <nav className="flex items-center gap-9">
              {[["ATS Checker","/ats-checker"],["Pricing","#pricing"],["My Resumes","#resumes"]].map(([label, href]) => (
                <motion.a key={label} href={href} whileHover={{ color:"var(--t700)" }}
                  className="font-dm font-medium text-sm relative group" style={{ color:"var(--t800)", textDecoration:"none" }}>
                  {label}
                  <span className="absolute -bottom-0.5 left-0 h-[1.5px] w-0 group-hover:w-full transition-all duration-200 rounded-full"
                    style={{ background:"var(--t700)" }} />
                </motion.a>
              ))}
              <PrimaryBtn onClick={handleCreateResume} disabled={loading} className="px-7 py-2.5 text-sm">
                {loading ? "Creating…" : "Start Building →"}
              </PrimaryBtn>
            </nav>
          </div>
        </motion.header>

        {/* ──── HERO ──── */}
        <section ref={heroRef} className="relative overflow-hidden hero-mesh" style={{ padding:"90px 32px 112px" }}>
          {/* Hero background image with parallax */}
          {HERO_BG_SRC && (
            <motion.img src={HERO_BG_SRC} alt=""
              style={{ y: heroParallax, position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", opacity:0.11, pointerEvents:"none" }} />
          )}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background:"linear-gradient(135deg,rgba(240,253,250,0.97) 0%,rgba(204,251,241,0.9) 50%,rgba(240,253,250,0.86) 100%)" }} />

          {/* Twinkling ambient dots */}
          {[...Array(9)].map((_, i) => (
            <div key={i} className="absolute w-1.5 h-1.5 rounded-full"
              style={{ top:`${8+i*10}%`, left:`${4+i*11}%`, background:"var(--t400)", opacity:0.2,
                animation:`twinkle ${2.2+i*0.35}s ease-in-out ${i*0.28}s infinite` }} />
          ))}

          <div className="max-w-7xl mx-auto relative z-10 flex items-center gap-16">
            {/* Copy */}
            <motion.div className="flex-1" variants={container(0.1)} initial="hidden" animate="show">
              <motion.div variants={fadeUp} transition={{ duration:0.5 }}>
                <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-dm font-medium text-xs mb-6"
                  style={{ background:"rgba(45,212,191,0.14)", border:"1px solid rgba(45,212,191,0.35)", color:"var(--t800)" }}>
                  <span className="w-2 h-2 rounded-full" style={{ background:"var(--t700)" }} />
                  ATS-Optimized Resume Builder
                </span>
              </motion.div>

              <motion.h1 variants={fadeUp} transition={{ duration:0.62, delay:0.05 }}
                className="font-syne font-extrabold leading-none tracking-tight mb-6"
                style={{ fontSize:"clamp(40px,5vw,68px)", color:"var(--t800)" }}>
                Your next career move,
                <br />
                <span className="grad-text">optimized.</span>
              </motion.h1>

              <motion.p variants={fadeUp} transition={{ duration:0.55, delay:0.1 }}
                className="font-dm text-lg leading-relaxed max-w-md mb-9"
                style={{ color:"var(--t800)", opacity:0.72 }}>
                Build resumes that pass ATS filters, impress recruiters, and land the interviews you deserve — in minutes, not hours.
              </motion.p>

              <motion.div variants={fadeUp} transition={{ duration:0.5, delay:0.15 }}
                className="flex items-center gap-5 flex-wrap">
                <PrimaryBtn onClick={handleCreateResume} disabled={loading}
                  className="px-10 py-4 text-base rounded-2xl">
                  {loading ? "Setting up…" : "Create Free Resume →"}
                </PrimaryBtn>
                <span className="font-dm text-xs" style={{ color:"var(--t700)", opacity:0.8 }}>
                  ✓ No credit card &nbsp;·&nbsp; ✓ Instant download
                </span>
              </motion.div>

              <motion.div className="flex gap-4 mt-12 flex-wrap"
                variants={container(0.28)} initial="hidden" animate="show">
                {[{v:"50K+",l:"Resumes built"},{v:"3× higher",l:"Interview rate"},{v:"94%",l:"ATS pass rate"}].map((s,i) => (
                  <StatBadge key={s.l} value={s.v} label={s.l} index={i} />
                ))}
              </motion.div>
            </motion.div>

            {/* Visual - Hero Image with Flip Animation */}
            <div className="flex-1 flex justify-center relative" style={{ minHeight: 560 }}>
              {/* Floating accent blobs - background layer */}
              <motion.div
                className="absolute top-12 right-16 w-32 h-40 rounded-3xl"
                style={{
                  background: "linear-gradient(135deg, #2DD4BF, #0D9488)",
                  transform: "rotate(14deg)",
                  boxShadow: "0 20px 50px rgba(45,212,191,0.3)",
                  opacity: 0.75,
                  filter: "blur(1px)",
                }}
                animate={{ y: [0, -12, 0], rotate: [14, 18, 14] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />

              <motion.div
                className="absolute bottom-20 left-8 w-24 h-32 rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, #0D9488, #2DD4BF)",
                  transform: "rotate(-10deg)",
                  boxShadow: "0 15px 40px rgba(13,148,136,0.25)",
                  opacity: 0.65,
                  filter: "blur(1px)",
                }}
                animate={{ y: [0, -8, 0], rotate: [-10, -14, -10] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />

              {/* Main Resume Card with Image Flip */}
              <motion.div
                className="relative z-10 rounded-3xl overflow-hidden"
                style={{
                  width: 460,
                  height: 660,
                  boxShadow:
                    "0 40px 90px rgba(13,148,136,0.45), 0 0 0 1px rgba(45,212,191,0.25)",
                }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 50px 110px rgba(13,148,136,0.55), 0 0 0 2px rgba(45,212,191,0.4)",
                }}
              >
                {/* Animated Background Images */}
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={HERO_IMAGES[currentImageIndex]}
                    alt="Resume visualization"
                    className="w-full h-full object-cover absolute inset-0"
                    initial={{ opacity: 0, rotateY: 90 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={{ opacity: 0, rotateY: -90 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  />
                </AnimatePresence>

                {/* Gradient overlay for depth */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.45) 100%)",
                  }}
                />

                {/* Top accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-2"
                  style={{
                    background: "linear-gradient(90deg, #0D9488, #2DD4BF)",
                  }}
                />

                {/* Bottom info overlay */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 p-8"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(13,148,136,0) 0%, rgba(13,148,136,0.95) 40%)",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        background: "rgba(45,212,191,0.2)",
                        border: "2px solid rgba(45,212,191,0.4)",
                      }}
                    >
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="#2DD4BF"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p
                        className="font-syne font-bold text-white text-lg leading-tight"
                        style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
                      >
                        Professional Resume
                      </p>
                      <p
                        className="font-dm text-xs"
                        style={{ color: "rgba(255,255,255,0.8)" }}
                      >
                        ATS-Optimized & Ready
                      </p>
                    </div>
                  </div>

                  {/* Progress indicators */}
                  <div className="flex gap-2">
                    {[85, 92, 78].map((width, i) => (
                      <motion.div
                        key={i}
                        className="h-1.5 rounded-full"
                        style={{
                          width: `${width}%`,
                          background: "rgba(45,212,191,0.6)",
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${width}%` }}
                        transition={{ duration: 1, delay: 0.7 + i * 0.15, ease: "easeOut" }}
                      />
                    ))}
                  </div>
                </motion.div>

                {/* Checkmark badge */}
                <motion.div
                  className="absolute top-6 right-6 w-14 h-14 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #2DD4BF, #0D9488)",
                    boxShadow: "0 8px 24px rgba(45,212,191,0.5)",
                  }}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 15 }}
                >
                  <svg
                    width="28"
                    height="28"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#fff"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              </motion.div>

              {/* Animated pulse rings */}
              <motion.div
                className="absolute top-24 left-20"
                style={{ width: 16, height: 16 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ background: "#2DD4BF" }}
                  animate={{
                    scale: [1, 2.5],
                    opacity: [0.7, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
                <div
                  className="absolute rounded-full"
                  style={{ inset: 3, background: "#2DD4BF" }}
                />
              </motion.div>

              <motion.div
                className="absolute bottom-32 right-24"
                style={{ width: 12, height: 12 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ background: "#0D9488" }}
                  animate={{
                    scale: [1, 2.5],
                    opacity: [0.7, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 1,
                  }}
                />
                <div
                  className="absolute rounded-full"
                  style={{ inset: 2, background: "#0D9488" }}
                />
              </motion.div>

              {/* Floating particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: i % 2 === 0 ? "#2DD4BF" : "#0D9488",
                    opacity: 0.3,
                    top: `${15 + i * 12}%`,
                    left: `${8 + i * 15}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 0.7, 0.3],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ──── DIVIDER ──── */}
        <div className="mx-8 h-px opacity-40"
          style={{ background:"linear-gradient(90deg,transparent,var(--t400),transparent)" }} />

        {/* ──── FEATURES ──── */}
        <section className="max-w-7xl mx-auto px-8 py-20">
          <motion.div ref={featuresHeaderRef} variants={fadeUp} initial="hidden" animate={featuresHeaderInView?"show":"hidden"}
            transition={{ duration:0.6, ease }} className="text-center mb-14">
            <p className="font-dm text-xs font-semibold tracking-widest uppercase mb-3"
              style={{ color:"var(--t700)" }}>Why Opvia</p>
            <h2 className="font-syne font-extrabold text-4xl tracking-tight"
              style={{ color:"var(--t800)" }}>Built for the modern job seeker</h2>
          </motion.div>
          <div className="grid grid-cols-3 gap-6">
            {[
              { icon:"⚡", title:"Lightning Fast",      desc:"Go from blank page to polished, download-ready PDF in under 5 minutes." },
              { icon:"🎯", title:"ATS-Ready",           desc:"Every template is engineered to pass all major applicant tracking systems — no hacks, just results." },
              { icon:"✨", title:"Professional Templates", desc:"Designed by hiring managers for hiring managers. Stand out without standing out of place." },
            ].map((p,i) => <FeatureCard key={p.title} {...p} index={i} />)}
          </div>
        </section>

        {/* ──── QUOTE BANNER ──── */}
        <motion.section ref={quoteBannerRef} variants={fadeIn} initial="hidden" animate={quoteBannerInView?"show":"hidden"}
          transition={{ duration:0.7, ease }}
          className="relative overflow-hidden"
          style={{ background:"linear-gradient(135deg,var(--t800),var(--t900))", padding:"68px 32px" }}>
          <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full opacity-10"
            style={{ border:"55px solid var(--t400)" }} />
          <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full opacity-8"
            style={{ border:"40px solid var(--t600)" }} />
          <motion.div className="max-w-2xl mx-auto text-center relative z-10"
            initial={{ opacity:0, y:28 }} animate={quoteBannerInView?{ opacity:1, y:0 }:{ opacity:0, y:28 }}
            transition={{ duration:0.65, delay:0.15 }}>
            <p className="font-syne font-extrabold text-7xl leading-none"
              style={{ color:"var(--t400)", opacity:0.32, marginBottom:"-8px" }}>"</p>
            <p className="font-syne font-semibold leading-snug"
              style={{ fontSize:"clamp(18px,2.6vw,28px)", color:"#fff", letterSpacing:"-0.01em" }}>
              Your resume is your first impression.<br />Make it the only one they remember.
            </p>
            <div className="mt-7 inline-flex items-center gap-4">
              <div className="h-px w-14" style={{ background:"var(--t400)" }} />
              <span className="font-dm text-xs font-medium tracking-widest uppercase"
                style={{ color:"var(--t400)" }}>The Opvia Principle</span>
              <div className="h-px w-14" style={{ background:"var(--t400)" }} />
            </div>
          </motion.div>
        </motion.section>

        {/* ──── MY RESUMES ──── */}
        <section id="resumes" className="max-w-7xl mx-auto px-8 py-20">
          <div className="flex items-center justify-between mb-9">
            <motion.h2 ref={resumesHeaderRef} variants={fadeUp} initial="hidden" animate={resumesHeaderInView?"show":"hidden"}
              transition={{ duration:0.55, ease }}
              className="font-syne font-extrabold text-4xl tracking-tight m-0"
              style={{ color:"var(--t800)" }}>My Resumes</motion.h2>
            <motion.div initial={{ opacity:0, x:20 }} whileInView={{ opacity:1, x:0 }}
              viewport={{ once:true }} transition={{ duration:0.45 }}>
              <PrimaryBtn onClick={handleCreateResume} disabled={loading} className="px-6 py-2.5 text-sm">
                {loading ? "Creating…" : "+ New Resume"}
              </PrimaryBtn>
            </motion.div>
          </div>

          <AnimatePresence>
            <motion.div className="grid gap-5"
              style={{ gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))" }}
              variants={container()} initial="hidden" animate="show">
              {resumes.map(r => (
                <ResumeCard key={r._id} resume={r}
                  onEdit={() => handleLoadResume(r._id)}
                  onDelete={() => handleDeleteResume(r._id)} />
              ))}
            </motion.div>
          </AnimatePresence>

          {resumes.length === 0 && (
            <motion.div initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.5 }}
              className="glass rounded-3xl text-center py-24"
              style={{ boxShadow:"0 4px 32px rgba(13,148,136,0.09)" }}>
              <motion.div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                style={{ background:"linear-gradient(135deg,var(--t400),var(--t700))" }}
                animate={{ y:[0,-10,0] }} transition={{ duration:3, repeat:Infinity, ease:"easeInOut" }}>
                <svg width="38" height="38" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </motion.div>
              <h3 className="font-syne font-bold text-xl mb-3" style={{ color:"var(--t800)" }}>No resumes yet</h3>
              <p className="font-dm text-sm mb-8" style={{ color:"var(--t700)", opacity:0.68 }}>
                Your career story starts here. Create your first resume in minutes.
              </p>
              <PrimaryBtn onClick={handleCreateResume} disabled={loading} className="px-12 py-3.5 text-base">
                {loading ? "Creating…" : "Create My First Resume"}
              </PrimaryBtn>
            </motion.div>
          )}
        </section>

        {/* ──── FOOTER ──── */}
        <footer className="relative overflow-hidden" style={{ background:"var(--t900)", padding:"42px 32px" }}>
          <div className="absolute inset-0 grid-overlay opacity-[0.04]" />
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background:"linear-gradient(135deg,var(--t400),var(--t700))" }}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <span className="font-syne font-bold text-white text-lg">Opvia</span>
            </div>
            <p className="font-dm text-xs" style={{ color:"rgba(255,255,255,0.38)" }}>
              © {new Date().getFullYear()} Opvia. Build careers worth having.
            </p>
          </div>
        </footer>

      </div>
    </>
  );
};

export default HomePage;