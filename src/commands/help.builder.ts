import { SlashCommandBuilder } from "discord.js";

export const helpCommand = new SlashCommandBuilder()
    .setName("help")
    .setDescription("Get help with using the bot");