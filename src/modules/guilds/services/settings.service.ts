import { GuildSettingsRepository } from "../repositories/settings.repository";

export class GuildSettingsService {
    private repo = new GuildSettingsRepository();
    async getSettingsForGuild(guildId: string) {
        if (!guildId) throw new Error("Guild ID is required to get settings.");
        return await this.repo.getSettingsForGuild(guildId);
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
        if (!guildId) throw new Error("Guild ID is required to upsert settings.");
        return await this.repo.upsertSettingsForGuild(guildId, settings);
    }
}