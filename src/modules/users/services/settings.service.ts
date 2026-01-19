import { UserSettingsRepository } from "../repositories/settings.repository";

export class UserSettingsService {
	private repo = new UserSettingsRepository();
	async getSettingsForUser(userId: string) {
		if (!userId) throw new Error("User ID is required to get settings.");
		return await this.repo.getSettingsForUser(userId);
	}
	async upsertSettingsForUser(
		userId: string,
		settings: {
			language: string;
			timezone: string;
			notificationsEnabled: boolean;
		},
	) {
		if (!userId) throw new Error("User ID is required to upsert settings.");
		return await this.repo.upsertSettingsForUser(userId, settings);
	}
}
