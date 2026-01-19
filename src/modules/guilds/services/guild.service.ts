import { GuildRepository } from "../repositories/guild.repository";

export class GuildService {
	private repo = new GuildRepository();
	async sync(discordGuild: { id: string; name: string }) {
		return await this.repo.upsertFromDiscord(discordGuild);
	}
}
