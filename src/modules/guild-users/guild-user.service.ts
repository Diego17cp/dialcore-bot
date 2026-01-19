import { GuildUserRepository } from "./guild-user.repository";

export class GuildUserService {
	private repo = new GuildUserRepository();
	async ensureMembership(guildId: string, userId: string) {
		return await this.repo.link(guildId, userId);
	}
}
