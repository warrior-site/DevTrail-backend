import mongoose from "mongoose"
import Project from "../models/project.model.js"

export const getUserAllProjects = async (userId) => {
    const projects = await Project.find({ userId: userId });
    return projects;
}

export const getOneProjectDocument = async (projectId) => {
    const project = await Project.findById(projectId);
    return project;
}

export const createProjectDocument = async (data) => {
    const project = new Project({
        userId: data.userId,
        title: data.title,
        repoLink: data.repoLink,
        liveLink: data.liveLink,
        description: data.description,
        significance: data.significance,
        techStack: data.techStack
    });
    await project.save();
    return project;
}

export const updateProjectDocument = async (projectId,data) =>{
   const project = await Project.findByIdAndUpdate(projectId, {$set: data}, { new: true });
   return project;
}

export const deleteProjectDocument = async (projectId) =>{
   const project = await Project.findOneAndDelete({ _id: projectId });
   return project;
}