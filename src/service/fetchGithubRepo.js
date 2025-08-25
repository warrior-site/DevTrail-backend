
export const fetchGithubRepoFromGithub = async (username) => {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        if (!response.ok) {
            throw new Error("Failed to fetch repositories");
            console.log("error while fetching repositories");
        }
        const repos = await response.json();
        return repos;
    } catch (error) {
        console.error("Error fetching GitHub repositories:", error);
        throw error;
    }
};
