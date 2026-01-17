import { REST, Routes } from "discord.js";
import { learnCommand } from "@/commands";
import { env } from "@/config";

const rest = new REST({ version: "10" }).setToken(env.DISCORD_TOKEN);

export async function registerCommands() {
    await rest.put(
        Routes.applicationCommands(env.APP_ID),
        { body: [learnCommand.toJSON()] },
    )
    console.log("Commands registered.");
}