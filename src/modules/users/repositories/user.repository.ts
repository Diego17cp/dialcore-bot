import { DatabaseConnection } from "@/config";

export class UserRepository {
	private db = DatabaseConnection.getInstance().getClient();

	async upsertFromDiscord(discordUser: {
		id: string;
		username: string;
		avatar: string | null;
	}) {
		return await this.db.user.upsert({
			where: { id: discordUser.id },
			update: {
				username: discordUser.username,
				avatar: discordUser.avatar,
			},
			create: {
				id: discordUser.id,
				username: discordUser.username,
				avatar: discordUser.avatar,
			},
		});
	}
}
