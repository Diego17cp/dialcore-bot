import { DatabaseConnection } from "@/config";

export class UserSettingsRepository {
	private db = DatabaseConnection.getInstance().getClient();
	async getSettingsForUser(userId: string) {
		return await this.db.userSettings.findUnique({
			where: { userId },
			include: {
				User: true,
			},
		});
	}
	async upsertSettingsForUser(
		userId: string,
		settings: {
			language: string;
			timezone: string;
			notificationsEnabled: boolean;
		},
	) {
		return await this.db.userSettings.upsert({
			where: { userId },
			update: {
				language: settings.language,
				timezone: settings.timezone,
				notificationsEnabled: settings.notificationsEnabled,
			},
			create: {
				userId,
				language: settings.language,
				timezone: settings.timezone,
				notificationsEnabled: settings.notificationsEnabled,
			},
			include: {
				User: true,
			},
		});
	}
}
