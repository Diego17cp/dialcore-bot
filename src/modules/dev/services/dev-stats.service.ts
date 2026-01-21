import { GitHubEvent, GitHubRepo } from "../dev.types";
import { calculateDevScore } from "./dev-score.service";
import { getDevEvents, getDevLanguages, getDevRepos } from "./github.service";

export const buildStats = async (username: string) => {
	const repos: GitHubRepo[] = await getDevRepos(username);
	const events: GitHubEvent[] = await getDevEvents(username);

	const langBytes: Record<string, number> = {};
	for (const repo of repos.slice(0, 15)) {
		if (repo.fork) continue;
		const langs: Record<string, number> = await getDevLanguages(username, repo.name);
		for (const [lang, bytes] of Object.entries(langs)) {
			langBytes[lang] = (langBytes[lang] || 0) + bytes;
		}
	}
	const commits90d = events.filter(e => e.type === "PushEvent").length;

	const activeDays = new Set(
		events.map(e => e.created_at.slice(0, 10)),
	).size;

    const devScore = calculateDevScore({
        commits90d,
        activeDays,
        repos,
        languages: Object.keys(langBytes).length,
    })
    return {
        languages: langBytes,
        commits90d,
        activeDays,
        repos,
        devScore,
    }
};
