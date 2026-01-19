import { DatabaseConnection } from "@/config";

export class GuildRepository {
	private db = DatabaseConnection.getInstance().getClient();
	async upsertFromDiscord(discordGuild: { id: string; name: string }) {
		return await this.db.guild.upsert({
			where: { id: discordGuild.id },
			update: {
				name: discordGuild.name,
			},
			create: {
				id: discordGuild.id,
				name: discordGuild.name,
			},
		});
	}
}
