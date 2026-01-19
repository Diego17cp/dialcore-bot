import { Interaction } from "discord.js";
import { GuildUserService } from "@/modules/guild-users";
import { GuildService } from "@/modules/guilds";
import { UserService } from "@/modules/users";

const usersService = new UserService();
const guildService = new GuildService();
const guildUserService = new GuildUserService();

export const interactionContextMiddleware = async (
	interaction: Interaction,
): Promise<void> => {
	const userId = interaction.user.id;	
	await usersService.sync({
		id: userId,
		username: interaction.user.username,
		avatar: interaction.user.avatarURL(),
	});
	if (interaction.guild) {
		const guildId = interaction.guild.id;
		await guildService.sync({
			id: guildId,
			name: interaction.guild.name,
		});
		await guildUserService.ensureMembership(guildId, userId);
		console.log(`✅ Context synced for user ${userId} in guild ${guildId}`);
	} else {
		console.log(`✅ Context synced for user ${userId} (DM)`);
	}
};
