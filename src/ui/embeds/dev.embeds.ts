import { DevStats, GitHubRepo, GitHubUser } from "@/modules/dev";
import { baseEmbed } from "./base.embed";
import { EMBED_COLORS } from "../colors";

export const devEmbeds = {
	devDisabled: () =>
        baseEmbed()
            .setColor(EMBED_COLORS.WARNING)
            .setTitle("⚠️ Developer Mode Disabled")
            .setDescription("The developer mode is currently disabled for this server. Please contact an administrator to enable it."),
	devProfileEmbed: (profile: GitHubUser) =>
		baseEmbed()
			.setColor(EMBED_COLORS.GITHUB)
			.setTitle(`💻 ${profile.login}`)
			.setURL(profile.html_url)
			.setThumbnail(profile.avatar_url)
			.setDescription(profile.bio || "No bio available.")
			.addFields(
				{
					name: "📊 Stats",
					value: [
						`**Repos:** ${profile.public_repos}`,
						`**Followers:** ${profile.followers}`,
						`**Following:** ${profile.following}`,
					].join("\n"),
					inline: true,
				},
				{
					name: "🔗 Links",
					value: `[GitHub Profile](${profile.html_url})`,
					inline: true,
				},
			)
			.setFooter({
				text: "Powered by GitHub API",
				iconURL:
					"https://github.githubassets.com/images/modules/site/icons/footer/github-mark.svg",
			}),
	devReposEmbed: (username: string, repos: GitHubRepo[]) => {
		const maxReposToShow = 10;
		const displayedRepos = repos.slice(0, maxReposToShow);
		const remaining = repos.length - maxReposToShow;
		const repoList = displayedRepos
			.map(
				(repo) =>
					`• **[${repo.name}](${repo.html_url})** - ${repo.description || "*No description*"}`,
			)
			.join("\n");
		let description = `Found **${repos.length}** repositories for **${username}**.\n\n${repoList}`;

		if (remaining > 0)
			description += `\n\n*...and ${remaining} more repositories*`;
		return baseEmbed()
			.setColor(EMBED_COLORS.SUCCESS)
			.setTitle(`📚 ${username}'s Repositories`)
			.setDescription(description)
			.setFooter({
				text: `Showing ${displayedRepos.length} of ${repos.length} repositories`,
				iconURL:
					"https://github.githubassets.com/images/modules/site/icons/footer/github-mark.svg",
			});
	},
	devRepoEmbed: (repo: GitHubRepo) =>
		baseEmbed()
			.setColor(EMBED_COLORS.INFO)
			.setTitle(`📦 ${repo.full_name}`)
			.setURL(repo.html_url)
			.setDescription(repo.description || "*No description available*")
			.addFields(
				{
					name: "🌟 Stats",
					value: [
						`**Stars:** ${repo.stargazers_count}`,
						`**Forks:** ${repo.forks_count}`,
						`**Language:** ${repo.language || "Not specified"}`,
					].join("\n"),
					inline: true,
				},
				{
					name: "🔗 Links",
					value: `[View on GitHub](${repo.html_url})`,
					inline: true,
				},
			)
			.setFooter({
				text: "Powered by GitHub API",
				iconURL:
					"https://github.githubassets.com/images/modules/site/icons/footer/github-mark.svg",
			}),
	devStatsEmbed: (username: string, stats: DevStats) => {
		const totalBytes = Object.values(stats.languages).reduce(
			(a, b) => a + b,
			0,
		);
		const topLangs =
			Object.entries(stats.languages)
				.sort((a, b) => b[1] - a[1])
				.slice(0, 5)
				.map(([lang, bytes]) => {
					const percent = ((bytes / totalBytes) * 100).toFixed(1);
					const barLength = 10;
					const filled = Math.round(
						(parseFloat(percent) / 100) * barLength,
					);
					const adjustedFilled =
						parseFloat(percent) > 0 ? Math.max(1, filled) : 0; // ✅ Ensure at least 1 bar if percentage > 0
					const bar =
						"█".repeat(adjustedFilled) +
						"░".repeat(barLength - adjustedFilled);
					return `${lang}: ${bar} ${percent}%`;
				})
				.join("\n") || "No languages detected";

		const devScoreNum =
			typeof stats.devScore === "number"
				? stats.devScore
				: Number(stats.devScore ?? 0);
		const scoreColor =
			devScoreNum >= 8
				? EMBED_COLORS.SUCCESS
				: devScoreNum >= 5
					? EMBED_COLORS.WARNING
					: EMBED_COLORS.ERROR;

		return baseEmbed()
			.setColor(scoreColor)
			.setTitle(`📈 ${username}'s Dev Stats`)
			.setDescription(
				`🚀 **Dev Score: ${stats.devScore}/10** | Comprehensive overview of ${username}'s GitHub activity.`,
			)
			.addFields(
				{
					name: "🛠️ Top Languages",
					value: topLangs,
					inline: false,
				},
				{
					name: "📊 Activity (Last 90 Days)",
					value: [
						`**🟩 Commits:** ${stats.commits90d}`,
						`**🔥 Active Days:** ${stats.activeDays}`,
					].join("\n"),
					inline: true,
				},
				{
					name: "📚 Repository Stats",
					value: [`**Public Repos:** ${stats.repos.length}`].join(
						"\n",
					),
					inline: true,
				},
			)
			.setFooter({
				text: "Powered by GitHub API • Data from public repositories",
				iconURL:
					"https://github.githubassets.com/images/modules/site/icons/footer/github-mark.svg",
			});
	},
};
