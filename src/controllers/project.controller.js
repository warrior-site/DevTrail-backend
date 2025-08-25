import { createProjectDocument, updateProjectDocument,getOneProjectDocument, getUserAllProjects } from "../dao/project.doa.js";
import User from "../models/user.model.js";
export const createProject = async (req, res) => {

    const data = req.body
    try {
        if (!data.title || !data.repoLink || !data.liveLink || !data.description || !data.significance || !data.techStack) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const project = await createProjectDocument(data);
        await User.findByIdAndUpdate(data.userId, { $inc: { projectCount: 1 } });
        return res.status(201).json({ message: "Project created successfully", project });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
        console.log(error);
    }


};

export const updateProject = async (req, res) => {
    const data = req.body;
    try {
        const changeData = {
            ...(data.title && { title: data.title }),
            ...(data.repoLink && { repoLink: data.repoLink }),
            ...(data.liveLink && { liveLink: data.liveLink }),
            ...(data.description && { description: data.description }),
            ...(data.significance && { significance: data.significance }),
            ...(data.techStack && { techStack: data.techStack }),
        }
        const project = await updateProjectDocument(req.params.id, changeData);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        return res.status(200).json({ message: "Project updated successfully", project });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};

export const deleteProject = async(req,res)=>{
    const {projectId} =req.params;
    try {
        const project = await deleteProjectDocument(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        return res.status(200).json({ message: "Project deleted successfully", project });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};
export const getOneProject = async(req,res)=>{
    const {projectId} = req.params;
    try {
        const project = await getOneProjectDocument(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        return res.status(200).json({ message: "Project retrieved successfully", project });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}

export const getAllProjects = async(req,res)=>{
     const {userId} = req.params;
    try {
        const projects = await getUserAllProjects(userId);
        return res.status(200).json({ message: "Projects retrieved successfully", projects });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}