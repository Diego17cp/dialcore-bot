import { env } from "@/config";
import axios from "axios";

const github = axios.create({
	baseURL: "https://api.github.com",
	headers: {
		Accept: "application/vnd.github+json",
		Authorization: `Bearer ${env.GITHUB_TOKEN}`,
	},
});

export const getGithubProfile = async (username: string) => {
	const response = await github.get(`/users/${username}`);
	if (response.status !== 200)
		throw new Error(
			`Failed to fetch GitHub profile for ${username}: ${response.status} ${response.statusText}`,
		);
    return response.data;
};
export const getUserRepos = async (username: string) => {
    const response = await github.get(`/users/${username}/repos`);
    if (response.status !== 200)
        throw new Error(
            `Failed to fetch GitHub repos for ${username}: ${response.status} ${response.statusText}`,
        );
    return response.data;
}
export const getRepo = async (owner: string, repo: string) => {
    const response = await github.get(`/repos/${owner}/${repo}`);
    if (response.status !== 200)
        throw new Error(
            `Failed to fetch GitHub repo ${owner}/${repo}: ${response.status} ${response.statusText}`,
        );
    return response.data;
}
export const getRepoLanguages = async (owner: string, repo: string) => {
    const response = await github.get(`/repos/${owner}/${repo}/languages`);
    if (response.status !== 200)
        throw new Error(
            `Failed to fetch GitHub repo languages for ${owner}/${repo}: ${response.status} ${response.statusText}`,
        );
    return response.data;
}
export const getEvents = async (username: string) => {
    const response = await github.get(`/users/${username}/events/public`);
    if (response.status !== 200)
        throw new Error(
            `Failed to fetch GitHub events for ${username}: ${response.status} ${response.statusText}`,
        );
    return response.data;
}