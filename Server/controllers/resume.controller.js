import { Resume } from "../models/resume.model.js";
import mongoose from "mongoose";


export const createResume = async (req, res) => {
    try {
        const { personal } = req.body;

        if (!personal || !personal.name) {
            return res.status(400).json({
                message: "Personal name is required",
            });
        }

        const newResume = new Resume({
            personal,
            summary: "",
            skills: [],
            experience: [],
            projects: [],
            education: [],
        });

        await newResume.save();

        res.status(201).json({
            resumeId: newResume._id,
            resume: newResume,
        });
    } catch (error) {
        console.error("createResume error:", error);
        res.status(500).json({
            message: "Error creating resume",
            error: error.message,
            stack: error.stack,
        });
    }
};

// export const getResumeByOwnerId = async (req, res) => {
//     try {
//         const { ownerId } = req.params;

//         const resumes = await Resume.find({ ownerId });

//         res.status(200).json(resumes);
//     } catch (error) {
//         res.status(500).json({
//             message: "Error fetching resumes",
//             error: error.message
//         });
//     }
// };


export const deleteResume = async (req, res) => {
    try {
        let { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid resume ID" });
        }

        const deletedResume = await Resume.findByIdAndDelete(id);

        if (!deletedResume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        res.status(200).json({ message: "Resume deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error deleting resume", error } );
    }
}

export const getResumeById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid resume ID" });
        }

        const resume = await Resume.findById(id);

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        res.status(200).json(resume);
    } catch (error) {
        res.status(500).json({ message: "Error fetching resume", error });
    }
};

export const getAllResumes = async (req, res) => {
    try {
        const resumes = await Resume.find(); // Fetch all resumes from MongoDB
        res.status(200).json(resumes);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching resumes",
            error: error.message,
        });
    }
};

export const updatePersonal = async (req, res) => {
    let { name, email, phone, linkedIn, portfolio } = req.body;
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid resume ID" });
        }

        const updatedPersonal = await Resume.findByIdAndUpdate(
            id,
            {
                $set: {
                    ...(name && { "personal.name": name }),
                    ...(email && { "personal.email": email }),
                    ...(phone && { "personal.phone": phone }),
                    ...(linkedIn && { "personal.linkedIn": linkedIn }),
                    ...(portfolio && { "personal.portfolio": portfolio }),
                 }
                 
            },
            { new: true }
        );

        if (!updatedPersonal) {
            return res.status(404).json({ message: "Resume not found" });
        }

        res.status(200).json(updatedPersonal);
    } catch (error) {
        res.status(500).json({ message: "Error updating resume", error });
    }
};

export const updateSummary = async (req, res) => {
    let { summary } = req.body;
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid resume ID" });
        }

        const updatedResume = await Resume.findByIdAndUpdate(
            id,
            {
                summary,
            },
            { new: true }
        );

        if (!updatedResume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        res.status(200).json(updatedResume);
    } catch (error) {
        res.status(500).json({ message: "Error updating summary", error });
    }
};



export const addSkill = async (req, res) => {
    try {
        const { id } = req.params;
        const { skill } = req.body;

        if (!skill || typeof skill !== "string") {
            return res.status(400).json({ message: "Skill must be a string" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid resume ID" });
        }

        const updatedResume = await Resume.findByIdAndUpdate(
            id,
            {
                $addToSet: { skills: skill } // prevents duplicates
            },
            { new: true }
        );

        if (!updatedResume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        res.status(200).json(updatedResume.skills);
    } catch (error) {
        res.status(500).json({
            message: "Error adding skill",
            error: error.message
        });
    }
};

export const deleteSkill = async (req, res) => {
    try {
        const { id } = req.params;
        const { skill } = req.body;

        if (!skill || typeof skill !== "string") {
            return res.status(400).json({ message: "Skill must be a string" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid resume ID" });
        }

        const updatedResume = await Resume.findByIdAndUpdate(
            id,
            {
                $pull: { skills: skill }
            },
            { new: true }
        );

        if (!updatedResume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        res.status(200).json(updatedResume.skills);
    } catch (error) {
        res.status(500).json({
            message: "Error deleting skill",
            error: error.message
        });
    }
};




export const addExperience = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, company, duration, description } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid resume ID" });
        }

        const updatedResume = await Resume.findByIdAndUpdate(
            id,
            {
                $push: {
                    experience: { role, company, duration, description },
                },
            },
            { new: true }
        );

        if (!updatedResume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        res.status(200).json(updatedResume.experience);
    } catch (error) {
        res.status(500).json({
            message: "Error adding experience",
            error: error.message,
        });
    }
};

export const updateExperience = async (req, res) => {
    try {
        const { id, experienceId } = req.params;
        const { role, company, duration, description } = req.body;

        if (
            !mongoose.Types.ObjectId.isValid(id) ||
            !mongoose.Types.ObjectId.isValid(experienceId)
        ) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const updatedResume = await Resume.findOneAndUpdate(
            { _id: id, "experience._id": experienceId },
            {
                $set: {
                    "experience.$.role": role,
                    "experience.$.company": company,
                    "experience.$.duration": duration,
                    "experience.$.description": description,
                },
            },
            { new: true }
        );

        if (!updatedResume) {
            return res.status(404).json({ message: "Resume or experience not found" });
        }

        res.status(200).json(updatedResume.experience);
    } catch (error) {
        res.status(500).json({
            message: "Error updating experience",
            error: error.message,
        });
    }
};


export const deleteExperience = async (req, res) => {
    try {
        const { id, experienceId } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(id) ||
            !mongoose.Types.ObjectId.isValid(experienceId)
        ) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const updatedResume = await Resume.findByIdAndUpdate(
            id,
            {
                $pull: {
                    experience: { _id: experienceId },
                },
            },
            { new: true }
        );

        if (!updatedResume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        res.status(200).json(updatedResume.experience);
    } catch (error) {
        res.status(500).json({
            message: "Error deleting experience",
            error: error.message,
        });
    }
};



export const addEducation = async (req, res) => {
    try {
        const { id } = req.params;
        const { institution, degree, duration } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid resume ID" });
        }

        const updatedResume = await Resume.findByIdAndUpdate(
            id,
            {
                $push: {
                    education: { institution, degree, duration }
                }
            },
            { new: true }
        );

        if (!updatedResume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        res.status(200).json(updatedResume.education);
    } catch (error) {
        res.status(500).json({
            message: "Error adding education",
            error: error.message
        });
    }
};

export const updateEducation = async (req, res) => {
    try {
        const { id, educationId } = req.params;
        const { institution, degree, duration } = req.body;

        if (
            !mongoose.Types.ObjectId.isValid(id) ||
            !mongoose.Types.ObjectId.isValid(educationId)
        ) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const updatedResume = await Resume.findOneAndUpdate(
            { _id: id, "education._id": educationId },
            {
                $set: {
                    "education.$.institution": institution,
                    "education.$.degree": degree,
                    "education.$.duration": duration
                }
            },
            { new: true }
        );

        if (!updatedResume) {
            return res.status(404).json({ message: "Resume or education not found" });
        }

        res.status(200).json(updatedResume.education);
    } catch (error) {
        res.status(500).json({
            message: "Error updating education",
            error: error.message
        });
    }
};

export const deleteEducation = async (req, res) => {
    try {
        const { id, educationId } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(id) ||
            !mongoose.Types.ObjectId.isValid(educationId)
        ) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const updatedResume = await Resume.findByIdAndUpdate(
            id,
            {
                $pull: {
                    education: { _id: educationId }
                }
            },
            { new: true }
        );

        if (!updatedResume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        res.status(200).json(updatedResume.education);
    } catch (error) {
        res.status(500).json({
            message: "Error deleting education",
            error: error.message
        });
    }
};


export const addProject = async (req, res) => {
    try {
        let { id } = req.params;
        let { title, link, description } = req.body;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({ message: "Invalid resume ID" });
        }

        const updatedResume = await Resume.findByIdAndUpdate(
            id,
            {
                $addToSet: {
                    projects: { title, link, description }
                }
            },
            { new: true }
        );

        if (!updatedResume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        res.status(200).json(updatedResume.projects);

    } catch (error) {
        res.status(500).json({message: "Error adding project", error: error.message});
    }
}

export const updateProject = async (req, res) => {
    try {
        let { id, projectId } = req.params;
        let { title, link, description } = req.body;

        if(!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(projectId)){
            return res.status(400).json({ message: "Invalid ID" });
        }

        const updatedResume = await Resume.findOneAndUpdate(
            { _id: id, "projects._id": projectId },
            {
                $set: {
                    "projects.$.title": title,
                    "projects.$.link": link,
                    "projects.$.description": description
                }
            },
            { new: true }
        );

        if (!updatedResume) {
            return res.status(404).json({ message: "Resume or project not found" });
        }

        res.status(200).json(updatedResume.projects);
    } catch (error) {
        res.status(500).json({message: "Error updating project", error: error.message});
    }
}

export const deleteProject = async (req, res) => {
    try {
        let { id, projectId } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(projectId)){
            return res.status(400).json({ message: "Invalid ID" });
        }

        const updatedResume = await Resume.findByIdAndUpdate(
            id,
            {
                $pull: {
                    projects: { _id: projectId }
                }
            },
            { new: true }
        );

        if (!updatedResume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        res.status(200).json(updatedResume.projects);
    } catch (error) {
        res.status(500).json({message: "Error deleting project", error: error.message});
    }
}