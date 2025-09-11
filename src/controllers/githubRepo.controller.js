import { fetchGithubRepo, createGithubRepoDocument, deleteGithubRepoDocument, updateGithubRepoDocument } from "../dao/githubRepo.dao.js";
import User from "../models/user.model.js";
import { fetchGithubRepoFromGithub } from "../service/fetchGithubRepo.js";

export const GithubRepoController = async (req, res) => {
  const { githubUsername, userId } = req.body;

  try {
    if (!githubUsername) {
      return res.status(400).json({ message: "GitHub username is required" });
    }

    let githubRepos = await fetchGithubRepo(userId);

    // If repos not in DB → fetch from GitHub API
    if (!githubRepos || githubRepos.length === 0) {
      const repos = await fetchGithubRepoFromGithub(githubUsername);

      if (!repos || repos.length === 0) {
        return res.status(404).json({ message: "No GitHub repositories found" });
      }

      // Format repositories
      const formatRepo = repos.map(repo => ({
        id: repo.id, // ✅ GitHub repo ID
        name: repo.name,
        url: repo.html_url,
        description: repo.description || "",
        language: repo.language || "Unknown",
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        updatedAt: repo.updated_at ? new Date(repo.updated_at) : null
      }));

      // Save into DB
      const githubRepo = await createGithubRepoDocument(userId, formatRepo);

      if (!githubRepo) {
        return res.status(500).json({ message: "Failed to create GitHub repository document" });
      }

      githubRepos = githubRepo;
      await User.findOneAndUpdate({_id:userId},{$set:{repoCount: githubRepos.length}});
      return res.status(201).json({ message: "GitHub repositories synced successfully", githubRepos });

    }

    // If already in DB
    await User.findOneAndUpdate({_id:userId},{$set:{repoCount: githubRepos.length}});
    return res.status(200).json({ message: "GitHub repositories fetched successfully", githubRepos });

  } catch (error) {
    console.error("Error syncing GitHub repositories:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteGithubRepoController = async (req, res) => {
  const { userId } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const deleted = await deleteGithubRepoDocument(userId);

    if (!deleted) {
      return res.status(404).json({ message: "GitHub repo document not found" });
    }

    return res.status(200).json({ message: "GitHub repository document deleted successfully" });
  } catch (error) {
    console.error("Error deleting GitHub repos:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const updateGithubRepoController = async (req, res) => {
  const { userId, githubUsername } = req.body;

  try {
    if (!userId || !githubUsername) {
      return res.status(400).json({ message: "userId and githubUsername are required" });
    }

    // 1. Fetch fresh repos from GitHub API
    const repos = await fetchGithubRepoFromGithub(githubUsername);

    if (!repos || repos.length === 0) {
      return res.status(404).json({ message: "No GitHub repositories found" });
    }

    // 2. Format repositories for DB
    const formatRepo = repos.map(repo => ({
      id: repo.id, // ✅ GitHub repo ID
      name: repo.name,
      url: repo.html_url,
      description: repo.description || "",
      language: repo.language || "Unknown",
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      updatedAt: repo.updated_at ? new Date(repo.updated_at) : null
    }));

    // 3. Update the user's repo document
    const updatedRepo = await updateGithubRepoDocument(userId, formatRepo);

    if (!updatedRepo) {
      return res.status(404).json({ message: "GitHub repo document not found" });
    }

    return res.status(200).json({
      message: "GitHub repositories updated successfully",
      githubRepos: updatedRepo,
    });
  } catch (error) {
    console.error("Error updating GitHub repos:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const syncGithubReposController = async (req, res) => {
  const { githubUsername, userId } = req.body;

  try {
    if (!githubUsername) {
      return res.status(400).json({ message: "GitHub username is required" });
    }

    // ✅ Always fetch from GitHub
    const repos = await fetchGithubRepoFromGithub(githubUsername);

    if (!repos || repos.length === 0) {
      return res.status(404).json({ message: "No GitHub repositories found" });
    }

    // ✅ Format repositories
    const formatRepo = repos.map(repo => ({
      id: repo.id,
      name: repo.name,
      url: repo.html_url,
      description: repo.description || "",
      language: repo.language || "Unknown",
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      updatedAt: repo.updated_at ? new Date(repo.updated_at) : null
    }));

    // ✅ Replace old repos in DB with new ones
    const githubRepo = await createGithubRepoDocument(userId, formatRepo);

    if (!githubRepo) {
      return res.status(500).json({ message: "Failed to update GitHub repository document" });
    }

    // ✅ Update repoCount in User schema
    await User.findOneAndUpdate(
      { _id: userId },
      { $set: { repoCount: formatRepo.length } }
    );

    return res.status(200).json({
      message: "GitHub repositories synced successfully with latest data",
      githubRepos: githubRepo,
    });

  } catch (error) {
    console.error("Error syncing GitHub repositories:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
