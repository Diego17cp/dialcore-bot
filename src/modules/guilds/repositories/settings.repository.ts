import { DatabaseConnection } from "@/config";

export class GuildSettingsRepository {
	private db = DatabaseConnection.getInstance().getClient();
	async getSettingsForGuild(guildId: string) {
		return await this.db.guildConfig.findUnique({
			where: { guildId },
			include: {
				Guild: true,
			},
		});
	}
	async upsertSettingsForGuild(
		guildId: string,
		settings: {
			prefix: string;
			language: string;
			learningEnabled: boolean;
			pomodoroEnabled: boolean;
		},
	) {
		return await this.db.guildConfig.upsert({
			where: { guildId },
			update: {
				prefix: settings.prefix,
				language: settings.language,
				learningEnabled: settings.learningEnabled,
				pomodoroEnabled: settings.pomodoroEnabled,
			},
			create: {
				guildId,
				prefix: settings.prefix,
				language: settings.language,
				learningEnabled: settings.learningEnabled,
				pomodoroEnabled: settings.pomodoroEnabled,
			},
            include: {
                Guild: true,
            }
		}); 
	}
}
