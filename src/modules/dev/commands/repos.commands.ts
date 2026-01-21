import { devEmbeds } from "@/ui";
import { getDevRepos } from "../services/github.service";
import { ChatInputCommandInteraction } from "discord.js";

export const handleReposCommand = async (interaction: ChatInputCommandInteraction) => {
    const username = interaction.options.getString("username", true);
    const data = await getDevRepos(username);
    return await interaction.reply({
        embeds: [devEmbeds.devReposEmbed(username, data)],
    })
}