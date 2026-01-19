import { DatabaseConnection } from "@/config";

export class GuildUserRepository {
	private db = DatabaseConnection.getInstance().getClient();
	async link(guildId: string, userId: string) {
		return await this.db.guildUser.upsert({
			where: {
				guildId_userId: { guildId, userId },
			},
			update: {},
			create: {
				guildId,
				userId,
			},
		});
	}
}
