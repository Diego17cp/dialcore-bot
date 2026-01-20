import { SlashCommandBuilder } from "discord.js";

export const settingsCommand = new SlashCommandBuilder()
    .setName("settings")
    .setDescription("Manage bot settings")
    .addSubcommand((sub) =>
        sub
            .setName("user")
            .setDescription("Manage your personal settings")
    )
    .addSubcommand((sub) =>
        sub
            .setName("guild")
            .setDescription("Manage server settings (requires admin)")
    );