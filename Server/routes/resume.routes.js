import express from 'express';
import {
    createResume,
    getResumeById,
    deleteResume,
    getAllResumes,
   //  getResumeByOwnerId,

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
} from "../controllers/resume.controller.js";

const router = express.Router();

// Create resume
router.post("/", createResume);

//get All
router.get("/", getAllResumes);

// Get resume by ID
router.get("/:id", getResumeById);
// router.get('/owner/:ownerId', getResumeByOwnerId)

// Delete resume
router.delete("/:id", deleteResume);



/* =======================
   Personal & Summary
======================= */

router.patch("/:id/personal", updatePersonal);
router.patch("/:id/summary", updateSummary);


/* =======================
   Skills
======================= */

router.post("/:id/skills", addSkill);
router.delete("/:id/skills", deleteSkill);


/* =======================
   Experience
======================= */

router.post("/:id/experience", addExperience);
router.patch("/:id/experience/:experienceId", updateExperience);
router.delete("/:id/experience/:experienceId", deleteExperience);


/* =======================
   Education
======================= */

router.post("/:id/education", addEducation);
router.patch("/:id/education/:educationId", updateEducation);
router.delete("/:id/education/:educationId", deleteEducation);


/* =======================
   Projects
======================= */

router.post("/:id/projects", addProject);
router.patch("/:id/projects/:projectId", updateProject);
router.delete("/:id/projects/:projectId", deleteProject);

export default router;





