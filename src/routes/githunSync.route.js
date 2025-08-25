import express from "express"
import { deleteGithubRepoController, GithubRepoController, updateGithubRepoController } from "../controllers/githubRepo.controller.js";

const router = express.Router();

router.post("/sync", GithubRepoController);
router.post("/sync-again",updateGithubRepoController)
router.post("/delete",deleteGithubRepoController)

export default router;
