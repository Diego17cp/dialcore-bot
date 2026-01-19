import { Interaction } from "discord.js";
import type { InteractionContext } from "@/types/interaction";
import { GuildUserService } from "@/modules/guild-users";
import { GuildService, GuildSettingsService } from "@/modules/guilds";
import { UserService, UserSettingsService } from "@/modules/users";

const usersService = new UserService();
const guildService = new GuildService();
const guildUserService = new GuildUserService();
const userSettingsService = new UserSettingsService();
const guildSettingsService = new GuildSettingsService();

export const interactionContextMiddleware = async (
	interaction: Interaction,
): Promise<InteractionContext | null> => {
	if (!interaction.guild || !interaction.user) {
		console.warn("⚠️ Interaction without guild or user context");
		return null;
	}
	try {
		const guildId = interaction.guild.id;
		const userId = interaction.user.id;

		const guild = await guildService.sync({
			id: guildId,
			name: interaction.guild.name,
		});
		const user = await usersService.sync({
			id: userId,
			username: interaction.user.username,
			avatar: interaction.user.avatarURL(),
		});
		const userGuild = await guildUserService.ensureMembership(
			guild.id,
			user.id,
		);
        let userSettingsData = await userSettingsService.getSettingsForUser(user.id);
        if (!userSettingsData) {
            userSettingsData = await userSettingsService.upsertSettingsForUser(user.id, {
                language: "en",
                timezone: "UTC",
                notificationsEnabled: true,
            });
        }
        
        let guildSettingsData = await guildSettingsService.getSettingsForGuild(guild.id);
        if (!guildSettingsData) {
            guildSettingsData = await guildSettingsService.upsertSettingsForGuild(guild.id, {
                prefix: "/",
                language: "en",
                learningEnabled: true,
                pomodoroEnabled: true,
            });
        }
		return {
            interaction,
            guild: interaction.guild,
            user: interaction.user,
            userGuild,
            guildSettings: guildSettingsData,
            userSettings: userSettingsData,
        }
	} catch (error) {
		console.error("❌ Error in interaction context middleware:", error);
		throw error;
	}
};
