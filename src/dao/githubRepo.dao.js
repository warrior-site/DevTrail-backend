import GithubRepo from "../models/githubRepo.model.js";

export const createGithubRepoDocument = async (userId, repos) => {
    try {
        const githubRepo = new GithubRepo({
            userId,
            repos
        });
        await githubRepo.save();
        return githubRepo;
    } catch (error) {
        console.error("Error creating GitHub repo document:", error);
        throw error;
    }
}
export const fetchGithubRepo = async (userId) => {
    try {
        const githubRepo = await GithubRepo.findOne({ userId: userId });
        return githubRepo;
    } catch (error) {
        console.error("Error fetching GitHub repo document:", error);
        throw error;
    }
}

export const deleteGithubRepoDocument = async (userId) => {
    try {
        await GithubRepo.deleteOne({ userId: userId });
        return true;
    } catch (error) {
        console.error("Error deleting GitHub repo document:", error);
        throw error;
    }
}

export const updateGithubRepoDocument = async (userId, repos) => {
    try {
        const githubRepo = await GithubRepo.findOneAndUpdate(
            { userId: userId },
            { $set: { repos: repos, lastSynced: new Date() } },
            { new: true }
        );
        return githubRepo;
    } catch (error) {
        console.error("Error updating GitHub repo document:", error);
        throw error;
    }
}
