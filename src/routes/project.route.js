import express from "express"
import { createProject, deleteProject, getAllProjects, getOneProject, updateProject } from "../controllers/project.controller.js";

const router = express.Router();

router.get("/get-one-project/:projectId",getOneProject)
router.get("/all-projects/:userId",getAllProjects)
router.post("/create-project",createProject)
router.post("/update-project/:projectId",updateProject)
router.post("/delete-project/:projectId",deleteProject)


export default router;