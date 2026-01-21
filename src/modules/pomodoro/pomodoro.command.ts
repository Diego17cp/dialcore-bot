import { ChatInputCommandInteraction } from "discord.js";
import { GuildSettingsService } from "../guilds";
import { pomodoroEmbeds, sharedEmbeds } from "@/ui";
import { PomodoroService } from "./pomodoro.service";

const guildSettingsService = new GuildSettingsService();
const pomodoroService = new PomodoroService();

export const handlePomodoroCommand = async (
	interaction: ChatInputCommandInteraction,
) => {
	const guildId = interaction.guildId;
	const sub = interaction.options.getSubcommand();
	if (interaction.inGuild() && guildId) {
		const settings = await guildSettingsService.getSettingsForGuild(guildId);
		if (!settings?.pomodoroEnabled) {
			return await interaction.reply({
				embeds: [pomodoroEmbeds.pomodoroDisabled()],
				flags: "Ephemeral",
			});
		}
	}
	try {
		switch (sub) {
			case "start": {
				const activePomodoro = await pomodoroService.getActiveByUser(interaction.user.id,);
				if (activePomodoro) {
					return await interaction.reply({
						embeds: [
							pomodoroEmbeds.alreadyActivePomodoro(
								activePomodoro.startedAt,
								activePomodoro.duration,
							),
						],
						flags: "Ephemeral",
					});
				}
				const duration = interaction.options.getInteger("duration",true,);
				const pomodoro = await pomodoroService.start(interaction.user.id,duration,);
				return await interaction.reply({
					embeds: [
						pomodoroEmbeds.pomodoroStarted(
							duration,
							pomodoro.startedAt,
						),
					],
				});
			}
			case "stop": {
				const activePomodoro = await pomodoroService.getActiveByUser(interaction.user.id,);
				if (!activePomodoro) {
					return await interaction.reply({
						embeds: [pomodoroEmbeds.noActivePomodoro()],
						flags: "Ephemeral",
					});
				}
				await pomodoroService.interrupt(interaction.user.id);
				return await interaction.reply({
					embeds: [
						pomodoroEmbeds.pomodoroCancelled(
							activePomodoro.endedAt || new Date(),
							activePomodoro.startedAt,
							activePomodoro.duration,
						),
					],
					flags: "Ephemeral",
				});
			}
			default:
				return await interaction.reply({
					embeds: [sharedEmbeds.unknownSubcommand()],
					flags: "Ephemeral",
				});
		}
	} catch (error) {
		console.error(error);
		return await interaction.reply({
			embeds: [sharedEmbeds.errorCommand()],
		});
	}
};
