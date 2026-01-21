import { Interaction } from "discord.js";
import { GuildUserService } from "@/modules/guild-users";
import { GuildService, GuildSettingsService } from "@/modules/guilds";
import { UserService, UserSettingsService } from "@/modules/users";

const usersService = new UserService();
const guildService = new GuildService();
const guildUserService = new GuildUserService();
const guildSettingsService = new GuildSettingsService();
const userSettingsService = new UserSettingsService();

export const interactionContextMiddleware = async (
	interaction: Interaction,
): Promise<void> => {
	const userId = interaction.user.id;	
	await usersService.sync({
		id: userId,
		username: interaction.user.username,
		avatar: interaction.user.avatarURL(),
	});
	const userSettings = await userSettingsService.getSettingsForUser(userId);
	if (!userSettings) await userSettingsService.upsertSettingsForUser(userId, {
		language: "en",
		timezone: "UTC",
		notificationsEnabled: true,
	})
	if (interaction.guild) {
		const guildId = interaction.guild.id;
		await guildService.sync({
			id: guildId,
			name: interaction.guild.name,
		});
		const guildSettings = await guildSettingsService.getSettingsForGuild(guildId);
		if (!guildSettings) await guildSettingsService.upsertSettingsForGuild(guildId, {
			language: "en",
			learningEnabled: true,
			pomodoroEnabled: true,
			devEnabled: true,
		})
		await guildUserService.ensureMembership(guildId, userId);
		console.log(`✅ Context synced for user ${userId} in guild ${guildId}`);
	} else {
		await 
		console.log(`✅ Context synced for user ${userId} (DM)`);
	}
};
