import { REST, Routes } from "discord.js";
import { learnCommand, settingsCommand, helpCommand, setCommandId } from "@/commands";
import { env } from "@/config";

const rest = new REST({ version: "10" }).setToken(env.DISCORD_TOKEN);

export async function registerCommands() {
	const commands = await rest.put(Routes.applicationCommands(env.APP_ID), {
		body: [
			learnCommand.toJSON(),
			settingsCommand.toJSON(),
			helpCommand.toJSON(),
		],
	});
	for (const cmd of commands as { name: string; id: string }[]) {
		setCommandId(cmd.name, cmd.id);
		console.log(`Registered command: ${cmd.name} (ID: ${cmd.id})`);
	}
	console.log(`Successfully registered ${Array.isArray(commands) ? commands.length : 0} application commands.`);
}