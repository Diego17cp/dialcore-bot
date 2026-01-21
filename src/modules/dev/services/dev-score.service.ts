import { GitHubRepo } from "../dev.types";

export const calculateDevScore = ({
    commits90d,
    activeDays,
    repos,
    languages,
}: {
    commits90d: number;
    activeDays: number;
    repos: GitHubRepo[];
    languages: number;
}): string => {
    let score = 0;
    score += Math.min(commits90d / 20, 3);
    score += Math.min(activeDays / 5, 3);
    score += Math.min(repos.length / 10, 2);
    score += Math.min(languages, 2);
    return Math.min(score, 10).toFixed(1);
}