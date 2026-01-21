import { getCache, setCache } from "../dev.cache"
import { getGithubProfile, getRepo, getUserRepos, getEvents, getRepoLanguages } from "../dev.github";
import { GitHubEvent, GitHubRepo, GitHubUser } from "../dev.types";

export const getDevProfile = async (username: string) => {
    const cached = getCache<GitHubUser>(`profile:${username}`);
    if (cached) return cached;
    const data = await getGithubProfile(username);
    setCache(`profile:${username}`, data, 10 * 60_000); // Cache for 10 minutes
    return data;
}
export const getDevRepos = async (username: string) => {
    const cached = getCache<GitHubRepo[]>(`repos:${username}`);
    if (cached) return cached;
    const data = await getUserRepos(username);
    setCache(`repos:${username}`, data);
    return data;
}
export const getDevRepo = async (owner: string, repo: string) => {
    const cacheKey = `repo:${owner}/${repo}`;
    const cached = getCache<GitHubRepo>(cacheKey);
    if (cached) return cached;
    const data = await getRepo(owner, repo);
    setCache(cacheKey, data);
    return data;
}
export const getDevLanguages = async (owner: string, repo: string) => {
    const cacheKey = `repo-languages:${owner}/${repo}`;
    const cached = getCache<Record<string, number>>(cacheKey);
    if (cached) return cached;
    const data = await getRepoLanguages(owner, repo);
    setCache(cacheKey, data);
    return data;
}
export const getDevEvents = async (username: string) => {
    const cacheKey = `events:${username}`;
    const cached = getCache<GitHubEvent[]>(cacheKey);
    if (cached) return cached;
    const data = await getEvents(username);
    setCache(cacheKey, data, 5 * 60_000);
    return data;
}